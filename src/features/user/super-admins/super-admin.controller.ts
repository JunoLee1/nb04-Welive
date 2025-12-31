import type { RequestHandler } from "express";
import type { SuperAdminCreateReqDTO } from "./super-admin.dto.js";
import { Service } from "./super-admin.service.js";
import { Repository } from "./super-admin.repository.js";
const service = new Service(new Repository());
export class Controller {
  signUpHandler: RequestHandler = async (req, res, next) => {
    console.log("received from routes");
    const { email, password, name, username, contact } =
      req.body as SuperAdminCreateReqDTO; // validated value from validator
    service.signUpHandler({ email, password, name, username, contact });
    console.log("✅ result");
    return res.status(200);
  };
}
