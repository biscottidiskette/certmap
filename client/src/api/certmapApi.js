// certmapApi.js
// Frontend API client.
// All fetch calls to the Express backend go through here.
// Nothing else in the frontend constructs fetch calls directly.
//
// In dev, Vite proxies /api/* to http://localhost:3001
// In production, /api/* is served by the same Express process
// Either way the calling code never needs to know the backend URL.

const BASE = "/api"

/**
 * Shared fetch wrapper with consistent error handling.
 * Throws an Error with a human-readable message on any failure.
 *
 * @param {string} path - API path e.g. "/fetch-exam"
 * @param {Object} body - Request body, will be JSON serialised
 * @returns {Promise<Object>} - Parsed JSON response
 */
async function post(path, body) {
  let response

  try {
    response = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
  } catch (err) {
    throw new Error(
      `Network error — could not reach the CertMap server. Is it running? (${err.message})`
    )
  }

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error(
      `Server returned an unexpected response (status ${response.status}).`
    )
  }

  if (!response.ok) {
    // Server returned a structured error — surface the message directly
    throw new Error(data?.error ?? `Server error (status ${response.status}).`)
  }

  return data
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch structured cert data for a given exam name.
 *
 * @param {string} examName - The name of the certification to look up
 * @returns {Promise<Object>} - A cert object matching the seedCerts schema
 */
export async function fetchExam(examName) {
  return post("/fetch-exam", { examName })
}

/**
 * Grade a certification roadmap.
 *
 * @param {Array} roadmap - Array of cert objects, each with an `owned` boolean
 * @returns {Promise<Object>} - Grade object with subscores, narrative, job titles, unlocks
 */
export async function gradeRoadmap(roadmap) {
  return post("/grade-roadmap", { roadmap })
}

/**
 * Check that the backend is reachable.
 * Useful for surfacing a connection error in the UI on load.
 *
 * @returns {Promise<boolean>}
 */
export async function healthCheck() {
  try {
    const response = await fetch(`${BASE}/health`)
    return response.ok
  } catch {
    return false
  }
}