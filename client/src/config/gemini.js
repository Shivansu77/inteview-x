import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error(
    "Missing VITE_GEMINI_API_KEY — add it to your .env file and restart the dev server."
  );
}

export const genAI = new GoogleGenerativeAI(API_KEY);
export const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";
