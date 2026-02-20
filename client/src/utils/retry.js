/**
 * Retry wrapper for rate-limited API calls.
 * Automatically parses retry delay from error or uses exponential backoff.
 */
export async function withRetry(fn, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const is429 =
        error?.status === 429 ||
        error?.message?.includes("429") ||
        error?.message?.toLowerCase().includes("quota exceeded") ||
        error?.message?.toLowerCase().includes("rate limit");

      if (is429 && attempt < maxRetries) {
        const retryMatch = error?.message?.match(/retry in ([\d.]+)s/i);
        const delay = retryMatch
          ? Math.ceil(parseFloat(retryMatch[1])) * 1000
          : Math.pow(2, attempt) * 15000;

        console.warn(
          `Rate limited. Retrying in ${delay / 1000}s... (attempt ${attempt + 1}/${maxRetries})`
        );
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw error;
    }
  }
}
