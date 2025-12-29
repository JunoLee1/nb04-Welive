import type { RequestHandler } from "express";
import { Service } from "./residents.service.js";
import type {
  ResidentCreateSchema,
  ReqParamQuerySchema,
  ParamSchema,
} from "./residents.validator.js";
import { Repository } from "./residents.repo.js";
import { HttpError } from "../../../lib/middleware/error.middleware/httpError.js";

const repo = new Repository();
const service = new Service(repo);
export class Controller {
  constructor() {}

  createResident: RequestHandler = async (req, res, next) => {
    try {
      const { username, email, name, password, contact, resident } =
        req.body as ResidentCreateSchema;
      const result = await service.createResident({
        username,
        email,
        name,
        password,
        contact,
        resident,
      });
      if (!result) throw new HttpError(500, "알수 없는 에러");
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  };

  findMany: RequestHandler = async (req, res, next) => {
    try {
      const { page, limit, searchKeyword, joinStatus, building, unit } =
        req.query;
      const result = await service.findMany({
        page,
        limit,
        searchKeyword,
        joinStatus,
        building,
        unit,
      } as unknown as ReqParamQuerySchema);
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  };

  modifyResidentsStatus: RequestHandler = async (req, res, next) => {
    try {
      const { joinStatus } = req.body;
      const result = await service.modifyResidentsStatus(joinStatus);
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  };

  modifyResidentStatus: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params as ParamSchema;
      const { joinStatus } = req.body;
      const result = await service.modifyResidentStatus(id, joinStatus);
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  };

  delete: RequestHandler = async (req, res, next) => {
    try {
      const { joinStatus } = req.body;
      await service.deleteMany(joinStatus);
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  };
}
