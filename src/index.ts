import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { generateSummary } from "./ai/GenerateSummary";
import { generateTimestamps } from "./ai/GenerateTimestamps";
import { answerQuestion } from "./ai/AnswerQuestion";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
  }),
);

app.use(express.json());

app.get("/", (_req, res, next) => {
  res.status(200);
  res.send("Server is running 🚀");
});

/*────────────────── основной энд-поинт ──────────────────*/
app.post(
  "/api/analyze",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        button, // summarize | timestamps | question
        transcript,
        lang,
        detail,
        query,
        videoId,
      } = req.body as {
        button: "summarize" | "timestamps" | "question";
        transcript: string;
        lang: string;
        detail: string;
        query: string | null;
        videoId: string;
      };

      let result: string;

      switch (button) {
        case "summarize":
          result = await generateSummary(transcript, lang, detail);
          break;
        case "timestamps":
          result = await generateTimestamps(transcript, lang);
          break;
        case "question":
          if (!query) throw new Error("Query is required for question mode");
          result = await answerQuestion(transcript, lang, query);
          break;
        default:
          throw new Error("Unknown button value");
      }

      res.json({ videoId, result });
    } catch (err) {
      next(err);
    }
  },
);

/*───────────── error-handler ─────────────*/
app.use((err: Error, _req: Request, res: Response) => {
  console.error(err);
  res.status(400).json({ error: err.message });
});

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
