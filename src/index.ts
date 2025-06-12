import express, { Request, Response } from "express";
import cors from "cors";
import { SummarizerRequestPayload, SummarizerResponse } from "./types";
import { generateSummary } from "./ai/GenerateSummary";
import { generateTimestamps } from "./ai/GenerateTimestamps";
import { answerQuestion } from "./ai/AnswerQuestion";

const app = express();
app.use(cors());
app.use(express.json());

app.post(
  "/api/analyze",
  async (
    req: Request<{}, SummarizerResponse, SummarizerRequestPayload>,
    res: Response<SummarizerResponse>
  ) => {
    try {
      const { button, transcript, lang, detail, query, videoId } = req.body;

      let result: string;
      switch (button) {
        case "summarize":
          result = await generateSummary(transcript, lang, detail);
          break;
        case "timestamps":
          result = await generateTimestamps(transcript, lang, detail);
          break;
        case "question":
          result = await answerQuestion(transcript, query ?? "", lang);
          break;
        default:
          throw new Error(`Unknown button type: ${button}`);
      }

      const payload: SummarizerResponse = {
        ok: true,
        videoId,
        button,
        result,
      };
      res.json(payload);
    } catch (err: any) {
      const payload: SummarizerResponse = {
        ok: false,
        error: err?.message ?? "Unknown error",
      };
      res.status(500).json(payload);
    }
  }
);

app.get("/", (_req, res, next) => {
  res.status(200);
  res.send("🚀 Server is running");
});

const PORT = process.env.PORT ?? 7392;
app.listen(PORT, () => console.log(`🚀 ⇢ Backend listening on ${PORT}`));
