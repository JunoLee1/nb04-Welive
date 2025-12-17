import type { RequestHandler } from 'express';
import { z } from 'zod';

type Target = 'params' | 'body' | 'query';

export const validate = <T extends z.ZodTypeAny>(schema:T, target:Target):RequestHandler => {
    return (req, res, next) => {
        const dataToValidate = req[target];
        const result = schema.safeParse(dataToValidate);
        if (!result.success) {
            return res.status(400).json({
                message: '잘못된 요청 입니다.',
                error: result.error.issues
            });
        }
        next();
    };
};