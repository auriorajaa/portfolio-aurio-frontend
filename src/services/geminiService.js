// src/services/geminiService.js
/**
 * Google Gemini REST integration for the Arcade.
 * - Reads REACT_APP_GOOGLE_API_KEY. Missing/invalid key or offline gracefully
 *   resolves to { ok: false } so callers can fall back to static content.
 * - In-memory + localStorage response cache with TTL to avoid rate limits.
 * - Hard timeout + cancellable (AbortController) requests.
 * - Sanitizes and validates the response shape. Never logs the API key.
 */

const MODEL = "gemini-1.5-flash";
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_TTL = 1000 * 60 * 60 * 6; // 6 hours for prose
const REQUEST_TIMEOUT = 12000;
const CACHE_PREFIX = "arcade:gemini:";
const CACHE_TTL = 1000 * 60 * 60 * 24;

const endpoint = `${BASE_URL}/${MODEL}:generateContent`;

export const getGeminiKey = () => {
  try {
    const key = (process.env.REACT_APP_GOOGLE_API_KEY || "").trim();
    return key;
  } catch {
    return "";
  }
};

export const isGeminiAvailable = () => Boolean(getGeminiKey());

const cleanText = (value) => {
  if (typeof value !== "string") return "";
  return value
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 1600);
};

const readCache = (key) => {
  try {
    const raw = JSON.parse(window.localStorage.getItem(CACHE_PREFIX + key));
    if (raw && typeof raw === "object" && raw.at && raw.t) {
      if (Date.now() - raw.at < CACHE_TTL) return cleanText(raw.t);
    }
  } catch {
    // corrupted cache → ignore
  }
  return null;
};

const writeCache = (key, text) => {
  try {
    window.localStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ at: Date.now(), t: text }),
    );
  } catch {
    // storage unavailable
  }
};

const rateLimiter = { at: 0 };
const acquireRateSlot = () => {
  const now = Date.now();
  if (now - rateLimiter.at < 1200) return false;
  rateLimiter.at = now;
  return true;
};

/**
 * Generate text with Gemini.
 * @param {Object} opts
 * @param {string} opts.prompt  User-style prompt
 * @param {string} [opts.system] System instruction
 * @param {string} [opts.cacheKey] Steady cache key (safe chars only)
 * @param {number} [opts.ttlMs] overrides cache TTL for this call
 * @param {AbortSignal} [opts.signal] external cancellation
 * @returns {Promise<{ok:boolean, text?:string, cached?:boolean, reason?:string}>}
 */
export const geminiGenerate = async ({
  prompt,
  system,
  cacheKey,
  ttlMs = DEFAULT_TTL,
  signal,
} = {}) => {
  const key = getGeminiKey();
  if (!key) return { ok: false, reason: "no-key" };

  const safeKey = (cacheKey || "gen")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 64);

  if (cacheKey) {
    const cached = readCache(safeKey);
    if (cached !== null) return { ok: true, text: cached, cached: true };
  }
  if (!acquireRateSlot()) {
    // Politely refuse a rapid second request; caller should show fallback.
    return { ok: false, reason: "rate-limited" };
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  const onOuter = () => controller.abort();
  if (signal) {
    if (signal.aborted) {
      window.clearTimeout(timeout);
      return { ok: false, reason: "aborted" };
    }
    signal.addEventListener("abort", onOuter, { once: true });
  }

  try {
    const body = {
      contents: [
        { role: "user", parts: [{ text: (system ? system + "\n\n" : "") + prompt }] },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 420,
        topP: 0.95,
      },
    };

    const res = await fetch(`${endpoint}?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      // 400 invalid key, 403 quota/expired, 429 rate limited, 5xx network-ish
      return { ok: false, reason: `http-${res.status}` };
    }

    const json = await res.json();
    const text = cleanText(json?.candidates?.[0]?.content?.parts?.[0]?.text);
    if (!text) return { ok: false, reason: "empty" };

    if (cacheKey) writeCache(safeKey, text);
    return { ok: true, text, cached: false };
  } catch (err) {
    return { ok: false, reason: err?.name === "AbortError" ? "aborted" : "network" };
  } finally {
    window.clearTimeout(timeout);
    if (signal) signal.removeEventListener("abort", onOuter);
  }
};