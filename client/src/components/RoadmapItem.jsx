// RoadmapItem.jsx
// Single row in the roadmap list.
// Shows position index, cert name, price, timeline input,
// owned toggle, job title unlock annotation, and remove button.
// Owned certs are visually distinct and excluded from cost/timeline totals.

import { useState } from "react"

const TRACK_COLOR_CLASS = {
  red:        "track--red",
  blue:       "track--blue",
  grc:        "track--grc",
  management: "track--mgmt",
  cloud:      "track--cloud",
}

export default function RoadmapItem({
  cert,
  index,
  timelineWeeks,
  unlockTitle,
  onRemove,
  onTimelineChange,
  onOwnedToggle,
}) {
  const [weekInput, setWeekInput] = useState(
    timelineWeeks ?? cert.studyWeeks ?? ""
  )

  const trackColorClass = TRACK_COLOR_CLASS[cert.track] ?? ""
  const isOwned = cert.owned === true

  function handleWeekBlur() {
    const parsed = parseInt(weekInput, 10)
    if (!isNaN(parsed) && parsed > 0) {
      onTimelineChange(cert.id, parsed)
    } else {
      // Reset to last valid value if input is bad
      setWeekInput(timelineWeeks ?? cert.studyWeeks ?? "")
    }
  }

  function handleWeekKeyDown(e) {
    if (e.key === "Enter") e.target.blur()
  }

  return (
    <div className={`roadmap-item ${trackColorClass} ${isOwned ? "roadmap-item--owned" : ""}`}>

      {/* Position index */}
      <div className="roadmap-item__index">
        {index + 1}
      </div>

      {/* Main body */}
      <div className="roadmap-item__body">
        <div className="roadmap-item__name">{cert.name}</div>

        <div className="roadmap-item__meta">
          <span className="roadmap-item__meta-item">
            {cert.vendor}
          </span>

          {!isOwned && (
            <span className="roadmap-item__meta-item roadmap-item__meta-item--price">
              ${cert.price.toLocaleString()}
            </span>
          )}

          {isOwned && (
            <span className="roadmap-item__meta-item" style={{ color: "var(--green)" }}>
              owned — excluded from cost
            </span>
          )}
        </div>

        {/* Job title unlock annotation */}
        {unlockTitle && (
          <div className="roadmap-item__unlock">
            <span className="roadmap-item__unlock-icon">🔓</span>
            <span>{unlockTitle}</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="roadmap-item__controls">

        {/* Timeline input — hidden for owned certs */}
        {!isOwned && (
          <div className="timeline-control">
            <input
              type="number"
              min="1"
              max="104"
              className="input input--mono input--small"
              value={weekInput}
              onChange={(e) => setWeekInput(e.target.value)}
              onBlur={handleWeekBlur}
              onKeyDown={handleWeekKeyDown}
              title="Estimated study weeks"
              aria-label={`Study weeks for ${cert.name}`}
            />
            <span className="timeline-control__label">wks</span>
          </div>
        )}

        {/* Owned toggle */}
        <button
          className={`btn btn--icon ${isOwned ? "btn--green" : "btn--ghost"}`}
          onClick={() => onOwnedToggle(cert.id)}
          title={isOwned ? "Mark as not yet owned" : "Mark as already owned"}
          aria-label={isOwned ? "Mark as not yet owned" : "Mark as already owned"}
        >
          {isOwned ? "✓" : "○"}
        </button>

        {/* Remove button */}
        <button
          className="btn btn--danger btn--icon"
          onClick={() => onRemove(cert.id)}
          title={`Remove ${cert.name} from roadmap`}
          aria-label={`Remove ${cert.name} from roadmap`}
        >
          ✕
        </button>

      </div>
    </div>
  )
}