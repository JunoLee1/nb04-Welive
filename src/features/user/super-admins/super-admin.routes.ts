import { Router } from "express";
import { superAdminSignUpSchema } from "./super-admin.validator.js";
import { Controller } from "./super-admin.controller.js";
import { validate } from "../../../lib/middleware/validator.js";
import { Service } from "./super-admin.service.js";
import { Repository } from "./super-admin.repository.js";
import upload  from "../../../lib/middleware/upload.js";
const service = new Service(new Repository());
// create super admin post API
const superAdminRouter = Router();
const controller = new Controller(service);
superAdminRouter.post(
  "/",
  validate(superAdminSignUpSchema, "body"),
   upload.single("avatar"),
  controller.signUpHandler,
);

export default superAdminRouter;
