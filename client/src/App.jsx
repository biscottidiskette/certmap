// App.jsx
// Root component. Owns all application state.
// Wires together the cert library, roadmap, grading, and persistence.

import { useState, useEffect, useCallback, useRef } from "react"
import { seedCerts } from "./data/seedCerts"
import {
  loadRoadmap,
  saveRoadmap,
  loadTimelines,
  saveTimelines,
  loadOwned,
  saveOwned,
} from "./store/localStorage"
import { gradeRoadmap } from "./api/certmapApi"
import { healthCheck } from "./api/certmapApi"

import CertCard         from "./components/CertCard"
import RoadmapItem      from "./components/RoadmapItem"
import FetchExamPanel   from "./components/FetchExamPanel"
import ScorePanel       from "./components/ScorePanel"
import SummaryBar       from "./components/SummaryBar"

// Debounce delay before triggering a regrade after roadmap changes
const GRADE_DEBOUNCE_MS = 2000

export default function App() {

  // ── Cert library ──────────────────────────────────────────────────────────
  // Starts with seed certs. Fetched certs are appended at runtime.
  // Not persisted — seed data is always the baseline.
  const [library, setLibrary] = useState(seedCerts)

  // ── Roadmap ───────────────────────────────────────────────────────────────
  // Array of cert objects. Persisted to localStorage.
  const [roadmap, setRoadmap] = useState(() => {
    const saved = loadRoadmap()
    if (saved.length === 0) return []
    // Rehydrate from library so we always have fresh schema data
    // but preserve owned flag from persisted state
    return saved.map((savedCert) => {
      const fresh = seedCerts.find((c) => c.id === savedCert.id)
      return fresh
        ? { ...fresh, owned: savedCert.owned ?? false }
        : savedCert
    })
  })

  // ── Timelines ─────────────────────────────────────────────────────────────
  // User overrides for study weeks per cert. Persisted to localStorage.
  const [timelines, setTimelines] = useState(() => loadTimelines())

  // ── Owned cert ids ────────────────────────────────────────────────────────
  // Tracked separately so toggling owned doesn't require rebuilding roadmap.
  const [ownedIds, setOwnedIds] = useState(() => loadOwned())

  // ── Grade data ────────────────────────────────────────────────────────────
  const [gradeData, setGradeData]         = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // ── Server health ─────────────────────────────────────────────────────────
  const [serverOnline, setServerOnline] = useState(true)

  // ── Debounce ref ──────────────────────────────────────────────────────────
  const gradeTimerRef = useRef(null)

  // ── Derived roadmap with owned flags applied ──────────────────────────────
  const roadmapWithOwned = roadmap.map((cert) => ({
    ...cert,
    owned: ownedIds.includes(cert.id),
  }))

  // ── Persist roadmap on change ─────────────────────────────────────────────
  useEffect(() => {
    saveRoadmap(roadmapWithOwned)
  }, [roadmap, ownedIds])

  // ── Persist timelines on change ───────────────────────────────────────────
  useEffect(() => {
    saveTimelines(timelines)
  }, [timelines])

  // ── Persist owned ids on change ───────────────────────────────────────────
  useEffect(() => {
    saveOwned(ownedIds)
  }, [ownedIds])

  // ── Health check on mount ─────────────────────────────────────────────────
  useEffect(() => {
    healthCheck().then((online) => setServerOnline(online))
  }, [])

  // ── Trigger grading ───────────────────────────────────────────────────────
  // Debounced — waits GRADE_DEBOUNCE_MS after last change before calling API
  const triggerGrade = useCallback((roadmapSnapshot) => {
    if (roadmapSnapshot.length === 0) {
      setGradeData(null)
      setIsCalculating(false)
      return
    }

    // Show calculating state immediately so UI feels responsive
    setIsCalculating(true)

    if (gradeTimerRef.current) {
      clearTimeout(gradeTimerRef.current)
    }

    gradeTimerRef.current = setTimeout(async () => {
      try {
        const result = await gradeRoadmap(roadmapSnapshot)
        setGradeData(result)
      } catch (err) {
        console.error("Grade failed:", err.message)
        // Don't clear existing grade on error — keep last good result visible
      } finally {
        setIsCalculating(false)
      }
    }, GRADE_DEBOUNCE_MS)
  }, [])

  // ── Add cert to roadmap ───────────────────────────────────────────────────
  function handleAddCert(cert) {
    if (roadmap.find((c) => c.id === cert.id)) return

    const updated = [...roadmap, cert]
    setRoadmap(updated)

    const updatedWithOwned = updated.map((c) => ({
      ...c,
      owned: ownedIds.includes(c.id),
    }))
    triggerGrade(updatedWithOwned)
  }

  // ── Remove cert from roadmap ──────────────────────────────────────────────
  function handleRemoveCert(certId) {
    const updated = roadmap.filter((c) => c.id !== certId)
    setRoadmap(updated)

    const updatedWithOwned = updated.map((c) => ({
      ...c,
      owned: ownedIds.includes(c.id),
    }))
    triggerGrade(updatedWithOwned)
  }

  // ── Toggle owned ──────────────────────────────────────────────────────────
  function handleOwnedToggle(certId) {
    const updatedOwned = ownedIds.includes(certId)
      ? ownedIds.filter((id) => id !== certId)
      : [...ownedIds, certId]

    setOwnedIds(updatedOwned)

    const updatedWithOwned = roadmap.map((c) => ({
      ...c,
      owned: updatedOwned.includes(c.id),
    }))
    triggerGrade(updatedWithOwned)
  }

  // ── Update timeline override ──────────────────────────────────────────────
  function handleTimelineChange(certId, weeks) {
    setTimelines((prev) => ({ ...prev, [certId]: weeks }))
    // Timeline changes don't affect grading — no regrade needed
  }

  // ── Cert fetched from API ─────────────────────────────────────────────────
  // Appends to library. Does not auto-add to roadmap.
  function handleCertFetched(cert) {
    setLibrary((prev) => {
      if (prev.find((c) => c.id === cert.id)) return prev
      return [...prev, cert]
    })
  }

  // ── Roadmap cert ids for quick lookup ────────────────────────────────────
  const roadmapIds = new Set(roadmap.map((c) => c.id))

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="app-shell">

      {/* ── Header ── */}
      <header className="app-header">
        <div>
          <div className="app-header__logo">
            CERT<span>MAP</span>
          </div>
        </div>

        <div className="app-header__status">
          <span
            className={`status-dot ${serverOnline ? "" : "status-dot--offline"}`}
          />
          {serverOnline ? "server online" : "server offline"}
        </div>
      </header>

      {/* ── Body ── */}
      <div className="app-body">

        {/* ── Left panel — library + fetch ── */}
        <aside className="panel-left">

          {/* Fetch exam */}
          <div className="panel-section">
            <div className="panel-section__header">
              <span className="label">Fetch Exam</span>
            </div>
            <FetchExamPanel onCertFetched={handleCertFetched} />
          </div>

          {/* Cert library */}
          <div className="panel-section__header">
            <span className="label">Cert Library</span>
            <span className="panel-section__count">
              {library.length} certs
            </span>
          </div>

          <div className="cert-library">
            {library.map((cert) => (
              <CertCard
                key={cert.id}
                cert={cert}
                inRoadmap={roadmapIds.has(cert.id)}
                onAdd={handleAddCert}
              />
            ))}
          </div>

        </aside>

        {/* ── Right panel — roadmap + grades ── */}
        <main className="panel-right">

          {/* Summary bar */}
          <SummaryBar
            roadmap={roadmapWithOwned}
            timelines={timelines}
            gradeData={gradeData}
          />

          {/* Roadmap */}
          <div>
            <div className="section-heading">Roadmap</div>

            {roadmap.length === 0 ? (
              <div className="empty-state" style={{ marginTop: "12px" }}>
                <div className="empty-state__title">No certs added yet</div>
                Select certs from the library on the left to build your roadmap.
                <br />
                Mark certs you already own to exclude them from cost and timeline.
              </div>
            ) : (
              <div className="flex-col gap-2" style={{ marginTop: "12px" }}>
                {roadmapWithOwned.map((cert, index) => (
                  <RoadmapItem
                    key={cert.id}
                    cert={cert}
                    index={index}
                    timelineWeeks={timelines[cert.id] ?? cert.studyWeeks}
                    unlockTitle={gradeData?.certUnlocks?.[cert.id] ?? null}
                    onRemove={handleRemoveCert}
                    onTimelineChange={handleTimelineChange}
                    onOwnedToggle={handleOwnedToggle}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Score panel */}
          <ScorePanel
            gradeData={gradeData}
            isCalculating={isCalculating}
            hasRoadmap={roadmap.length > 0}
          />

        </main>
      </div>
    </div>
  )
}