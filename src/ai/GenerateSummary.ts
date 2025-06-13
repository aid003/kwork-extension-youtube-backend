import { geminiClient } from "./GeminiClient";
import { prompts } from "./prompts";

const model = process.env.GEMINI_MODEL!;
if (!model) throw new Error("GEMINI_MODEL is missing");

/**
 * Генерирует текстовую сводку для видео-транскрипта.
 * Логируется:
 *   • ключевые параметры запроса
 *   • начало промпта и транскрипта
 *   • полный ответ модели
 * Если GEMINI возвращает ошибку или пустой текст, возвращается
 * заглушка с описанием проблемы.
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

    console.log("• Gemini response ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
    console.log(res.text);
    console.log("───────────────────────────────────────");

    return res.text;
  } catch (err: any) {
    console.error("[Gemini] error:", err);

    let errorCode: number | string = "unknown";
    let errorMsg: string = err.message ?? String(err);

    if (typeof err.message === "string") {
      const jsonMatch = err.message.match(/\{[\s\S]*\}$/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.error) {
            errorCode = parsed.error.code ?? parsed.error.status ?? errorCode;
            errorMsg = parsed.error.message ?? errorMsg;
          }
        } catch {
          console.warn("Failed to parse error JSON:", jsonMatch[0]);
        }
      }
    }

    console.log("• Parsed error code   :", errorCode);
    console.log("• Parsed error message:", errorMsg);
    console.log("───────────────────────────────────────");

    if (Number(errorCode) === 503 || errorMsg.includes("overloaded")) {
      return `⚠️ Service is overloaded, please try again later (code ${errorCode}).`;
    }

    return `⚠️ Server of the extension is temporarily unavailable (code ${errorCode}).`;
  }
}
