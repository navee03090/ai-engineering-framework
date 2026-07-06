import { GoogleGenerativeAI } from "@google/generative-ai";

const DEFAULT_MODEL = process.env.GEMINI_MODEL ?? "gemini-flash-latest";

let geminiClient: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing GEMINI_API_KEY. Add it to .env.local before calling Gemini."
    );
  }

  if (!geminiClient) {
    geminiClient = new GoogleGenerativeAI(apiKey);
  }

  return geminiClient;
}

export function getGeminiModel(model: string = DEFAULT_MODEL) {
  return getGeminiClient().getGenerativeModel({ model });
}

export function getDefaultGeminiModel() {
  return getGeminiModel(DEFAULT_MODEL);
}

export const GEMINI_MODEL = DEFAULT_MODEL;
