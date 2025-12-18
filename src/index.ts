import  express from "express";
import type {Express, RequestHandler, ErrorRequestHandler} from "express";
import cookieParser from "cookie-parser";
import type { Passport } from "passport";
import { errorHandler } from "./lib/middleware/error.middleware/error-handler.js";
declare const passport: typeof Passport ; 

export const app: Express = require("express")();

app.use(express.json());
app.use(cookieParser() as RequestHandler );
app.use(express.urlencoded({ extended: false }));
app.use("/api/v2");
app.use(errorHandler as ErrorRequestHandler);
//app.use(passport.initialize());
//app.use(passport.session());

