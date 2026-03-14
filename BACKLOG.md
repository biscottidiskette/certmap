# CertMap — Backlog

> This file is the single source of truth for project scope.
> Updated alongside every PR. Neither human nor AI should rely on memory.

---

## MVP — Completed

- [x] Seed cert library (HTB CPTS, HTB CDSA, OSCP, OSDA, Security+, CySA+, CASP+, CISSP, CISM, GCIH, GCFA, GREM, TCM PMRP)
- [x] Fetch exam via Groq — name in, structured scorecard out
- [x] Roadmap builder — add/remove certs, set per-cert timeline in weeks
- [x] Owned cert flag — exclude from cost and timeline, include in coherence scoring
- [x] Visual completed state for owned certs in roadmap view
- [x] Grading engine — 7 dimensions, field-driven scoring
- [x] Per-cert job title unlock annotations on roadmap items
- [x] Summary box — total cost, total timeline, letter grade
- [x] Summary box job titles — two lists: Now (owned stack) and On Completion (full roadmap), 5 titles each
- [x] Grade response includes subscores per dimension plus narrative
- [x] localStorage persistence — roadmap and timelines survive page refresh
- [x] Debounce on grading call — 2 second delay after add/remove
- [x] Cooldown on fetch exam — prevents token spam
- [x] Five cert tracks: Red / Blue / GRC / Management / Cloud
- [x] Track colour coding on cert cards and roadmap items
- [x] certUnlocks key normalisation — LLM name variants mapped to cert ids server-side
- [x] Initial grade on mount — grades existing roadmap on page load without requiring interaction

---

## Known Bugs — Needs Fixing

- [X] Paper Chaser Risk scoring formula is miscalibrated — additive from zero hits ceiling
  issues and the LLM interprets it inconsistently. Current formula gives 72 for a stack
  of 3 hands-on and 1 MCQ cert which is too low. Needs a ratio-based formula:
  (hands-on / total) * 100, adjusted for bonuses, rather than additive point accumulation.

- [ ] Fetched cert data accuracy unreliable for newer or smaller vendors — PNTP returned
  wrong vendor (Mile2 instead of TCM Security) and wrong exam type (MCQ instead of hands-on).
  Groq training knowledge drifts on less prominent vendors.

---

## Planned — Agreed, Not Yet Scheduled

- [ ] Public deployment — Express serves Vite build as static files, single process, single port
- [ ] Shop LLM providers — evaluate OpenAI and Anthropic as alternatives to Groq post-MVP
- [ ] Swappable model config — single modelConfig.js controls provider, model name, temperature,
  max tokens (architecture already in place, needs provider abstraction layer)
- [ ] Edit cert functionality — allow manual correction of fetched cert data before adding
  to library, addresses accuracy issues with smaller vendors
- [ ] Auth on API endpoints — required before public deployment, currently open

---

## Under Consideration — Not Yet Agreed

- [ ] User accounts and saved roadmaps per user
- [ ] Search API integration for fetch exam (Tavily or SerpAPI) — improves accuracy beyond
  Groq training knowledge, directly addresses fetched cert accuracy bug
- [ ] Cert price verification pass — prices verified against live vendor sites before
  public launch, add priceVerified boolean to schema
- [ ] Geographic market relevance scoring — CISM recognition varies significantly by region,
  needs user location data and complicates prompt
- [ ] Drag to reorder roadmap items — currently fixed order by add sequence

---

## Won't Do

- Paul Jerimy roadmap cross-reference — attribution concerns, project stands on its own

---

## Known Limitations

- [ ] Groq training cutoff means fetched cert data may be stale for recently launched
  or updated certs — search API integration is the long term fix
- [ ] No auth on API endpoints in MVP — acceptable for local use, required before
  public deployment
- [ ] Groq free tier rate limits apply — heavy usage may hit limits, LLM provider
  swap is in Planned backlog

---

## Attribution

> Pair programmed with Claude (Anthropic). All architecture decisions, product decisions,
> and code reviews by the human maintainer.