import type {ErrorRequestHandler} from "express"
import { HttpError } from "../error.middleware/httpError.js";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    if (error instanceof ZodError) {
    return res.status(400).json({ success: false, errors: (error as ZodError).issues });
  }
   if (error instanceof HttpError) { 
        res.status(error.status).send({ success: false, message: error.message });
        return ;
   }
    const status = error.status || 500;
    const message = error.message || "INTERNAL SERVER ERROR"
    return res.status(status).json({success:false,message:message})
}
