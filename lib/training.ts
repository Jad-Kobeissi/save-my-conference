import { generateText } from "./gemini";

export async function analyzeSpeech(speechText: string, previousScore?: number) {
  const prompt = `
You are a Senior MUN Chair. Your goal is to provide a STABLE and PROGRESSIVE grade.
${previousScore ? `PREVIOUS RECORDED SCORE: ${previousScore}/100.` : "This is a new speech."}

### EVALUATION PROTOCOL:
1. **Deductive Analysis**: Start by identifying if the user addressed previous improvements.
2. **Score Anchoring**: If this is a revision and improvements were made, the new score MUST be ≥ the previous score. You are only allowed to lower the score if a NEW major diplomatic error was introduced.
3. **Rubric Math**:
   - Policy Alignment (40pts)
   - Rhetorical Impact (30pts)
   - Actionable Solutions (30pts)

### OUTPUT REQUIREMENTS:
Return ONLY a JSON object. You must explain your reasoning in the "reasoning" field BEFORE setting the score.

{
  "reasoning": "Briefly explain why the score changed or stayed the same relative to the previous ${previousScore || 0}",
  "score": number, 
  "strengths": string[],
  "improvements": string[],
  "revised_opening": string
}

Speech text to evaluate:
"""
${speechText}
"""
`;

  const responseText = await generateText(prompt);
  if (!responseText) throw new Error("Failed to generate response");

  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  const cleanJson = jsonMatch ? jsonMatch[0] : responseText;

  try {
    const result = JSON.parse(cleanJson);
    
    // FINAL SAFETY GUARD: If the AI ignores instructions and lowers the score, 
    // we force it to stay at the previous level in the UI.
    if (previousScore && result.score < previousScore) {
      result.score = previousScore; 
      result.reasoning = "Score maintained at previous level to ensure consistency during refinement.";
    }

    return result;
  } catch (e) {
    throw new Error("Invalid AI response");
  }
}
