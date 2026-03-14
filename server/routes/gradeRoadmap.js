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
You will be given a certification roadmap split into OWNED certs and PLANNED certs.
Your job is to grade the overall roadmap and return structured JSON only.
Return ONLY a valid JSON object — no markdown, no code fences, no explanation.

CRITICAL RULES BEFORE SCORING:
- You will receive structured data fields for each cert. You MUST use those fields directly. Do not reason from general knowledge when a field provides the answer.
- examType field values are: "hands-on", "mcq", or "hybrid". Use these exactly.
- vendor field is the exact vendor name. Count distinct vendor field values to measure concentration.
- ecosystemLocked field is a boolean. Only certs with ecosystemLocked: true are locked ecosystems.
- owned field: true = person already holds this cert. false = planned, not yet achieved.
- All scores are 0-100 where HIGHER is BETTER (100 = best possible outcome for that dimension).

DIMENSION 1 — marketStrength (0-100, higher = more market recognised)
Use the market field (0-100) provided for each cert — it is already a market recognition score.
Average the market scores across ALL certs (owned and planned).
Adjust slightly up or down based on whether the combination is coherent for a specific role.

DIMENSION 2 — costRoi (0-100, higher = better ROI)
Only consider PLANNED certs (owned: false) for cost.
If there are no planned certs, score 100 — no spend required.
Start at 100 and penalise as follows:
- Each ecosystemLocked: true cert in planned: -15 points each
- Total planned cost over $5,000: -10 points
- Total planned cost over $10,000: additional -15 points
- Each planned cert where a cheaper alternative with market score within 10 points exists: -5 points
Reward: if all planned certs are hands-on or hybrid: +5 points. Floor at 0, ceiling at 100.

DIMENSION 3 — coherence (0-100, higher = more focused career story)
Count the distinct track field values across ALL certs (owned and planned).
- 1 distinct track: score 95
- 2 distinct tracks: score 80 if one is a logical complement (e.g. red+blue, blue+grc), else 65
- 3 distinct tracks: score 55 if there is clear seniority progression logic, else 40
- 4+ distinct tracks: score 25
Bonus +5 if certs show clear difficulty progression (entry → mid → senior) within primary track.

DIMENSION 4 — paperChaserRisk (0-100, higher = less paper chasing)
Count examType field values across ALL certs.
- hands-on count: each scores +12 points (base 0, ceiling 100)
- hybrid count: each scores +8 points
- mcq count: each scores +3 points
If hands-on certs outnumber mcq certs: bonus +10.
If all certs are hands-on or hybrid: score 100.
If all certs are mcq: score 20 maximum regardless of count.

DIMENSION 5 — burnoutRisk (0-100, higher = more sustainable / lower burnout risk)
Only consider PLANNED certs (owned: false) for burnout assessment.
If there are no planned certs, score 100 — nothing left to burn out on.
Start at 100 and penalise:
- More than 3 planned certs: -8 points per cert above 3
- Any planned cert with difficulty: 5 — -5 points each
- Two or more consecutive difficulty: 5 planned certs: -10 points additional
Floor at 0, ceiling at 100.

DIMENSION 6 — prerequisitesGap (0-100, higher = better foundation match)
Only evaluate PLANNED certs against OWNED certs as foundation.
If there are no planned certs, score 100 — no gap possible.
If there are no owned certs and planned certs include difficulty 4 or 5: score 40.
If there are no owned certs and planned certs are all difficulty 1-3: score 65.
For each planned cert, check if owned certs include at least one cert in the same track or a foundational track:
- Planned cert has a matching track in owned certs: no penalty
- Planned cert difficulty <= 3 with no matching track owned: -5 points
- Planned cert difficulty 4 with no matching track owned: -15 points
- Planned cert difficulty 5 with no matching track owned: -20 points
Start at 100, apply penalties, floor at 0.

DIMENSION 7 — vendorConcentration (0-100, higher = better diversity)
Count distinct vendor field values across ALL certs.
- 4+ distinct vendors: score 100
- 3 distinct vendors: score 85
- 2 distinct vendors: score 65
- 1 vendor (all certs same vendor): score 30
Additional penalty: if any single vendor accounts for 3 or more certs: -10 points.
Additional penalty: if the dominant vendor has ecosystemLocked: true: -10 points additional.
Floor at 0, ceiling at 100.

OVERALL GRADE:
Average all seven dimension scores into an overall percentage.
Map to letter grade: 90-100 = A, 80-89 = B, 70-79 = C, 60-69 = D, below 60 = F.
narrative: 2-3 sentences. Be direct and specific. Name actual cert names. Do not be generic.
Mention the single biggest strength and single biggest weakness of the stack.

JOB TITLES:
jobTitlesNow: up to 5 specific job titles the person can realistically target TODAY using only owned certs.
Empty array if no owned certs.
jobTitlesOnCompletion: up to 5 specific job titles reachable on completing the full roadmap.
Be specific: "SOC Analyst Tier 2" not "Security Analyst", "Junior Penetration Tester" not "Pen Tester".

CERT UNLOCKS:
For each cert in the roadmap, return the single most significant job title unlocked when that cert is added to the cumulative stack up to that point.
Key MUST be the cert id field exactly as provided in the input data — not the name, not the fullName, the id field value.

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

  // Normalise certUnlocks keys — LLM returns short names instead of ids.
  // Build a lookup map from name variants to cert id and remap.
  if (gradeData.certUnlocks && typeof gradeData.certUnlocks === "object") {
    const nameToId = {}
    roadmap.forEach((cert) => {
      // Map every reasonable variant the LLM might use as a key
      nameToId[cert.name.toLowerCase()]     = cert.id
      nameToId[cert.id.toLowerCase()]       = cert.id
      nameToId[cert.fullName.toLowerCase()] = cert.id
    })

    const normalised = {}
    Object.entries(gradeData.certUnlocks).forEach(([key, value]) => {
      const matched = nameToId[key.toLowerCase()]
      if (matched) {
        normalised[matched] = value
      } else {
        // Keep unmatched keys as-is rather than silently drop them
        normalised[key] = value
      }
    })
    gradeData.certUnlocks = normalised
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