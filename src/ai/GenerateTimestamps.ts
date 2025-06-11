import { geminiClient } from "./GeminiClient";
import { prompts } from "./prompts";

const model = process.env.GEMINI_MODEL!;

export async function generateTimestamps(
  transcript: string,
  language: string,
): Promise<string> {
  const res = await geminiClient.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [
          { text: prompts.timestamps + `\nLanguage: ${language}` },
          { text: "Transcript:\n" + transcript },
        ],
      },
    ],
  });

  if (!res.text) throw new Error("Gemini empty response");
  return res.text;
}
