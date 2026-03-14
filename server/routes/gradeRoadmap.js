// gradeRoadmap.js
// POST /api/grade-roadmap
// Accepts a roadmap array of cert objects and returns a structured grade.
//
// Response shape:
// {
//   grade: "B",
//   subscores: {
//     marketStrength: 78,
//     costRoi: 65,
//     coherence: 80,
//     paperChaserRisk: 70,
//     burnoutRisk: 85
//   },
//   narrative: "Short paragraph explaining the overall grade.",
//   jobTitlesNow: ["Title 1", "Title 2", ...],        // based on owned certs only
//   jobTitlesOnCompletion: ["Title 1", "Title 2", ...], // based on full roadmap
//   certUnlocks: {
//     "cert-id": "Job Title Unlocked At This Point"
//   }
// }

import { Router } from "express"
import { groqComplete } from "../lib/groqClient.js"

export const gradeRoadmapRouter = Router()

// Cooldown — prevents rapid regrade spam
const cooldowns = new Map()
const COOLDOWN_MS = 2000 // 2 seconds, debounce handled on client too

gradeRoadmapRouter.post("/", async (req, res) => {
  const { roadmap } = req.body

  // Validation
  if (!roadmap || !Array.isArray(roadmap)) {
    return res.status(400).json({
      error: "roadmap is required and must be an array."
    })
  }

  if (roadmap.length === 0) {
    return res.status(400).json({
      error: "roadmap must contain at least one cert."
    })
  }

  if (roadmap.length > 20) {
    return res.status(400).json({
      error: "roadmap cannot contain more than 20 certs."
    })
  }

  // Cooldown check — keyed by a hash of cert ids to be request-specific
  const roadmapKey = roadmap.map((c) => c.id).join(",")
  const lastRequest = cooldowns.get(roadmapKey)
  const now = Date.now()

  if (lastRequest && now - lastRequest < COOLDOWN_MS) {
    return res.status(429).json({
      error: "Please wait before regrading."
    })
  }

  cooldowns.set(roadmapKey, now)

  // Separate owned vs planned for prompt clarity
  const ownedCerts = roadmap.filter((c) => c.owned === true)
  const plannedCerts = roadmap.filter((c) => c.owned !== true)

  // Build a readable cert summary for the prompt
  const formatCert = (c) =>
    `- ${c.name} (${c.vendor}) | Track: ${c.track} | Price: $${c.price} | ` +
    `Type: ${c.examType} | Difficulty: ${c.difficulty}/5 | ` +
    `Market: ${c.market}/100 | EcosystemLocked: ${c.ecosystemLocked ?? false} | ` +
    `Tags: ${c.tags?.join(", ")}`

  const ownedSection = ownedCerts.length > 0
    ? `OWNED CERTS (already achieved — exclude from cost and timeline, include in coherence):\n${ownedCerts.map(formatCert).join("\n")}`
    : "OWNED CERTS: None"

  const plannedSection = plannedCerts.length > 0
    ? `PLANNED CERTS (not yet achieved — include in all scoring):\n${plannedCerts.map(formatCert).join("\n")}`
    : "PLANNED CERTS: None"

  const messages = [
    {
      role: "system",
      content: `You are a senior cybersecurity career advisor and certification strategist.
You will be given a certification roadmap split into owned certs and planned certs.
Your job is to grade the overall roadmap and return structured JSON only.
Return ONLY a valid JSON object — no markdown, no code fences, no explanation.

Grade the roadmap on these five dimensions (each scored 0-100, higher is better):

1. marketStrength — How recognised and in-demand are these certs in real hiring markets?
   Consider: job posting frequency, employer recognition, industry reputation.

2. costRoi — Is the financial investment justified by the career outcome?
   Consider: total cost of planned certs only (not owned), value delivered per dollar,
   whether ecosystemLocked certs (e.g. SANS) dominate the spend without proportional return,
   whether cheaper alternatives exist that deliver similar market value.
   Penalise heavily for ecosystemLocked cert stacking.

3. coherence — Does this stack tell a clear, focused career story?
   Consider: are the tracks consistent (all red, all blue, etc.)?
   Penalise for mixing red/blue/management without clear seniority progression logic.
   Reward for logical progression within a track (entry → mid → senior).
   A deliberate T-shaped stack (one deep track plus one complementary cert) is acceptable.

4. paperChaserRisk — Is this a meaningful skills roadmap or a cert collection?
   Consider: ratio of hands-on to MCQ certs, whether certs build on each other,
   whether the stack suggests real skill development or badge hunting.
   Penalise for all-MCQ stacks. Reward for hands-on and practical certs.

5. burnoutRisk — Is the volume and difficulty realistic?
   Consider: total number of planned certs, cumulative difficulty,
   whether the person is setting themselves up for exhaustion.
   Penalise for more than 6 planned certs or stacking multiple difficulty-5 certs back to back.
   This score represents sustainability — higher score means lower burnout risk.

6. prerequisitesGap — Does the owned stack provide a reasonable foundation for the planned certs?
   Consider: whether the person is attempting advanced certs without evident foundational knowledge,
   whether the planned certs assume skills that owned certs do not demonstrate,
   whether the jump in difficulty between owned and planned is realistic.
   Reward for logical skill progression. Penalise for attempting difficulty-4 or 5 certs
   with no demonstrated foundation in that track.
   If there are no owned certs, score conservatively at 50 — cannot assess foundation.

7. vendorConcentration — Is the stack dangerously dependent on a single vendor ecosystem?
   Consider: what percentage of certs come from one vendor,
   whether the person's entire identity is tied to one vendor's hiring circle,
   whether removing one vendor's recognition from the market would significantly damage employability.
   Reward for vendor diversity across two or more respected vendors.
   Penalise for stacking 3 or more certs from the same vendor, especially ecosystemLocked vendors.

Overall grade rules:
- Average all seven subscores into an overall percentage
- Map to letter grade: 90-100 = A, 80-89 = B, 70-79 = C, 60-69 = D, below 60 = F
- narrative: 2-3 sentences. Be direct and specific. Name the certs. Do not be generic.

Job titles:
- jobTitlesNow: up to 5 specific job titles the person can realistically target TODAY based only on owned certs. Empty array if no owned certs.
- jobTitlesOnCompletion: up to 5 specific job titles reachable on completing the full roadmap.
- Titles should be specific: "SOC Analyst Tier 2" not "Security Analyst".

certUnlocks:
- For each cert in the full roadmap (owned and planned), return the single most significant job title that becomes accessible when that cert is added to the cumulative stack.
- Keyed by cert id exactly as provided.
- Consider the cumulative stack up to and including that cert, in roadmap order.

Return this exact JSON shape:
{
  "grade": "B",
  "subscores": {
    "marketStrength": 0,
    "costRoi": 0,
    "coherence": 0,
    "paperChaserRisk": 0,
    "burnoutRisk": 0,
    "prerequisitesGap": 0,
    "vendorConcentration": 0
  },
  "narrative": "",
  "jobTitlesNow": [],
  "jobTitlesOnCompletion": [],
  "certUnlocks": {}
}`
    },
    {
      role: "user",
      content: `Grade this certification roadmap:\n\n${ownedSection}\n\n${plannedSection}`
    }
  ]

  let rawContent

  try {
    rawContent = await groqComplete(messages, { maxTokens: 1024 })
  } catch (err) {
    return res.status(502).json({
      error: `LLM request failed: ${err.message}`
    })
  }

  // Defensively strip markdown fences
  let gradeData

  try {
    const cleaned = rawContent
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim()

    gradeData = JSON.parse(cleaned)
  } catch {
    return res.status(502).json({
      error: "LLM returned a response that could not be parsed as JSON.",
      raw: rawContent
    })
  }

  // Validate required fields
  const requiredFields = [
    "grade", "subscores", "narrative",
    "jobTitlesNow", "jobTitlesOnCompletion", "certUnlocks"
  ]

  const missingFields = requiredFields.filter(
    (field) => gradeData[field] === undefined
  )

  if (missingFields.length > 0) {
    return res.status(502).json({
      error: `LLM response missing required fields: ${missingFields.join(", ")}`,
      raw: rawContent
    })
  }

  return res.status(200).json(gradeData)
})