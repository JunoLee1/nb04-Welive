import express , { type RequestHandler, type ErrorRequestHandler }from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import passport from "passport";
import { errorHandler } from "./lib/middleware/error.middleware/error-handler.js";
import apiRouter from './features/index.js'

const app = express()
const PORT = process.env.PORT || "3000"

app.use(express.json());
app.use(cookieParser() as RequestHandler );
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin:"http://localhost:9000",
    credentials: true
}))
app.use("/api/v2", apiRouter);
app.use(errorHandler as ErrorRequestHandler);
app.use(passport.initialize());
app.listen(PORT,() => {
    console.log(`Server is ruunnig ${PORT}`)
})
export default app;


