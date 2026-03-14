# CertMap — Backlog

> This file is the single source of truth for project scope.
> Updated alongside every PR. Neither human nor AI should rely on memory.

---

## MVP — In Progress

- [ ] Seed cert library (HTB CPTS, HTB CDSA, OSCP, OSDA, Security+, CySA+, CASP+, CISSP, CISM, GCIH, GCFA, GREM, TCM PMRP)
- [ ] Fetch exam via Groq — name in, structured scorecard out
- [ ] Roadmap builder — add/remove certs, set per-cert timeline in weeks
- [ ] Owned cert flag — exclude from cost and timeline, include in coherence scoring
- [ ] Visual completed state for owned certs in roadmap view
- [ ] Grading engine — market strength, cost/ROI, coherence, paper-chaser risk, burnout risk
- [ ] Per-cert job title unlock annotations on roadmap items
- [ ] Summary box — total cost, total timeline, letter grade
- [ ] Summary box job titles — two lists: Now (owned stack) and On Completion (full roadmap), 5 titles each
- [ ] Grade response includes subscores per dimension plus a short narrative
- [ ] localStorage persistence — roadmap and timelines survive page refresh
- [ ] Debounce on grading call — 2 second delay after add/remove, recalculating indicator
- [ ] Cooldown on fetch exam — prevents token spam
- [ ] Five cert tracks: Red / Blue / GRC / Management / Cloud
- [ ] Track colour coding on cert cards and roadmap items

---

## Planned — Agreed, Not Yet Scheduled

- [ ] Public deployment — Express serves Vite build as static files, single process, single port
- [ ] Shop LLM providers — evaluate OpenAI and Anthropic as alternatives to Groq post-MVP
- [ ] Swappable model config — single modelConfig.js controls provider, model name, temperature, max tokens

---

## Under Consideration — Not Yet Agreed

- [ ] User accounts and saved roadmaps per user
- [ ] Search API integration for fetch exam (Tavily or SerpAPI) — improves accuracy beyond Groq training knowledge
- [ ] Paul Jerimy roadmap cross-reference — on hold pending attribution decision

---

## Known Limitations

- [ ] Groq training cutoff means fetched cert data may be stale for recently launched or updated certs
- [ ] No auth on API endpoints in MVP — acceptable for local use, required before public deployment
- [ ] Client-side app — Groq key is server-side but API endpoints are open in MVP build

---

## Won't Do

- Nothing ruled out yet

---

## Attribution

> Pair programmed with Claude (Anthropic). All architecture decisions, product decisions,
> and code reviews by the human maintainer.
