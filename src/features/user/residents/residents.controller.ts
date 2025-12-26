import type { RequestHandler } from "express";
import { Service } from "./residents.service.js";
import type {
  ResidentCreateSchema,
  ReqParamQuerySchema,
} from "./residents.validator.ts";
import { Repository } from "./residents.repo.js";
import { HttpError } from "../../../lib/middleware/error.middleware/httpError.js";

const repo = new Repository();
const service = new Service(repo);
export class Controller {
  constructor() {}

  createResident: RequestHandler = async (req, res, next) => {
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
    if (!result) throw new HttpError(500, "알수없는 에러 입니다");
    return res.status(204).json();
  };

  findMany: RequestHandler = async (req, res, next) => {
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
    if (!result) throw new HttpError(500, "알수없는 에러 입니다");
    return res.status(204).json();
  };

  modifyResidentsStatus: RequestHandler = async (req, res, next) => {
    await service.modifyResidentsStatus;
  };

  modifyResidentStatus: RequestHandler = async (req, res, next) => {
    await service.modifyResidentStatus;
  };

  delete: RequestHandler = async (req, res, next) => {
    await service.delete;
  };
}
