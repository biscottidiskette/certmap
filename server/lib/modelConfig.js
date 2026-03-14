// modelConfig.js
// Single source of truth for LLM provider configuration.
// To swap providers, change this file only.
// Nothing in routes or groqClient should have model names or
// provider-specific values hardcoded.
//
// Supported providers (MVP): groq
// Planned providers (backlog): openai, anthropic

export const modelConfig = {
  provider: "groq",

  // Model to use for all completions
  model: "llama-3.3-70b-versatile",

  // Groq base URL — update this if swapping to a different provider
  baseURL: "https://api.groq.com/openai/v1",

  // Temperature — lower = more deterministic, better for structured JSON responses
  temperature: 0.3,

  // Max tokens for all completions
  maxTokens: 1024,

  // Request timeout in milliseconds
  timeoutMs: 30000,
}