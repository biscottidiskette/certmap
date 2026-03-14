// fetchExam.js
// POST /api/fetch-exam
// Accepts a cert name, asks Groq to return a structured cert object
// matching the seedCerts schema exactly.
// Returns the parsed cert object or a structured error.

import { Router } from "express"
import { groqComplete } from "../lib/groqClient.js"

export const fetchExamRouter = Router()

// Cooldown tracking — prevents token spam per exam name
// Keyed by normalised exam name, value is timestamp of last request
const cooldowns = new Map()
const COOLDOWN_MS = 10000 // 10 seconds

fetchExamRouter.post("/", async (req, res) => {
  const { examName } = req.body

  // Basic input validation
  if (!examName || typeof examName !== "string") {
    return res.status(400).json({
      error: "examName is required and must be a string."
    })
  }

  const normalisedName = examName.trim().toLowerCase()

  if (normalisedName.length < 2) {
    return res.status(400).json({
      error: "examName is too short."
    })
  }

  // Cooldown check
  const lastRequest = cooldowns.get(normalisedName)
  const now = Date.now()

  if (lastRequest && now - lastRequest < COOLDOWN_MS) {
    const remainingSeconds = Math.ceil(
      (COOLDOWN_MS - (now - lastRequest)) / 1000
    )
    return res.status(429).json({
      error: `Please wait ${remainingSeconds}s before fetching this exam again.`
    })
  }

  cooldowns.set(normalisedName, now)

  // Build the prompt
  const messages = [
    {
      role: "system",
      content: `You are a cybersecurity certification data assistant.
Your job is to return structured JSON data about a certification exam.
You must return ONLY a valid JSON object — no markdown, no code fences, no explanation.
If you do not have reliable information about the cert, return a JSON object with an "error" field explaining why.

The JSON object must match this schema exactly:
{
  "id": "kebab-case-unique-slug",
  "name": "Short display name",
  "fullName": "Full official certification name",
  "vendor": "Issuing organisation",
  "track": "one of: red | blue | grc | management | cloud",
  "price": 0,
  "examType": "one of: hands-on | mcq | hybrid",
  "ecosystemLocked": false,
  "studyWeeks": 0,
  "market": 0,
  "difficulty": 0,
  "expires": false,
  "renewYears": null,
  "roles": ["Job Title 1", "Job Title 2"],
  "tags": ["tag1", "tag2"],
  "description": "One to two sentence summary."
}

Field rules:
- price: USD integer, exam fee only unless the vendor requires purchasing proprietary training to sit the exam (ecosystemLocked: true), in which case include total cost
- ecosystemLocked: true only if the exam is written against proprietary vendor training material that must be purchased
- studyWeeks: integer, estimated weeks to prepare from a competent baseline
- market: integer 0-100, how recognised this cert is in job postings and hiring
- difficulty: integer 1-5 where 1 is entry level and 5 is expert
- renewYears: null if expires is false, otherwise integer years until renewal required
- track: red = offensive/red team, blue = defensive/SOC/DFIR, grc = governance risk compliance, management = leadership/CISO, cloud = cloud security`
    },
    {
      role: "user",
      content: `Return the cert data JSON object for: ${examName.trim()}`
    }
  ]

  let rawContent

  try {
    rawContent = await groqComplete(messages)
  } catch (err) {
    return res.status(502).json({
      error: `LLM request failed: ${err.message}`
    })
  }

  // Parse the response — Groq should return clean JSON but we defensively strip
  // any accidental markdown fences just in case
  let certData

  try {
    const cleaned = rawContent
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim()

    certData = JSON.parse(cleaned)
  } catch {
    return res.status(502).json({
      error: "LLM returned a response that could not be parsed as JSON.",
      raw: rawContent
    })
  }

  // If the LLM returned an error field it couldn't find the cert
  if (certData.error) {
    return res.status(404).json({
      error: certData.error
    })
  }

  // Validate required fields are present before returning
  const requiredFields = [
    "id", "name", "fullName", "vendor", "track", "price",
    "examType", "studyWeeks", "market", "difficulty",
    "expires", "roles", "tags", "description"
  ]

  const missingFields = requiredFields.filter(
    (field) => certData[field] === undefined
  )

  if (missingFields.length > 0) {
    return res.status(502).json({
      error: `LLM response is missing required fields: ${missingFields.join(", ")}`,
      raw: rawContent
    })
  }

  return res.status(200).json(certData)
})