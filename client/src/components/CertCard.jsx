// CertCard.jsx
// Displays a single cert in the library panel.
// Shows name, vendor, price, track badge, exam type badge,
// and ecosystem locked warning if applicable.
// Dims and disables the add button if the cert is already in the roadmap.

const TRACK_LABELS = {
  red:        "Red Team",
  blue:       "Blue Team",
  grc:        "GRC",
  management: "Management",
  cloud:      "Cloud",
}

const TRACK_BADGE_CLASS = {
  red:        "badge--red",
  blue:       "badge--blue",
  grc:        "badge--grc",
  management: "badge--mgmt",
  cloud:      "badge--cloud",
}

const TRACK_COLOR_CLASS = {
  red:        "track--red",
  blue:       "track--blue",
  grc:        "track--grc",
  management: "track--mgmt",
  cloud:      "track--cloud",
}

export default function CertCard({ cert, inRoadmap, onAdd }) {
  const trackColorClass = TRACK_COLOR_CLASS[cert.track] ?? ""
  const trackBadgeClass = TRACK_BADGE_CLASS[cert.track] ?? ""
  const examBadgeClass  = cert.examType === "hands-on" ? "badge--hands" : "badge--mcq"

  return (
    <div
      className={`cert-card ${trackColorClass} ${inRoadmap ? "cert-card--in-roadmap" : ""}`}
      title={cert.fullName}
    >
      <div className="cert-card__top">
        <div>
          <div className="cert-card__name">{cert.name}</div>
          <div className="cert-card__vendor">{cert.vendor}</div>
        </div>

        <div className="flex items-center gap-2">
          <span className="cert-card__price">
            ${cert.price.toLocaleString()}
          </span>

          {!inRoadmap && (
            <button
              className="btn btn--green btn--icon"
              onClick={() => onAdd(cert)}
              title={`Add ${cert.name} to roadmap`}
              aria-label={`Add ${cert.name} to roadmap`}
            >
              +
            </button>
          )}

          {inRoadmap && (
            <span
              className="badge badge--mcq"
              title="Already in roadmap"
            >
              ✓
            </span>
          )}
        </div>
      </div>

      <div className="cert-card__badges">
        <span className={`badge ${trackBadgeClass}`}>
          {TRACK_LABELS[cert.track] ?? cert.track}
        </span>

        <span className={`badge ${examBadgeClass}`}>
          {cert.examType}
        </span>

        {cert.ecosystemLocked && (
          <span className="badge badge--locked" title="Exam written against proprietary vendor training — training cost included in price">
            locked
          </span>
        )}

        <span className="badge badge--mcq">
          {cert.difficulty}/5
        </span>
      </div>
    </div>
  )
}