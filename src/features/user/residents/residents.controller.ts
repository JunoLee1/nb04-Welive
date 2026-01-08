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
      await service.createResident({
        username,
        email,
        name,
        password,
        contact,
        resident,
      });
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  };

  findMany: RequestHandler = async (req, res, next) => {
    try {
      const { page, limit, searchKeyword, joinStatus, building, unit } =
        req.query;
      const user = req.user;
      if (!user) throw new HttpError(401, "Unauthorized");
      if (user.role !== "ADMIN")
        throw new HttpError(403, "권한과 관련된 오류입니다.");
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
      const user = req.user;

      if (!user) throw new HttpError(401, "인증과 관련된 오류 입니다.");
      if (user.role !== "ADMIN")
        throw new HttpError(403, "권한과 관련된 오류입니다.");

      await service.modifyResidentsStatus(joinStatus);
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  };

  modifyResidentStatus: RequestHandler = async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) throw new HttpError(401, "인증과 관련된 오류 입니다.");
      if (user.role !== "ADMIN")
        throw new HttpError(403, "권한과 관련된 오류입니다.");
      const { id } = req.params as ParamSchema;
      const { joinStatus } = req.body;
      await service.modifyResidentStatus(id, joinStatus);
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  };

  delete: RequestHandler = async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) throw new HttpError(401, "인증과 관련된 오류 입니다.");
      if (user.role !== "ADMIN")
        throw new HttpError(403, "권한과 관련된 오류입니다.");
      const { joinStatus } = req.body;
      await service.deleteMany(joinStatus);
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  };
}
