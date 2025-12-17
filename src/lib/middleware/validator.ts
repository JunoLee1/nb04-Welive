import type { RequestHandler } from 'express';
import { z } from 'zod';

export function validateParams <T extends z.ZodTypeAny> (schema:T): RequestHandler{
    return  (req, res, next) => { 
        const result = schema.safeParse(req.params)
        if (!result.success) {
            return res.status(400).json({
                message: '잘못된 요청 입니다.',
                error: result.error.issues
            })
        }
        next()
    }
    
}

export function validateBody<T extends z.ZodTypeAny> (schema:T): RequestHandler{
    return (req, res, next) => {
        const result = schema.safeParse(req.body)
        if (!result.success) {
            return res.status(400).json({
                message: '잘못된 요청 입니다.',
                error: result.error.issues
            })
        }
        next()
    }
}