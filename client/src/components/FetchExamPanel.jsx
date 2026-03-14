// FetchExamPanel.jsx
// Input panel for fetching a new cert by name via the Groq backend.
// Handles loading state, cooldown feedback, error display,
// and success confirmation before the cert is added to the library.

import { useState, useRef } from "react"
import { fetchExam } from "../api/certmapApi"

// Minimum ms between fetch attempts on the client side.
// Server also enforces its own cooldown — this is a UX guard.
const CLIENT_COOLDOWN_MS = 12000

export default function FetchExamPanel({ onCertFetched }) {
  const [input, setInput]       = useState("")
  const [status, setStatus]     = useState("idle") // idle | loading | success | error
  const [message, setMessage]   = useState("")
  const lastFetchRef            = useRef(0)

  async function handleFetch() {
    const trimmed = input.trim()

    if (!trimmed) return

    // Client-side cooldown check
    const now = Date.now()
    const elapsed = now - lastFetchRef.current

    if (elapsed < CLIENT_COOLDOWN_MS) {
      const remaining = Math.ceil((CLIENT_COOLDOWN_MS - elapsed) / 1000)
      setStatus("error")
      setMessage(`Please wait ${remaining}s before fetching again.`)
      return
    }

    setStatus("loading")
    setMessage(`Fetching data for "${trimmed}"...`)
    lastFetchRef.current = now

    try {
      const cert = await fetchExam(trimmed)

      setStatus("success")
      setMessage(`"${cert.name}" fetched successfully — added to library.`)
      setInput("")
      onCertFetched(cert)
    } catch (err) {
      setStatus("error")
      setMessage(err.message ?? "Something went wrong. Try again.")
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleFetch()
  }

  const statusClass = {
    idle:    "",
    loading: "fetch-panel__status--loading",
    success: "fetch-panel__status--success",
    error:   "fetch-panel__status--error",
  }[status]

  return (
    <div className="fetch-panel">
      <div className="fetch-panel__row">
        <input
          type="text"
          className="input"
          placeholder="e.g. PNPT, eJPT, AWS Security..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={status === "loading"}
          aria-label="Certification name to fetch"
        />

        <button
          className="btn btn--green"
          onClick={handleFetch}
          disabled={status === "loading" || !input.trim()}
          aria-label="Fetch certification data"
        >
          {status === "loading" ? (
            <>
              <span className="spinner" />
              Fetching
            </>
          ) : (
            "Fetch"
          )}
        </button>
      </div>

      <div className={`fetch-panel__status ${statusClass}`}>
        {message}
      </div>
    </div>
  )
}