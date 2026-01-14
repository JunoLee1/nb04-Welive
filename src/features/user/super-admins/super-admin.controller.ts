import type { RequestHandler } from "express";
import type { SuperAdminCreateReqDTO } from "./super-admin.dto.js";
import { Service } from "./super-admin.service.js";
import { Repository } from "./super-admin.repository.js";
import { HttpError } from "../../../lib/middleware/error.middleware/httpError.js";
import  prisma from "../../../lib/prisma.js";
const service = new Service(new Repository(prisma));
export class Controller {
  constructor(private service: Service) {}

  signUpHandler: RequestHandler = async (req, res, next) => {
    try {
      console.log("received from routes");
      const { email, password, name, username, contact, avatar } =
        req.body as SuperAdminCreateReqDTO; // validated value from validator
      console.log("body:", req.body);
      const file = req.file as Express.Multer.File | undefined;
      if (
        file &&
        !["image/jpeg", "image/png", "image/gif"].includes(file.mimetype)
      ) {
        throw new HttpError(400, "잘못된 요청입니다");
      }
      await this.service.signUpHandler({
        email,
        password,
        name,
        username,
        contact,
        avatar,
      });
      console.log("✅ controller signUpHandler success");
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  };
}
