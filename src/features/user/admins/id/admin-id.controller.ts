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
  constructor(service: Service) {}

  modifyUserInfo: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { email, username, adminOf, contact } = req.body;
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

      const existingUser = await repo.findOne("id", userId);
      if (!existingUser) throw new HttpError(404, "NotFound");
      let profileImageKey = existingUser.avatar; // 기존 key 유지

      if (req.file) {
        // 1️⃣ 기존 이미지 삭제
        if (profileImageKey) {
          await deleteImageToS3(profileImageKey);
        }

        // 2️⃣ 새 이미지 업로드
        const uploadedKey = await uploadImageToS3(req.file);
        profileImageKey = uploadedKey;
      }

      await service.modifyUserInfo(userId, {
        email,
        username,
        adminOf,
        contact,
        avatar: profileImageKey,
      });

      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  };
  modifyJoinStatus: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { joinStatus } = req.body;

      const user = req.user;
      const userId = user?.id;

      if (!user) throw new HttpError(404, "해당 유저를 찾을수 없습니다");
      if (user.role !== "SUPER_ADMIN")
        throw new HttpError(403, "권한과 관련된 오류입니다.");
      if (!id) throw new HttpError(404, "해당 id를 찾을 수 없습니다");
      if (!userId) throw new HttpError(401, "권한과 관련된 오류입니다.");
      await service.modifyStatus(id, joinStatus);
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
