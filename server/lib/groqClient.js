// groqClient.js
// Low-level wrapper around the Groq REST API.
// All routes call this function — nothing else touches the API key
// or constructs fetch calls directly.
//
// Returns the assistant message content as a string.
// Throws a structured error on failure so routes can handle it cleanly.

import { modelConfig } from "./modelConfig.js"

const GROQ_API_URL = `${modelConfig.baseURL}/chat/completions`

/**
 * Send a completion request to Groq.
 *
 * @param {Array} messages - Array of {role, content} message objects
 * @param {Object} overrides - Optional overrides for temperature, maxTokens
 * @returns {Promise<string>} - The assistant's response content as a string
 */
export async function groqComplete(messages, overrides = {}) {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is not set. Add it to your .env file in the project root."
    )
  }

  const payload = {
    model: modelConfig.model,
    temperature: overrides.temperature ?? modelConfig.temperature,
    max_tokens: overrides.maxTokens ?? modelConfig.maxTokens,
    messages,
  }

  let response

  try {
    const controller = new AbortController()
    const timeout = setTimeout(
      () => controller.abort(),
      overrides.timeoutMs ?? modelConfig.timeoutMs
    )

    response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    clearTimeout(timeout)
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Groq request timed out. Check your connection or increase timeoutMs in modelConfig.js.")
    }
    throw new Error(`Network error reaching Groq API: ${err.message}`)
  }

  if (!response.ok) {
    let errorDetail = ""
    try {
      const errBody = await response.json()
      errorDetail = errBody?.error?.message ?? JSON.stringify(errBody)
    } catch {
      errorDetail = await response.text()
    }
    throw new Error(
      `Groq API returned ${response.status}: ${errorDetail}`
    )
  }

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error("Failed to parse Groq API response as JSON.")
  }

  const content = data?.choices?.[0]?.message?.content

  if (!content) {
    throw new Error("Groq API returned an empty or malformed response.")
  }

  return content
}