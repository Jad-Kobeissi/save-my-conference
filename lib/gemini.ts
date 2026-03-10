import { GoogleGenAI } from "@google/genai";

export function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

export async function generateText(prompt: string) {
  const client = getClient();
  if (!client) return null;

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    }
  });

  return response.text;
}
