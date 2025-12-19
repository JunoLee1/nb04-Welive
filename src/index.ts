import  express from "express";
import type { RequestHandler, ErrorRequestHandler} from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import { errorHandler } from "./lib/middleware/error.middleware/error-handler.js";
import apiRouter from './features/index.js'
const app = express.Router()

app.use(express.json());
app.use(cookieParser() as RequestHandler );
app.use(express.urlencoded({ extended: false }));
app.use("/api/v2", apiRouter);
app.use(errorHandler as ErrorRequestHandler);
app.use(passport.initialize());
export default app;


