// ScorePanel.jsx
// Displays the roadmap grade, seven subscore bars, and narrative.
// Three states: empty (no roadmap), calculating (waiting on API), graded (result ready).

const DIMENSIONS = [
  { key: "marketStrength",     label: "Market Strength" },
  { key: "costRoi",            label: "Cost / ROI" },
  { key: "coherence",          label: "Coherence" },
  { key: "paperChaserRisk",    label: "Paper Chaser Risk" },
  { key: "burnoutRisk",        label: "Burnout Risk" },
  { key: "prerequisitesGap",   label: "Prerequisites Gap" },
  { key: "vendorConcentration", label: "Vendor Concentration" },
]

function scoreToColor(score) {
  if (score >= 80) return "var(--grade-a)"
  if (score >= 65) return "var(--grade-b)"
  if (score >= 50) return "var(--grade-c)"
  if (score >= 35) return "var(--grade-d)"
  return "var(--grade-f)"
}

function GradeBadge({ grade }) {
  if (!grade) {
    return (
      <div className="grade-display grade-display--pending">
        —
      </div>
    )
  }

  // Strip +/- modifiers for CSS class lookup if LLM adds them
  const letter = grade.charAt(0).toUpperCase()
  const gradeClass = ["A","B","C","D","F"].includes(letter)
    ? `grade-display--${letter}`
    : "grade-display--pending"

  return (
    <div className={`grade-display ${gradeClass}`}>
      {grade}
    </div>
  )
}

function ScoreDimension({ label, value }) {
  const displayValue = typeof value === "number" ? value : 0
  const color = scoreToColor(displayValue)

  return (
    <div className="score-dim">
      <div className="score-dim__label">{label}</div>
      <div className="score-dim__bar-row">
        <div className="score-dim__track">
          <div
            className="score-dim__fill"
            style={{
              width: `${displayValue}%`,
              background: color,
            }}
          />
        </div>
        <div className="score-dim__value" style={{ color }}>
          {displayValue}
        </div>
      </div>
    </div>
  )
}

export default function ScorePanel({ gradeData, isCalculating, hasRoadmap }) {

  // Empty state — no certs in roadmap yet
  if (!hasRoadmap) {
    return (
      <div className="score-panel">
        <div className="score-panel__header">
          <div>
            <div className="label">Roadmap Grade</div>
            <div className="text-muted text-xs mt-1">
              Add certs to your roadmap to receive a grade
            </div>
          </div>
          <GradeBadge grade={null} />
        </div>
      </div>
    )
  }

  return (
    <div className="score-panel">

      {/* Header with grade badge */}
      <div className="score-panel__header">
        <div>
          <div className="label">Roadmap Grade</div>
          {isCalculating && (
            <div className="text-muted text-xs mt-1">
              Recalculating...
            </div>
          )}
          {!isCalculating && gradeData && (
            <div className="text-muted text-xs mt-1">
              Based on {gradeData.subscores ? Object.keys(gradeData.subscores).length : 0} dimensions
            </div>
          )}
        </div>
        <GradeBadge grade={gradeData?.grade ?? null} />
      </div>

      {/* Subscore bars */}
      <div className="score-panel__dims">
        {DIMENSIONS.map(({ key, label }) => (
          <ScoreDimension
            key={key}
            label={label}
            value={gradeData?.subscores?.[key] ?? 0}
          />
        ))}
      </div>

      {/* Narrative or calculating indicator */}
      {isCalculating && (
        <div className="score-panel__calculating">
          <span className="spinner" />
          Analysing your roadmap...
        </div>
      )}

      {!isCalculating && gradeData?.narrative && (
        <div className="score-panel__narrative">
          {gradeData.narrative}
        </div>
      )}

      {!isCalculating && !gradeData && (
        <div className="score-panel__calculating">
          Waiting for first grade...
        </div>
      )}

    </div>
  )
}