import type { RequestHandler } from "express";
import { Service } from "./admin-id.service.js";
import { Repository } from "./admin-id.repo.js";
import { HttpError } from "../../../../lib/middleware/error.middleware/httpError.js";
import {
  uploadImageToS3,
  deleteImageToS3,
} from "../../../../lib/middleware/S3.Client.js";
const repo = new Repository();
const service = new Service(repo);
export class Controller {
  constructor(private service: Service) {}

  modifyUserInfo: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { email, username, adminOf, contact, avatar } = req.body;
      const user = req.user;
      const userId = user?.id;

      if (!user) throw new HttpError(401, "인증과 관련된 오류 입니다.");
      if (!userId) throw new HttpError(401, "인증과 관련된 오류 입니다.");
      if (user.role !== "SUPER_ADMIN")
        throw new HttpError(403, "권한과 관련된 오류입니다.");

      const file = req.file as Express.Multer.File | undefined;
      const result = await this.service.modifyUserInfo(userId, {
        email,
        username,
        adminOf,
        contact,
        avatar: file?.filename,
      });
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  };
  modifyStatus: RequestHandler = async (req, res, next) => {
    try {
      // 1️⃣ 인증
      if (!req.user) {
        throw new HttpError(401, "인증과 관련된 오류입니다.");
      }
      
      // 2️⃣ 권한
      if (req.user.role !== "SUPER_ADMIN") {
        throw new HttpError(403, "권한과 관련된 오류입니다.");
      }
      // 3️⃣ 요청 유효성
      const { id } = req.params;
      if (!id) {
        throw new HttpError(400, "잘못된 요청입니다.");
      }

      const { joinStatus } = req.body;
      if (!joinStatus) {
        throw new HttpError(400, "joinStatus가 필요합니다.");
      }

      await this.service.modifyStatus(id, joinStatus);
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  };
  deleteAdmin: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = req.user;
      const userId = user?.id;

      if (!user)
        throw new HttpError(
          400,
          "잘못된 요청(필수사항 누락 또는 잘못된 입력값)입니다"
        );
      if (user.role !== "SUPER_ADMIN")
        throw new HttpError(403, "권한과 관련된 오류입니다.");
      if (!userId) throw new HttpError(401, "권한과 관련된 오류입니다.");
      if (!id) throw new HttpError(404, "해당 id를 찾을 수 없습니다");
      await service.deleteAdmin(id);
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  };
}
