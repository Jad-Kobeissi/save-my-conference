import { generateText } from "./gemini";

export async function analyzeSpeech(speechText: string) {
  const prompt = `
You are a Model UN speech analyzer. Analyze the following speech text.
Return the result strictly as a valid JSON object with the following schema:
{
  "score": number, // out of 100
  "strengths": string[], // max 3 points
  "improvements": string[], // max 3 points
  "revised_opening": string // A highly diplomatic, memorable one-sentence opening
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

  // Parse JSON out of response
  try {
    const jsonStr = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Failed to parse AI response", responseText, err);
    throw new Error("Failed to parse analyzeSpeech AI response");
  }
}

export async function buildQuiz(topic: string, context: string) {
  const prompt = `
You are a Model UN preparation assistant. Based on the topic and context below, generate a 5-question multiple choice quiz.
Each question must test the delegate's understanding of policy implications, risks, or key facts based ON THE CONTEXT.

Return the result strictly as a valid JSON array of objects with the following schema:
[
  {
    "kind": string, // "Policy", "Risk", or "Principle"
    "question": string,
    "statement": string, // Extract a relevant quote or summary from the context that anchors the question
    "options": string[], // Exactly 4 options, including the correct answer
    "answer": string, // Must exactly match one of the options
    "explanation": string // Explain why the answer is correct based on the context
  }
]

Topic: ${topic}
Context: ${context}
`;

  const responseText = await generateText(prompt);
  if (!responseText) {
    throw new Error("Failed to generate response");
  }

  try {
    const jsonStr = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Failed to parse AI response", responseText, err);
    throw new Error("Failed to parse buildQuiz AI response");
  }
}

export async function buildCrisis(topic: string, country: string, committee: string, context: string) {
  const prompt = `
You are a Model UN crisis director. Create an emergency crisis scenario based on the topic and context provided. Let the country be ${country} and committee be ${committee}.

Return the result strictly as a valid JSON object with the following schema:
{
  "scenario": string, // A paragraph describing an urgent, 02:15 GMT breaking emergency dropping into committee.
  "intel": string, // A short, punchy sentence on what intelligence the delegate just acquired.
  "tasks": string[], // 3 urgent tasks the delegate must accomplish immediately in response.
  "benchmarks": string[] // 4 benchmarks for evaluating their response.
}

Topic: ${topic}
Context: ${context}
`;

  const responseText = await generateText(prompt);
  if (!responseText) {
    throw new Error("Failed to generate response");
  }

  try {
    const jsonStr = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Failed to parse AI response", responseText, err);
    throw new Error("Failed to parse buildCrisis AI response");
  }
}

export async function buildDebate(yourCountry: string, opponentCountry: string, topic: string, context: string) {
  const prompt = `
You are a Model UN debate simulator. The user is representing ${yourCountry} and facing an attack from ${opponentCountry} on the topic of ${topic}.
Based on the provided context, generate a debate attack and suggest counters.

Return the result strictly as a valid JSON object with the following schema:
{
  "opener": string, // A harsh, realistic one-paragraph attack speech from ${opponentCountry} destroying ${yourCountry}'s position.
  "pressurePoints": string[], // 3 weaknesses in ${yourCountry}'s stance that the opponent just exploited.
  "bestCounters": string[] // 3 diplomatic, sharp ways ${yourCountry} can counter the attack based on the intelligence context.
}

Context: ${context}
`;

  const responseText = await generateText(prompt);
  if (!responseText) {
    throw new Error("Failed to generate response");
  }

  try {
    const jsonStr = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Failed to parse AI response", responseText, err);
    throw new Error("Failed to parse buildDebate AI response");
  }
}
