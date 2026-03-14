// localStorage.js
// All localStorage read/write operations for CertMap.
// Nothing else in the app touches localStorage directly.
//
// Persisted keys:
// certmap_roadmap     — array of cert objects in the user's roadmap
// certmap_timelines   — object keyed by cert id, value is studyWeeks override
// certmap_owned       — array of cert ids the user has marked as owned

const KEYS = {
  ROADMAP: "certmap_roadmap",
  TIMELINES: "certmap_timelines",
  OWNED: "certmap_owned",
}

// ─── Roadmap ──────────────────────────────────────────────────────────────────

export function loadRoadmap() {
  try {
    const raw = localStorage.getItem(KEYS.ROADMAP)
    return raw ? JSON.parse(raw) : []
  } catch {
    console.warn("CertMap: failed to load roadmap from localStorage")
    return []
  }
}

export function saveRoadmap(roadmap) {
  try {
    localStorage.setItem(KEYS.ROADMAP, JSON.stringify(roadmap))
  } catch {
    console.warn("CertMap: failed to save roadmap to localStorage")
  }
}

// ─── Timelines ────────────────────────────────────────────────────────────────
// Timelines are user overrides for how long they expect to spend on each cert.
// Stored separately so they survive cert reordering in the roadmap.

export function loadTimelines() {
  try {
    const raw = localStorage.getItem(KEYS.TIMELINES)
    return raw ? JSON.parse(raw) : {}
  } catch {
    console.warn("CertMap: failed to load timelines from localStorage")
    return {}
  }
}

export function saveTimelines(timelines) {
  try {
    localStorage.setItem(KEYS.TIMELINES, JSON.stringify(timelines))
  } catch {
    console.warn("CertMap: failed to save timelines to localStorage")
  }
}

// ─── Owned certs ──────────────────────────────────────────────────────────────

export function loadOwned() {
  try {
    const raw = localStorage.getItem(KEYS.OWNED)
    return raw ? JSON.parse(raw) : []
  } catch {
    console.warn("CertMap: failed to load owned certs from localStorage")
    return []
  }
}

export function saveOwned(ownedIds) {
  try {
    localStorage.setItem(KEYS.OWNED, JSON.stringify(ownedIds))
  } catch {
    console.warn("CertMap: failed to save owned certs to localStorage")
  }
}

// ─── Clear all ────────────────────────────────────────────────────────────────
// Used for a full reset. Not exposed in UI by default — dev tool only for now.

export function clearAll() {
  try {
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key))
  } catch {
    console.warn("CertMap: failed to clear localStorage")
  }
}