import { geminiClient } from "./GeminiClient";
import { prompts } from "./prompts";

const model = process.env.GEMINI_MODEL!;
if (!model) throw new Error("GEMINI_MODEL is missing");

/**
 * Генерирует текстовую сводку для видео‑транскрипта.
 * В консоль выводится:
 *   • заголовок вызова и ключевые параметры
 *   • первые 300 символов промпта и транскрипта
 *   • полный ответ модели
 */
export async function generateSummary(
  transcript: string,
  language: string,
  detail: string,
): Promise<string> {
  /* ---------- build prompt ---------- */
  const systemPrompt =
    prompts.summary +
    `\n\nОбязательно ответь на языке: ${language}\nОбязательно ответь с таким уровнем детализации: ${detail}`;

  /* ---------- logging (request) ---------- */
  console.log("───────────────────────────────────────");
  console.log("[Gemini] generateSummary()");
  console.log("• Language :", language);
  console.log("• Detail   :", detail);
  console.log("• Prompt   :", systemPrompt.slice(0, 300), "…");
  console.log("• Transcript snippet: ", transcript.slice(0, 300), "…");

  /* ---------- call Gemini ---------- */
  const res = await geminiClient.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [{ text: systemPrompt }, { text: "Transcript:\n" + transcript }],
      },
    ],
  });

  /* ---------- logging (response) ---------- */
  if (!res.text) throw new Error("Gemini empty response");
  console.log("• Gemini response ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
  console.log(res.text);
  console.log("───────────────────────────────────────");

  return res.text;
}
