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
    return res.status(204).json();
  };

  accessList: RequestHandler = async (req, res, next) => {
    console.log("received request from router");
    const { page, limit, searchKeyword, joinStatus } = req.query;
    const user = req.user;
    if (!user) throw new HttpError(401, "인증되지 않은 유저 입니다"); //TODO 에러 메시지 수정
    if (user.role !== "SUPER_ADMIN")
      throw new HttpError(403, "권한이 없습니다");
    console.log(user.role);
    console.log("📧 connect to the service");

    const pageNumber = Number(page) ||  1;
    const limitNumber = Number(limit) || 10;
    const status = (joinStatus ?? "PENDING") as JoinStatus;
    const keyword = searchKeyword as string;
    const result = await service.accessList({
      pageNumber,
      limitNumber,
      keyword,
      joinStatus: status,
    });
    console.log("📧 return from service ", result);
    return res.status(204).json({
      data: result,
    });
  };

  modifyStatus: RequestHandler = async (req, res, next) => { //TODO: test
    const { joinStatus } = req.body;
    const user = req.user;
    if (!user) throw new HttpError(401, "인증되지 않은 유저 입니다");
    if (user.role !== "SUPER_ADMIN")
      throw new HttpError(403, "권한이 없습니다");
    await service.modifyStatus(joinStatus);
    return res.status(204).json();
  };

  deleteRejectedAdmins: RequestHandler = async (req, res, next) => {// 거절된 관리자 계정 일괄 삭제
    const user = req.user;
    if (!user) throw new HttpError(401, "인증되지 않은 유저 입니다");
    if (user.role !== "SUPER_ADMIN")
      throw new HttpError(403, "권한이 없습니다");
    const{ joinStatus } = req.body
    await service.deleteRejectedAdmins(joinStatus);
    return res.status(204).json()//TODO: test
  };
}
