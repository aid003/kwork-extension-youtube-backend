import { geminiClient } from "./GeminiClient";
import { prompts } from "./prompts";

const model = process.env.GEMINI_MODEL!;
if (!model) throw new Error("GEMINI_MODEL is missing");

/**
 * Генерирует тайм-стемпы.
 *
 * @param transcript Полный текст транскрипта
 * @param language   Язык ответа (ISO-2)
 * @param detail     Уровень детализации (concise / standard / detailed)
 */
export async function generateTimestamps(
  transcript: string,
  language: string,
  detail: string = "standard"
): Promise<string> {
  const prompt = [
    prompts.timestamps,
    `Обязательно ответь на языке: ${language}`,
    `Обязательно ответь с таким уровнем детализации: ${detail}`,
    "",
    "Transcript:\n" + transcript,
  ].join("\n");

  const res = await geminiClient.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });

  if (!res.text) throw new Error("Gemini empty response");
  return res.text;
}
