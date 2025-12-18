import Error from "express";
import type {ErrorRequestHandler} from "express"
//import HttpError from "../lib/httpError.js"
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    if (error instanceof ZodError) {
    return res.status(400).json({ success: false, errors: (error as ZodError).issues });
  }
   if (error instanceof HttpError) { // TODO: import HttpError
        return res.status(error.status).json({ success: false, message: error.message });
   }
    const status = error.status || 500;
    const message = error.message || "INTERNAL SERVER ERROR"
    return res.status(status).json({success:false,message:message})
}
