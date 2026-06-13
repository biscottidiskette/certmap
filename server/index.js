// index.js
// Express entry point.
// Loads environment variables, mounts routes, serves Vite build in production.

import express from "express"
import cors from "cors"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import dotenv from "dotenv"

// Load .env from project root (one level up from server/)
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), "../.env") })

import { fetchExamRouter } from "./routes/fetchExam.js"
import { gradeRoadmapRouter } from "./routes/gradeRoadmap.js"

const app = express()
const PORT = process.env.PORT || 3001
const IS_PRODUCTION = process.env.NODE_ENV === "production"

// ─── Middleware ───────────────────────────────────────────────────────────────

// In dev, Vite runs separately and proxies /api to us.
// In production, the built client is served from this same process.
// CORS is only needed in dev.
if (!IS_PRODUCTION) {
  app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  }))
}

app.use(express.json())

// ─── API Routes ───────────────────────────────────────────────────────────────

app.use("/api/fetch-exam", fetchExamRouter)
app.use("/api/grade-roadmap", gradeRoadmapRouter)

// ─── Health check ─────────────────────────────────────────────────────────────

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    env: process.env.NODE_ENV ?? "development",
    timestamp: new Date().toISOString(),
  })
})

// ─── Production static serving ────────────────────────────────────────────────
// In production, Express serves the Vite build output.
// This means one process, one port, no separate frontend server.

if (IS_PRODUCTION) {
  const clientDist = join(
    dirname(fileURLToPath(import.meta.url)),
    "../client/dist"
  )

  app.use(express.static(clientDist))

  // All non-API routes return index.html so React Router works correctly
  app.get("*", (req, res) => {
    res.sendFile(join(clientDist, "index.html"))
  })
}

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`CertMap server running on port ${PORT}`)
  console.log(`Environment: ${IS_PRODUCTION ? "production" : "development"}`)
  if (!IS_PRODUCTION) {
    console.log(`Health check: http://localhost:${PORT}/api/health`)
  }
})