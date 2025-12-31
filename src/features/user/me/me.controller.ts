import type { RequestHandler } from "express";
import { Service } from "./me.service.js";
import { Repository } from "./me.repo.js";
import { HttpError } from "../../../lib/middleware/error.middleware/httpError.js";

const repo = new Repository();
const service = new Service(repo);
export class Controller {
  modifiedAvatar: RequestHandler = async (req, res, next) => {
    try {
      const { avatarImage } = req.body;
      const user = req.user;
      const userId = req.user?.id;
      if (!user) throw new HttpError(404, "해당 유저를 찾을 수 없습니다");
      if (!userId) throw new HttpError(401, "권한과 관련된 오류입니다.");
      await service.modifiedAvatar(userId, avatarImage);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  };

  modifiedPassword: RequestHandler = async (req, res, next) => {
    try {
      const { password, newPassword } = req.body;
      const user = req.user;
      const userId = req.user?.id;
      if (!user) throw new HttpError(404, "해당 유저를 찾을 수 없습니다");
      if (!userId) throw new HttpError(401, "권한과 관련된 오류입니다.");
      await service.modifiedPassword(userId, { password, newPassword });
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  };
}
