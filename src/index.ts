import  express from "express";
import type {Express, RequestHandler, ErrorRequestHandler} from "express";
import cookieParser from "cookie-parser";
import type { Passport } from "passport";
declare const passport: typeof Passport ; 

export const app: Express = require("express")();

app.use(express.json());
app.use(cookieParser() as RequestHandler );
app.use(express.urlencoded({ extended: false }));
app.use("/api/v2")
//app.use(passport.initialize());
//app.use(passport.session());

