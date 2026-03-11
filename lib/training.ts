import { generateText } from "./gemini";

export async function analyzeSpeech(speechText: string) {
  const prompt = `
You are a Senior Model UN Chair with 20 years of experience. Analyze the following speech.
You must be RUTHLESS but CONSISTENT. Use this fixed 100-point rubric:
1. Policy Alignment (40 pts): Does it strictly follow the country's known stance?
2. Diplomatic Rhetoric (30 pts): Is the language formal, persuasive, and professional?
3. Actionability (30 pts): Does it propose specific solutions or caucusing paths?

SCORING RULE: If this is a revision of a previous speech where the user followed specific advice, you MUST NOT lower the score unless they broke a fundamental rule of diplomacy.

Return the result strictly as a valid JSON object with the following schema:
{
  "score": number, // out of 100
  "strengths": string[], // max 3 points
  "improvements": string[], // max 3 points
  "revised_opening": string // A master-level diplomatic opening based on the speech content
}

Speech text to analyze:
"""
${speechText}
"""
`;

  const responseText = await generateText(prompt);
  if (!responseText) {
    throw new Error("Failed to generate response");
  }

  // Ensure we only return the JSON part if the AI adds conversational filler
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  const cleanJson = jsonMatch ? jsonMatch[0] : responseText;

  return JSON.parse(cleanJson);
}
