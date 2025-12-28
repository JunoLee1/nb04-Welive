import type { RequestHandler } from "express";
import { Service } from "./apartments.service.js";
import type { SearchKeyword } from "./apartments.dto.js";

const service = new Service();
export class Controller {
  findMany: RequestHandler = async (req, res) => {
    const { page, limit, searchKeyword } = req.query;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 20;
    let keyword: SearchKeyword | undefined;
    if (typeof searchKeyword === "string" && searchKeyword.trim() !== "") {
      keyword = {
        name: searchKeyword,
        address: searchKeyword,
        contact: searchKeyword,
        descrption: searchKeyword,
        officeNumber: searchKeyword,
      };
    }
    const result = await service.findMany({
      page: pageNumber,
      limit: limitNumber,
      searchKeyword: keyword,
    });
    return res.status(200).json({
      data: result,
    });
  };

  findOne: RequestHandler = async (req, res) => {};
}
