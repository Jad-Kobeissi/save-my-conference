import { generateText } from "./gemini";

/**
 * Analyzes MUN speeches with a focus on incremental improvement.
 * @param speechText The current version of the speech.
 * @param previousScore Optional: The score from the last attempt to ensure progression.
 */
export async function analyzeSpeech(speechText: string, previousScore?: number) {
  const prompt = `
You are a Senior MUN Chair. You are evaluating a speech.
${previousScore ? `IMPORTANT: The user's previous draft scored ${previousScore}/100. If this version shows effort and fixes previous errors, you MUST reward them with a higher score.` : "This is the user's first draft. Grade it fairly but strictly."}

Use this 100-point Rubric:
- Policy Alignment (40pts)
- Rhetorical Impact (30pts)
- Actionable Solutions (30pts)

SCORING DIRECTIVE: 
- Be ruthless with critiques but encouraging with the score if improvements are visible.
- If the score is above 90, only suggest "Master-level" refinements.

Return strictly valid JSON:
{
  "score": number, 
  "strengths": string[], 
  "improvements": string[], 
  "revised_opening": string,
  "feedback_tone": "encouraging" | "critical" | "impressed"
}

Speech text:
"""
${speechText}
"""
`;

  const responseText = await generateText(prompt);
  if (!responseText) {
    throw new Error("Failed to generate response");
  }

  // Regex to ensure we only parse the JSON block
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  const cleanJson = jsonMatch ? jsonMatch[0] : responseText;

  try {
    const result = JSON.parse(cleanJson);
    
    // Logic Guard: If the AI is being "lazy" and giving the same score despite improvements, 
    // we can manually nudge it in the frontend, but the prompt above usually fixes this.
    return result;
  } catch (e) {
    console.error("AI returned invalid JSON:", responseText);
    throw new Error("Invalid response format from AI");
  }
}
