export class PublicApiError extends Error {
  constructor(code, message, status = 0) {
    super(message);
    this.name = "PublicApiError";
    this.code = code;
    this.status = status;
  }
}

const getErrorCode = (status) => {
  if (status === 401 || status === 403) return "UNAUTHORIZED";
  if (status === 404) return "NOT_FOUND";
  if (status === 429) return "RATE_LIMIT";
  if (status >= 500) return "SERVER_ERROR";
  return "HTTP_ERROR";
};

export const fetchJson = async (url, { signal, timeoutMs = 8000 } = {}) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  const abortRequest = () => controller.abort();

  signal?.addEventListener("abort", abortRequest, { once: true });

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new PublicApiError(
        getErrorCode(response.status),
        "Public API request failed.",
        response.status,
      );
    }

    try {
      return await response.json();
    } catch {
      throw new PublicApiError("INVALID_RESPONSE", "The API returned invalid data.");
    }
  } catch (error) {
    if (error instanceof PublicApiError) throw error;
    if (signal?.aborted) {
      throw new PublicApiError("ABORTED", "The request was cancelled.");
    }
    if (error?.name === "AbortError") {
      throw new PublicApiError("TIMEOUT", "The request timed out.");
    }
    throw new PublicApiError("NETWORK_ERROR", "The network request failed.");
  } finally {
    window.clearTimeout(timeoutId);
    signal?.removeEventListener("abort", abortRequest);
  }
};

export const getPublicApiMessage = (error, fallback) => {
  const messages = {
    MISSING_KEY: "The movie service is not configured.",
    EMPTY: "No data was returned.",
    UNAUTHORIZED: "The service is not configured.",
    RATE_LIMIT: "Too many requests. Please try again soon.",
    TIMEOUT: "Request timed out. Please try again.",
    NETWORK_ERROR: "Check your connection and try again.",
    INVALID_RESPONSE: "The service returned invalid data.",
    SERVER_ERROR: "The service is unavailable right now.",
    NOT_FOUND: "The requested data was not found.",
  };
  return messages[error?.code] || fallback;
};
