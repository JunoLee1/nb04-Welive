import {z} from "zod";

const stringToNumber = z
.string()
    .transform((str) => Number(str))
    .refine((num) => !Number.isNaN(num), {
    message: "숫자로 변환할 수 없습니다",
  })
const lowerToUpper = z
.string()
.transform((str) => str.toUpperCase())

export const queryParamSchema = z.object({
    page: stringToNumber.optional().default(1),
    limit: stringToNumber.optional().default(20),
    searchKeyword:lowerToUpper.optional(),
})

export const paramSchema = z.object({
    id: z.string()
})

export type ParamSchema = z.infer<typeof paramSchema >;
export type QueryParamSchema = z.infer<typeof queryParamSchema>