import { geminiClient } from "./GeminiClient";

const model = process.env.GEMINI_MODEL!;

export async function answerQuestion(
  transcript: string,
  language: string,
  question: string,
): Promise<string> {
  const res = await geminiClient.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [
          {
            text:
              `You are an expert assistant. Answer the question based solely on the transcript below.\n` +
              `Answer language: ${language}\nQuestion: ${question}\n`,
          },
          { text: "Transcript:\n" + transcript },
        ],
      },
    ],
  });

  if (!res.text) throw new Error("Gemini empty response");
  return res.text;
}
