import { Router } from "express";
import { superAdminSignUpSchema } from "./super-admin.validator.js";
import { Controller } from "./super-admin.controller.js";
import { validate } from "../../../lib/middleware/validator.js";

// create super admin post API
const superAdminRouter = Router();
const controller = new Controller();
superAdminRouter.post(
  "/",
  validate(superAdminSignUpSchema, "body"),
  controller.signUpHandler
);

export default superAdminRouter;
