import type { RequestHandler } from "express";
import { Service } from "./admins.service.js";
import type { RequestBody } from "./admin.dto.js";
import { Repository } from "./admins.repository.js";
import { HttpError } from "../../../lib/middleware/error.middleware/httpError.js";
import { JoinStatus } from "../../../../prisma/generated/client.js";
import { uploadImageToS3 } from "../../../lib/middleware/S3.Client.js";

export class Controller {
  constructor(private service: Service) {}

  register: RequestHandler = async (req, res, next) => {
    try {
      const { email, name, username, password, avatar, contact }: RequestBody =
        req.body;
      let avatarImage = null;
      if (req.file) {
        avatarImage = await uploadImageToS3(req.file);
      }
      await this.service.registerAdmin({
        email,
        name,
        username,
        password,
        avatar: avatarImage,
        contact,
      });
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  };

  accessList: RequestHandler = async (req, res, next) => {
    try {
      const { page, limit, searchKeyword, joinStatus } = req.query;
      const user = req.user;
      if (!user) throw new HttpError(401, "인증과 관련된 오류입니다.");
      if (user.role !== "SUPER_ADMIN")
        throw new HttpError(403, "권한과 관련된 오류입니다.");

      const pageNumber = Number(page) || 1;
      const limitNumber = Number(limit) || 10;
      const status = joinStatus as JoinStatus;
      const keyword = searchKeyword as string;
      const result = await this.service.accessList({
        pageNumber,
        limitNumber,
        keyword,
        joinStatus: status,
      });
      return res.status(200).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  modifyStatus: RequestHandler = async (req, res, next) => {
    try {
      const { joinStatus } = req.body;
      const { page, limit } = req.query;
      const pageNumber = Number(page) || 1;
      const limitNumber = Number(limit) || 10;
      const user = req.user;
      if (!user) throw new HttpError(401, "권한과 관련된 오류입니다.");
      if (user.role !== "SUPER_ADMIN")
        throw new HttpError(403, "권한과 관련된 오류입니다.");
      await this.service.modifyStatus({ pageNumber, limitNumber }, joinStatus);
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  };

  deleteRejectedAdmins: RequestHandler = async (req, res, next) => {
    // 거절된 관리자 계정 일괄 삭제
    try {
      const user = req.user;
      if (!user) throw new HttpError(401, "인증과 관련된 오류입니다.");
      if (user.role !== "SUPER_ADMIN")
        throw new HttpError(403, "권한과 관련된 오류입니다.");
      await this.service.deleteRejectedAdmins();
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  };
}
