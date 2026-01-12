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
    const message = error.message || "알 수 없는 오류 입니다."
    return res.status(status).json({success:false,message:message})
}
