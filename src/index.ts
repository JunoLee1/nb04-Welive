import express, {
  type RequestHandler,
  type ErrorRequestHandler,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import { errorHandler } from "./lib/middleware/error.middleware/error-handler.js";
import apiRouter from "./features/index.js";

const app = express();
const PORT = process.env.PORT || "3001";

app.use(express.json());
app.use(cookieParser() as RequestHandler);
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000", "https://weliv.netlify.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],

    credentials: true,
  })
);
app.use(passport.initialize());
app.use("/api/v2", apiRouter);
app.use(errorHandler as ErrorRequestHandler);
app.listen(PORT, () => {
  console.log(`Server is ruunnig ${PORT}`);
});
// SSE endpoint for notifications
app.get('/api/v2/notifications/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.write(`event: ping\ndata: {}\n\n`);

  const interval = setInterval(() => {
    res.write(`event: ping\ndata: {}\n\n`);
  }, 30000);

  req.on('close', () => {
    clearInterval(interval);
  });
});
export default app;
