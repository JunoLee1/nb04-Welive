import type { RequestHandler } from "express";
import { Service } from "./admins.service.js";
import type { RequestBody, ReqParams } from "./admin.dto.js";
import { Repository } from "./admins.repository.js";
import { HttpError } from "../../../lib/middleware/error.middleware/httpError.js";
import { JoinStatus } from "../../../../prisma/generated/client.js";

const repo = new Repository();
const service = new Service(repo);
export class Controller {
  constructor() {}

  register: RequestHandler = async (req, res, next) => {
    try {
      const { email, name, username, password, avatar, contact }: RequestBody =
        req.body;

      await service.register({
        email,
        name,
        username,
        password,
        avatar,
        contact,
      });
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  };

  accessList: RequestHandler = async (req, res, next) => {
    try {
      console.log("received request from router");
      const { page, limit, searchKeyword, joinStatus } = req.query;
      const user = req.user;
      if (!user) throw new HttpError(401, "권한과 관련된 오류입니다.");
      if (user.role !== "SUPER_ADMIN")
        throw new HttpError(403, "권한과 관련된 오류입니다.");
      console.log(user.role);

      const pageNumber = Number(page) || 1;
      const limitNumber = Number(limit) || 10;
      const status = joinStatus as JoinStatus;
      const keyword = searchKeyword as string;
      const result = await service.accessList({
        pageNumber,
        limitNumber,
        keyword,
        joinStatus: status,
      });
      console.log("📧 return from service ", result);
      return res.status(201).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  modifyStatus: RequestHandler = async (req, res, next) => {
    //TODO: test
    try {
    } catch (error) {}
    const { joinStatus } = req.body;
    const user = req.user;
    if (!user) throw new HttpError(401, "권한과 관련된 오류입니다.");
    if (user.role !== "SUPER_ADMIN")
      throw new HttpError(403, "권한과 관련된 오류입니다.");
    await service.modifyStatus(joinStatus);
    return res.status(204).end();
  };

  deleteRejectedAdmins: RequestHandler = async (req, res, next) => {
    // 거절된 관리자 계정 일괄 삭제
    try {
      const user = req.user;
      if (!user) throw new HttpError(401, "권한과 관련된 오류입니다.");
      if (user.role !== "SUPER_ADMIN")
        throw new HttpError(403, "권한과 관련된 오류입니다.");
      const { joinStatus } = req.body;
      await service.deleteRejectedAdmins(joinStatus);
      return res.status(204).end(); //TODO: test
    } catch (error) {
      next(error);
    }
  };
}
