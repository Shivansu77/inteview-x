

import { GoogleGenAI } from "@google/genai";

const API_KEY = "AIzaSyB7p4CiZa8GxoV62gFYB7B-8akjtGb2BBg"; // USING User's provided replacement.
const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_PROMPT = `You are an expert technical interviewer. Your role:
- Ask clear, professional interview questions one at a time
- Adapt difficulty based on the candidate's experience level
- Be encouraging but honest
- Keep questions concise (2-3 sentences max)
- Focus on the specified topic/role
- NEVER break character — you are always the interviewer

IMPORTANT: Always respond with ONLY the question text. No prefixes like "Question:" or numbering.`;

const REVIEW_PROMPT = `You are an expert interview evaluator. Based on the conversation history, provide a detailed performance review.

Return EXACTLY ONE valid JSON object. Do not include markdown formatting or backticks.
Example format:
{
  "overall": 85,
  "communication": 90,
  "technical": 80,
  "confidence": 85,
  "problemSolving": 80,
  "summary": "The candidate showed strong skills...",
  "strengths": ["Clear communication", "Good React knowledge"],
  "improvements": ["Dive deeper into hooks", "Testing experience"],
  "tips": ["Practice useMemo", "Review custom hooks"]
}`;

const FEEDBACK_PROMPT = `You are an expert interview coach. The candidate just answered an interview question. Give a very brief (1-2 sentence) feedback on their answer. Be constructive and encouraging. Mention one thing they did well and one thing to improve. Do NOT repeat the question or answer.`;

export async function startInterview(role, experience, topic) {
    const prompt = `You are interviewing a candidate for a ${role} position. They have ${experience} experience level. The interview topic is: ${topic}.

Start the interview with a warm greeting and ask your first question. Keep it professional but friendly.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                temperature: 0.7,
                maxOutputTokens: 300,
            },
        });
        return response.text;
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
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                temperature: 0.7,
                maxOutputTokens: 300,
            },
        });
        return response.text;
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
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: FEEDBACK_PROMPT,
                temperature: 0.6,
                maxOutputTokens: 150,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Feedback Error:", error);
        return "Keep going, you're doing well!";
    }
}

export async function generateReview(conversationHistory) {
    const formatted = conversationHistory
        .map((msg) => `${msg.role === "interviewer" ? "Interviewer" : "Candidate"}: ${msg.text}`)
        .join("\n\n");

    const prompt = `Here is the full interview conversation:\n\n${formatted}\n\nPlease evaluate the candidate's performance:`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: REVIEW_PROMPT,
                temperature: 0.2, // Lower temperature to force strict adherence to the JSON format
                maxOutputTokens: 800,
                responseMimeType: "application/json",
            },
        });

        const text = response.text || "{}";
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
