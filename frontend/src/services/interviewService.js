import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyA1dY36uCLETAbBnmOCBFyj--YSsl8aOFI";
const genAI = new GoogleGenerativeAI(API_KEY);

const MODEL_NAME = "gemini-2.0-flash"; // 1500 RPD free tier (vs 20 RPD for 2.5-flash)

// Retry helper for 429 rate-limit errors
async function withRetry(fn, maxRetries = 3) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            const is429 = error?.status === 429 || error?.message?.includes("429") || error?.message?.includes("exceeded");
            if (is429 && attempt < maxRetries) {
                const delay = Math.pow(2, attempt) * 2000; // 2s, 4s, 8s
                console.warn(`Rate limited. Retrying in ${delay / 1000}s... (attempt ${attempt + 1}/${maxRetries})`);
                await new Promise(r => setTimeout(r, delay));
                continue;
            }
            throw error;
        }
    }
}

const SYSTEM_PROMPT = `You are an expert technical interviewer. Your role:
- Ask clear, professional interview questions one at a time
- Adapt difficulty based on the candidate's experience level
- Be encouraging but honest
- Keep questions concise (2-3 sentences max)
- Focus on the specified topic/role
- NEVER break character — you are always the interviewer

IMPORTANT: Always respond with ONLY the question text. No prefixes like "Question:" or numbering.`;

const REVIEW_PROMPT = `You are an expert interview evaluator. Based on the conversation history, provide a detailed performance review.

Return your response in this EXACT JSON format (no markdown, no code fences):
{
  "overall": <score 0-100>,
  "communication": <score 0-100>,
  "technical": <score 0-100>,
  "confidence": <score 0-100>,
  "problemSolving": <score 0-100>,
  "summary": "<2-3 sentence overall summary>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<area 1>", "<area 2>", "<area 3>"],
  "tips": ["<tip 1>", "<tip 2>", "<tip 3>"]
}`;

const FEEDBACK_PROMPT = `You are an expert interview coach. The candidate just answered an interview question. Give a very brief (1-2 sentence) feedback on their answer. Be constructive and encouraging. Mention one thing they did well and one thing to improve. Do NOT repeat the question or answer.`;

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
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 300,
                },
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
                contents: contents,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 300,
                },
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
    // ✅ prompt was never defined — fixed
    const prompt = `Interview Question: "${question}"\nCandidate's Answer: "${answer}"\n\nProvide brief feedback:`;

    try {
        const model = genAI.getGenerativeModel({
            model: MODEL_NAME,
            systemInstruction: FEEDBACK_PROMPT,
        });

        return await withRetry(async () => {
            const response = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.6,
                    maxOutputTokens: 150,
                },
            });
            return response.response.text();
        });
    } catch (error) {
        console.error("Feedback Error:", error);
        return "Keep going, you're doing well!";
    }
}

export async function generateReview(conversationHistory) {
    const formatted = conversationHistory
        .map((msg) => `${msg.role === "interviewer" ? "Interviewer" : "Candidate"}: ${msg.text}`)
        .join("\n\n");

    // ✅ prompt was never defined — fixed
    const prompt = `Here is the full interview conversation:\n\n${formatted}\n\nPlease evaluate the candidate's performance:`;

    try {
        const model = genAI.getGenerativeModel({
            model: MODEL_NAME,
            systemInstruction: REVIEW_PROMPT,
        });

        const result = await withRetry(async () => {
            const response = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.5,
                    maxOutputTokens: 800,
                },
            });
            return response.response.text();
        });

        const text = result.trim();
        const startIdx = text.indexOf('{');
        const endIdx = text.lastIndexOf('}');
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