import { genAI, FALLBACK_MODELS } from "@/config/gemini";
import { SYSTEM_PROMPT, REVIEW_PROMPT, FEEDBACK_PROMPT } from "@/constants/prompts";
import { withRetry } from "@/utils/retry";

/**
 * Try the request against each model in FALLBACK_MODELS.
 * If a model's daily quota is exhausted (429 / "exceeded"), move to the next.
 */
async function withModelFallback(systemInstruction, generationConfig, contents) {
  let lastError = null;

  for (const modelName of FALLBACK_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction,
      });

      const result = await withRetry(async () => {
        const response = await model.generateContent({ contents, generationConfig });
        return response.response.text();
      });

      return result;
    } catch (error) {
      lastError = error;
      const isQuotaExhausted =
        error?.status === 429 ||
        error?.message?.includes("429") ||
        error?.message?.toLowerCase().includes("quota exceeded") ||
        error?.message?.toLowerCase().includes("exceeded your current quota");

      if (isQuotaExhausted) {
        console.warn(`Model ${modelName} quota exhausted, trying next fallback...`);
        continue;
      }
      throw error; // non-quota error, don't try fallback
    }
  }

  throw lastError; // all models exhausted
}

export async function startInterview(role, experience, topic) {
  const prompt = `You are interviewing a candidate for a ${role} position. They have ${experience} experience level. The interview topic is: ${topic}.

Start the interview with a warm greeting and ask your first question. Keep it professional but friendly.`;

  try {
    return await withModelFallback(
      SYSTEM_PROMPT,
      { temperature: 0.7, maxOutputTokens: 300 },
      [{ role: "user", parts: [{ text: prompt }] }]
    );
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error?.status === 429 || error?.message?.includes("exceeded")) {
      return "Hello! All AI model quotas have been reached for today. Please try again tomorrow or upgrade your plan.";
    }
    throw new Error("Failed to start interview. Please check your API key.");
  }
}

export async function getNextQuestion(conversationHistory) {
  const contents = conversationHistory.map((msg) => ({
    role: msg.role === "interviewer" ? "model" : "user",
    parts: [{ text: msg.text }],
  }));

  try {
    return await withModelFallback(
      SYSTEM_PROMPT,
      { temperature: 0.7, maxOutputTokens: 300 },
      contents
    );
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error?.status === 429 || error?.message?.includes("exceeded")) {
      return "All AI model quotas are currently maxed out. Please try again tomorrow.";
    }
    throw new Error("Failed to get next question.");
  }
}

export async function getAnswerFeedback(question, answer) {
  const prompt = `Interview Question: "${question}"\nCandidate's Answer: "${answer}"\n\nProvide brief feedback:`;

  try {
    return await withModelFallback(
      FEEDBACK_PROMPT,
      { temperature: 0.6, maxOutputTokens: 150 },
      [{ role: "user", parts: [{ text: prompt }] }]
    );
  } catch (error) {
    console.error("Feedback Error:", error);
    if (error?.status === 429 || error?.message?.includes("429")) {
      return "Feedback temporarily unavailable due to rate limits. Keep going!";
    }
    return "Keep going, you're doing well!";
  }
}

export async function generateReview(conversationHistory) {
  const formatted = conversationHistory
    .map((msg) => `${msg.role === "interviewer" ? "Interviewer" : "Candidate"}: ${msg.text}`)
    .join("\n\n");

  const prompt = `Here is the full interview conversation:\n\n${formatted}\n\nPlease evaluate the candidate's performance and also provide the ideal/correct answer for each question asked. Return ONLY valid JSON.`;

  // Retry JSON parsing up to 2 times if LLM returns malformed JSON
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = await withModelFallback(
        REVIEW_PROMPT,
        { temperature: 0.4, maxOutputTokens: 2048 },
        [{ role: "user", parts: [{ text: prompt }] }]
      );

      let text = result.trim();

      // Strip markdown code fences if present
      text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");

      // Extract the JSON object
      const startIdx = text.indexOf("{");
      const endIdx = text.lastIndexOf("}");
      if (startIdx !== -1 && endIdx !== -1) {
        text = text.substring(startIdx, endIdx + 1);
      }

      // Fix common LLM JSON issues:
      // 1. Remove trailing commas before } or ]
      text = text.replace(/,\s*([}\]])/g, "$1");
      // 2. Remove single-line comments
      text = text.replace(/\/\/[^\n]*/g, "");
      // 3. Replace unquoted numeric-like score placeholders
      text = text.replace(/<[^>]+>/g, "70");
      // 4. Fix unterminated strings - find unclosed quotes within values
      text = fixUnterminatedStrings(text);
      // 5. Balance brackets/braces
      text = balanceBrackets(text);

      const parsed = JSON.parse(text);

      // Validate essential fields
      if (typeof parsed.overall !== "number" || !parsed.summary) {
        throw new Error("Missing required fields in review");
      }

      return parsed;
    } catch (error) {
      console.warn(`Review parse attempt ${attempt + 1} failed:`, error.message);
      if (attempt === 2) {
        console.error("Review Error after all attempts:", error);
        return {
          overall: 0,
          communication: 0,
          technical: 0,
          confidence: 0,
          problemSolving: 0,
          summary: "We couldn't generate a proper review this time. This usually happens due to API limits. Please try the interview again.",
          strengths: ["Completed the interview successfully"],
          improvements: ["Try again for a detailed evaluation"],
          tips: ["Ensure a stable connection and try again"],
        };
      }
    }
  }
}

/**
 * Fix unterminated strings in JSON by closing any open quotes.
 */
function fixUnterminatedStrings(text) {
  let inString = false;
  let escaped = false;
  let result = "";

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (escaped) {
      result += ch;
      escaped = false;
      continue;
    }

    if (ch === "\\") {
      escaped = true;
      result += ch;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      result += ch;
      continue;
    }

    if (inString && (ch === "\n" || ch === "\r")) {
      // Newline inside a string — close it and continue
      result += '"';
      inString = false;
      result += ch;
      continue;
    }

    result += ch;
  }

  // If string is still open at the end, close it
  if (inString) {
    result += '"';
  }

  return result;
}

/**
 * Balance brackets and braces in potentially truncated JSON.
 */
function balanceBrackets(text) {
  let braces = 0;
  let brackets = 0;

  for (const ch of text) {
    if (ch === "{") braces++;
    else if (ch === "}") braces--;
    else if (ch === "[") brackets++;
    else if (ch === "]") brackets--;
  }

  // Remove trailing comma before we add closing brackets
  text = text.replace(/,\s*$/, "");

  while (brackets > 0) { text += "]"; brackets--; }
  while (braces > 0) { text += "}"; braces--; }

  return text;
}
