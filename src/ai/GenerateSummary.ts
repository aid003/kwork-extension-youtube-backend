import { geminiClient } from "./GeminiClient";
import { prompts } from "./prompts";
import "dotenv/config";

const model = process.env.GEMINI_MODEL!;
if (!model) throw new Error("GEMINI_MODEL не задан в .env");

export const generateSummary = async (
  videoUrl: string,
  language: string,
  details: string,
): Promise<string> => {
  console.log(videoUrl, language, details);
  console.log("Запрос отправлен");
  const response = await geminiClient.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [
          {
            text:
              prompts.summary +
              "\n" +
              `Обязательно ответь на языке: ${language}` +
              "\n" +
              `Обязательно раскрой в ответе подобный уровень детализации: ${details}`,
          },
          { fileData: { fileUri: videoUrl } },
        ],
      },
    ],
  });

  if (!response.text) throw new Error("Empty response from Gemini");
  return response.text;
};
