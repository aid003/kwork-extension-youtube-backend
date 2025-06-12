// api/index.ts

import app from "../src/index";
import { createServer } from "http";

export default function handler(req: any, res: any) {
  const server = createServer(app);
  server.emit("request", req, res);
}
