import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = "openai/gpt-oss-20b";

export class AiServiceError extends Error {
  constructor(message, statusCode = 502) {
    super(message);
    this.name = "AiServiceError";
    this.statusCode = statusCode;
  }
}

const SYSTEM_PROMPT = `You are a precise webpage summarizer.
Rules:
- Only use information present in the provided webpage content.
- Never invent or hallucinate facts that are not in the content.
- Use simple, clear language.
- Return a short overall summary (2-3 sentences), followed by 3-5 bullet points of key points.
- Format your response in plain text using this exact structure:

Summary
<2-3 sentence overall summary>

Key points:
• <point 1>
• <point 2>
• <point 3>
`;

/**
 * Sends extracted webpage content to the Groq API and returns a
 * concise, grounded summary.
 */
export async function generateSummary({ title, content, url }) {
  if (!process.env.GROQ_API_KEY) {
    throw new AiServiceError(
      "AI service is not configured on the server.",
      500
    );
  }

  const userPrompt = `Webpage title: ${title}
Webpage URL: ${url}

Webpage content:
"""
${content}
"""

Summarize this webpage following the rules you were given.`;

  let completion;
  try {
    completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });
  } catch (err) {
    throw new AiServiceError(
      "Something went wrong while generating the summary. Please try again.",
      502
    );
  }

  const summaryText = completion?.choices?.[0]?.message?.content?.trim();

  if (!summaryText) {
    throw new AiServiceError(
      "The AI did not return a summary. Please try again.",
      502
    );
  }

  return summaryText;
}
