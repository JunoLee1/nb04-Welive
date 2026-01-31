import type { RequestHandler } from "express";
import { Service } from "./residents.service.js";
import type {
  ResidentCreateSchema,
  ReqParamQuerySchema,
  ParamSchema,
} from "./residents.validator.js";
import { Repository } from "./residents.repo.js";
import { HttpError } from "../../../lib/middleware/error.middleware/httpError.js";
import type { ResidentRequestParamQuery } from "./residents.dto.js";
import { JoinStatus } from "../../../../prisma/generated/enums.js";
import prisma from "../../../lib/prisma.js";

type Id = {
  id: string
}
const repo = new Repository(prisma);
const service = new Service(repo);
export class Controller {
  constructor(private service: Service) {}

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
      const query = req.query as Record<string, string | undefined>;

      const pageNumber = Number(query.page ?? 1);
      const limitNumber = Number(query.limit ?? 10);

      const searchKeyword = query.searchKeyword;
      const building = query.building;
      const unit = query.unit;
      const joinStatus = query.joinStatus as JoinStatus | undefined;
      const user = req.user;
      //const status = queryRaw.joinStatus ?? JoinStatus.PENDING;
      const adminId = user?.id;
      if (!adminId) throw new Error();
      console.log(1);

      const result = await this.service.findMany(
        adminId,
        { page: pageNumber, limit: limitNumber },
        {
          searchKeyword: searchKeyword,
          joinStatus: joinStatus as JoinStatus,
          building: building,
          unit: unit,
        }
      );
      console.log(123);
      console.log(result);
      return res.status(201).json(result);
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
      return res.status(200).json();
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
      const { id } = req.params;
      console.log(1)
      console.log("id:",id)
      const { joinStatus } = req.body;
      console.log(12)
      if(id!=="string") throw new HttpError(400," 잘못된 요청 입니다")
     console.log(123)
      await service.modifyResidentStatus(id, joinStatus);
      return res.status(200).json();
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
