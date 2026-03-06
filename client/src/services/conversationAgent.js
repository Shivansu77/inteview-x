import { genAI, FALLBACK_MODELS } from "@/config/gemini";
import { AGENT_SYSTEM_PROMPT, FEEDBACK_PROMPT, REVIEW_PROMPT } from "@/constants/prompts";
import { withRetry } from "@/utils/retry";

/**
 * Interview phases that the agent progresses through.
 */
const PHASE = {
  IDLE: "idle",
  GREETING: "greeting",
  QUESTIONING: "questioning",
  FOLLOW_UP: "follow_up",
  WRAPPING_UP: "wrapping_up",
  ENDED: "ended",
};

function isQuotaError(error) {
  return (
    error?.status === 429 ||
    error?.message?.includes("429") ||
    error?.message?.toLowerCase().includes("quota exceeded") ||
    error?.message?.toLowerCase().includes("exceeded your current quota")
  );
}

function buildRespondPrompt(answerText) {
  return [
    `The candidate answered: "${answerText}"`,
    "",
    "Decide what to do next. You MUST respond in EXACTLY this format:",
    "[ACTION: question | follow_up | wrap_up]",
    "[TOPIC: brief topic tag]",
    "[MESSAGE]",
    "Your actual spoken response here",
    "[/MESSAGE]",
    "",
    "Rules for your decision:",
    "- Use 'follow_up' if the answer was vague, incomplete, or you want to dig deeper on the same topic.",
    "- Use 'question' to move to a new topic or area within the interview scope.",
    "- Use 'wrap_up' only if you've asked enough questions (usually 6-8+) and want to end.",
    "- Your MESSAGE should contain ONLY the text you want to speak — no labels, no prefixes.",
  ].join("\n");
}

function parseAgentResponse(raw) {
  const actionMatch = raw.match(/\[ACTION:\s*(question|follow_up|wrap_up)\s*\]/i);
  const topicMatch = raw.match(/\[TOPIC:\s*(.+?)\s*\]/i);
  const messageMatch = raw.match(/\[MESSAGE\]\s*([\s\S]*?)\s*\[\/MESSAGE\]/i);

  if (actionMatch && messageMatch) {
    return {
      type: actionMatch[1].toLowerCase(),
      topic: topicMatch?.[1] || null,
      message: messageMatch[1].trim(),
    };
  }

  // Fallback: treat the entire response as a new question
  const cleanText = raw
    .replace(/\[ACTION:[^\]]*\]/gi, "")
    .replace(/\[TOPIC:[^\]]*\]/gi, "")
    .replace(/\[MESSAGE\]/gi, "")
    .replace(/\[\/MESSAGE\]/gi, "")
    .trim();

  return {
    type: "question",
    topic: null,
    message: cleanText || raw.trim(),
  };
}

async function sendMessage(chat, text) {
  return withRetry(async () => {
    const result = await chat.sendMessage(text);
    return result.response.text();
  });
}

async function oneShotCall(systemInstruction, prompt) {
  let lastError = null;

  for (const modelName of FALLBACK_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName, systemInstruction });
      const result = await withRetry(async () => {
        const res = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 800 },
        });
        return res.response.text();
      });
      return result;
    } catch (error) {
      lastError = error;
      if (isQuotaError(error)) continue;
      throw error;
    }
  }

  throw lastError;
}

/**
 * Create a new ConversationAgent — a stateful, multi-turn AI interviewer
 * built on Gemini chat sessions.
 *
 * Key capabilities:
 *  - Native multi-turn memory via Gemini startChat()
 *  - Interview phase tracking (greeting → questioning → follow-up → wrap-up)
 *  - Adaptive follow-up questions based on answer quality
 *  - Hint support when the candidate is stuck
 *  - Topic coverage tracking
 *  - Conversation history accessible for review generation
 *
 * @returns {object} The agent interface.
 */
export function createConversationAgent() {
  let _chat = null;
  let _phase = PHASE.IDLE;
  let _questionCount = 0;
  let _topicsCovered = [];
  let _history = [];

  function trackTopic(topic) {
    const normalised = topic.toLowerCase().trim();
    if (!_topicsCovered.includes(normalised)) {
      _topicsCovered.push(normalised);
    }
  }

  return {
    /** Read-only state */
    get phase() { return _phase; },
    get questionCount() { return _questionCount; },
    get topicsCovered() { return [..._topicsCovered]; },
    get history() { return [..._history]; },

    /**
     * Initialise the agent for a new interview session.
     * @param {{ role: string, experience: string, topic: string }} config
     * @returns {Promise<string>} The interviewer's opening message.
     */
    async init({ role, experience, topic }) {
      _phase = PHASE.GREETING;
      _questionCount = 0;
      _topicsCovered = [];
      _history = [];

      const systemInstruction = AGENT_SYSTEM_PROMPT
        .replace("{{ROLE}}", role)
        .replace("{{EXPERIENCE}}", experience)
        .replace("{{TOPIC}}", topic);

      let lastError = null;
      for (const modelName of FALLBACK_MODELS) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName, systemInstruction });

          _chat = model.startChat({
            generationConfig: { temperature: 0.7, maxOutputTokens: 350 },
          });

          const greeting = await sendMessage(
            _chat,
            `Start the interview now. Greet the candidate warmly, mention their role (${role}), experience level (${experience}), and topic (${topic}), then ask your first question.`
          );

          _phase = PHASE.QUESTIONING;
          _questionCount = 1;
          _history.push({ role: "interviewer", text: greeting, type: "question" });

          return greeting;
        } catch (error) {
          lastError = error;
          if (isQuotaError(error)) {
            console.warn(`Model ${modelName} quota exhausted, trying next…`);
            continue;
          }
          throw error;
        }
      }

      throw lastError || new Error("All AI models exhausted");
    },

    /**
     * Submit the candidate's answer and get the agent's next response.
     * @param {string} answerText
     * @returns {Promise<{ message: string, type: string }>}
     */
    async respond(answerText) {
      if (!_chat) throw new Error("Agent not initialised. Call init() first.");
      if (_phase === PHASE.ENDED) throw new Error("Interview has ended.");

      _history.push({ role: "candidate", text: answerText, type: "answer" });

      const prompt = buildRespondPrompt(answerText);
      const raw = await sendMessage(_chat, prompt);
      const parsed = parseAgentResponse(raw);

      _history.push({ role: "interviewer", text: parsed.message, type: parsed.type });

      if (parsed.type === "question" || parsed.type === "follow_up") {
        _questionCount += 1;
        _phase = parsed.type === "follow_up" ? PHASE.FOLLOW_UP : PHASE.QUESTIONING;
      }

      if (parsed.topic) trackTopic(parsed.topic);

      return parsed;
    },

    /**
     * Request a hint for the current question.
     * @returns {Promise<string>}
     */
    async requestHint() {
      if (!_chat) throw new Error("Agent not initialised.");

      const hint = await sendMessage(
        _chat,
        "The candidate is asking for a hint. Provide a brief, helpful hint for the current question without giving the full answer. Keep it to 1-2 sentences."
      );

      _history.push({ role: "interviewer", text: hint, type: "hint" });
      return hint;
    },

    /**
     * Get brief feedback on the most recent answer.
     * @returns {Promise<string>}
     */
    async getLastFeedback() {
      const lastQuestion = [..._history]
        .reverse()
        .find((m) => m.role === "interviewer" && (m.type === "question" || m.type === "follow_up"));

      const lastAnswer = [..._history]
        .reverse()
        .find((m) => m.role === "candidate");

      if (!lastQuestion || !lastAnswer) return "";

      return oneShotCall(
        FEEDBACK_PROMPT,
        `Interview Question: "${lastQuestion.text}"\nCandidate's Answer: "${lastAnswer.text}"\n\nProvide brief feedback:`
      );
    },

    /**
     * End the interview and generate a comprehensive review.
     * @returns {Promise<object>} Parsed review JSON.
     */
    async endInterview() {
      _phase = PHASE.WRAPPING_UP;

      const formatted = _history
        .map((m) => `${m.role === "interviewer" ? "Interviewer" : "Candidate"}: ${m.text}`)
        .join("\n\n");

      const prompt = `Here is the full interview conversation:\n\n${formatted}\n\nPlease evaluate the candidate's performance:`;

      try {
        const result = await oneShotCall(REVIEW_PROMPT, prompt);
        let text = result.trim();

        text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");

        const startIdx = text.indexOf("{");
        const endIdx = text.lastIndexOf("}");
        if (startIdx !== -1 && endIdx !== -1) {
          text = text.substring(startIdx, endIdx + 1);
        }

        text = text.replace(/,\s*([}\]])/g, "$1");
        text = text.replace(/\/\/[^\n]*/g, "");
        text = text.replace(/<[^>]+>/g, "70");

        _phase = PHASE.ENDED;
        return JSON.parse(text);
      } catch (error) {
        console.error("Review generation error:", error);
        _phase = PHASE.ENDED;
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
    },
  };
}
