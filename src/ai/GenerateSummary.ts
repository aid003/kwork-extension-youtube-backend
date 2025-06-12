import { geminiClient } from "./GeminiClient";
import { prompts } from "./prompts";

const model = process.env.GEMINI_MODEL!;
if (!model) throw new Error("GEMINI_MODEL is missing");

/**
 * Генерирует текстовую сводку для видео-транскрипта.
 * Логируется:
 *   • ключевые параметры запроса
 *   • начало промпта и транскрипта
 *   • полный ответ модели (или сообщение об ошибке)
 * Если GEMINI возвращает ошибку / пустой текст, возвращается
 * заглушка: «Server of the extension is temporarily unavailable (code 3946)».
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
  console.log("• Transcript snippet:", transcript.slice(0, 300), "…");

  /* ---------- call Gemini ---------- */
  try {
    const res = await geminiClient.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [
            { text: systemPrompt },
            { text: "Transcript:\n" + transcript },
          ],
        },
      ],
    });

    if (!res.text) {
      throw new Error("Gemini responded with empty text");
    }

    /* ---------- logging (response) ---------- */
    console.log("• Gemini response ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
    console.log(res.text);
    console.log("───────────────────────────────────────");

    return res.text;
  } catch (err: any) {
    /* ---------- error handling ---------- */
    console.error("[Gemini] error:", err);
    console.log("───────────────────────────────────────");

    // Единообразная заглушка (код 3946)
    return "⚠️ Server of the extension is temporarily unavailable (code 3946).";
  }
}
