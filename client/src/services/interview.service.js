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

  const prompt = `Here is the full interview conversation:\n\n${formatted}\n\nPlease evaluate the candidate's performance:`;

  try {
    const result = await withModelFallback(
      REVIEW_PROMPT,
      { temperature: 0.5, maxOutputTokens: 800 },
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
    // 3. Replace unquoted numeric-like score placeholders (e.g. <score 0-100>)
    text = text.replace(/<[^>]+>/g, "70");

    return JSON.parse(text);
  } catch (error) {
    console.error("Review Error:", error);
    return {
      overall: 70,
      communication: 70,
      technical: 70,
      confidence: 70,
      problemSolving: 70,
      summary: `Error generating review: ${error.message || String(error)}. Please try again later.`,
      strengths: ["Completed the interview", "Showed willingness to answer"],
      improvements: ["Review could not be generated — try again"],
      tips: ["Practice more mock interviews"],
    };
  }
}
