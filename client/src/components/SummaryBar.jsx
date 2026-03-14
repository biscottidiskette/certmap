// SummaryBar.jsx
// Displays total cost, estimated timeline, current grade,
// and job title suggestions (now vs on completion).
// Owned certs are excluded from cost and timeline totals.

export default function SummaryBar({ roadmap, timelines, gradeData }) {

  // Cost — planned certs only (owned === true excluded)
  const totalCost = roadmap
    .filter((cert) => cert.owned !== true)
    .reduce((sum, cert) => sum + (cert.price ?? 0), 0)

  // Timeline — planned certs only, uses user override if set
  const totalWeeks = roadmap
    .filter((cert) => cert.owned !== true)
    .reduce((sum, cert) => {
      const weeks = timelines[cert.id] ?? cert.studyWeeks ?? 0
      return sum + weeks
    }, 0)

  const totalMonths = totalWeeks > 0
    ? (totalWeeks / 4.33).toFixed(1)
    : null

  const grade     = gradeData?.grade ?? null
  const titlesNow = gradeData?.jobTitlesNow ?? []
  const titlesDone = gradeData?.jobTitlesOnCompletion ?? []

  const hasJobTitles = titlesNow.length > 0 || titlesDone.length > 0

  return (
    <div className="flex-col gap-3">

      {/* ── Metric strip ── */}
      <div className="summary-bar">

        <div className="summary-cell">
          <div className="summary-cell__label">Total Cost</div>
          <div className="summary-cell__value summary-cell__value--cost">
            {roadmap.length === 0
              ? "—"
              : `$${totalCost.toLocaleString()}`
            }
          </div>
        </div>

        <div className="summary-cell">
          <div className="summary-cell__label">Est. Timeline</div>
          <div className="summary-cell__value summary-cell__value--timeline">
            {totalMonths !== null && roadmap.length > 0
              ? `${totalMonths}mo`
              : "—"
            }
          </div>
        </div>

        <div className="summary-cell">
          <div className="summary-cell__label">Grade</div>
          <div className="summary-cell__value summary-cell__value--grade">
            {grade ?? "—"}
          </div>
        </div>

      </div>

      {/* ── Job titles panel ── */}
      {hasJobTitles && (
        <div className="job-titles-panel">

          <div className="job-titles-panel__header">
            <div className="label">Career Targets</div>
          </div>

          <div className="job-titles-panel__body">

            {/* Now column */}
            <div className="job-titles-col">
              <div className="job-titles-col__heading job-titles-col__heading--now">
                Now
              </div>
              {titlesNow.length > 0
                ? titlesNow.map((title, i) => (
                    <div key={i} className="job-title-item">
                      {title}
                    </div>
                  ))
                : (
                  <div className="text-muted text-xs">
                    Mark owned certs to see current targets
                  </div>
                )
              }
            </div>

            {/* On completion column */}
            <div className="job-titles-col">
              <div className="job-titles-col__heading job-titles-col__heading--completion">
                On Completion
              </div>
              {titlesDone.length > 0
                ? titlesDone.map((title, i) => (
                    <div key={i} className="job-title-item">
                      {title}
                    </div>
                  ))
                : (
                  <div className="text-muted text-xs">
                    Add planned certs to see future targets
                  </div>
                )
              }
            </div>

          </div>
        </div>
      )}

    </div>
  )
}