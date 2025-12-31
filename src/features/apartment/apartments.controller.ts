import type { RequestHandler } from "express";
import { Service } from "./apartments.service.js";
import type { SearchKeyword } from "./apartments.dto.js";
import { Repository } from "./apartments.repo.js";
import { HttpError } from "../../lib/middleware/error.middleware/httpError.js";
const repo = new Repository();
const service = new Service(repo);

export class Controller {
  findMany: RequestHandler = async (req, res, next) => {
    try {
      const { page, limit, searchKeyword } = req.query;
      const pageNumber = Number(page) || 1;
      const limitNumber = Number(limit) || 20;
      let keyword: SearchKeyword | undefined;
      if (typeof searchKeyword === "string" && searchKeyword.trim() !== "") {
        keyword = {
          name: searchKeyword,
          address: searchKeyword,
          contact: searchKeyword,
          description: searchKeyword,
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
    } catch (error) {
      next(error);
    }
  };

  findOne: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) throw new HttpError(404, "NotFound");
      await service.findOne(id);
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  };
}
