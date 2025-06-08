import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { generateSummary } from "./ai/GenerateSummary";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("All good, server is running");
});

app.use(
  "/generate-summary",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { videoUrl, language, details } = req.body;
    if (!videoUrl || !language || !details) {
      return res
        .status(400)
        .json({ error: "videoUrl, language, details are required" });
    }
    try {
      const summary = await generateSummary(videoUrl, language, details);
      res.status(200);
      res.json({ summary });
    } catch (error) {
      res.status(400);
      res.json({ error: "Error generating summary: " + error });
    }
  },
);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
