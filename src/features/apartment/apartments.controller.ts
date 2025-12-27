import type { RequestHandler } from "express";
import {Service} from "./apartments.service.js";

const service = new Service()
export class Controller {
    findMany:RequestHandler = async(req, res) => {
        const { page, limit, searchKeyword } = req.query;
        const pageNumber = page ?? 1
        const limitNumber = limit ?? 20
        const keyword = searchKeyword || ''
        const result = await service.findMany({ page:pageNumber,limit: limitNumber, searchKeyword: keyword})
        return res.status(200).json({
            data: result,
        })
    }

    findOne:RequestHandler = async(req, res) => {}
}