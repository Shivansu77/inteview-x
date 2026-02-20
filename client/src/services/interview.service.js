import { genAI, MODEL_NAME } from "@/config/gemini";
import { SYSTEM_PROMPT, REVIEW_PROMPT, FEEDBACK_PROMPT } from "@/constants/prompts";
import { withRetry } from "@/utils/retry";

export async function startInterview(role, experience, topic) {
  const prompt = `You are interviewing a candidate for a ${role} position. They have ${experience} experience level. The interview topic is: ${topic}.

Start the interview with a warm greeting and ask your first question. Keep it professional but friendly.`;

  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: SYSTEM_PROMPT,
    });

    return await withRetry(async () => {
      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 300 },
      });
      return response.response.text();
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error?.status === 429 || error?.message?.includes("exceeded")) {
      return "Hello! It looks like my Google AI API quota has been reached. Please try again in about a minute!";
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
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: SYSTEM_PROMPT,
    });

    return await withRetry(async () => {
      const response = await model.generateContent({
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 300 },
      });
      return response.response.text();
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error?.status === 429 || error?.message?.includes("exceeded")) {
      return "My AI quota is currently maxed out. Please try answering again in a minute.";
    }
    throw new Error("Failed to get next question.");
  }
}

export async function getAnswerFeedback(question, answer) {
  const prompt = `Interview Question: "${question}"\nCandidate's Answer: "${answer}"\n\nProvide brief feedback:`;

  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: FEEDBACK_PROMPT,
    });

    return await withRetry(async () => {
      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 150 },
      });
      return response.response.text();
    });
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
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: REVIEW_PROMPT,
    });

    const result = await withRetry(async () => {
      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.5, maxOutputTokens: 800 },
      });
      return response.response.text();
    });

    const text = result.trim();
    const startIdx = text.indexOf("{");
    const endIdx = text.lastIndexOf("}");
    if (startIdx !== -1 && endIdx !== -1) {
      return JSON.parse(text.substring(startIdx, endIdx + 1));
    }
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
