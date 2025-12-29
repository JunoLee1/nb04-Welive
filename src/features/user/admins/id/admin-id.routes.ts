import { Router } from "express";
import { Controller } from "./admin-id.controller.js";
import { validate } from "../../../../lib/middleware/validator.js";
import { joinStatusSchema, requestBodySchema } from "../admins.validation.js";

const idRouter = Router();
const controller = new Controller();

// patch an admin Join status API
// address : users/admins/{id}/joinStatus
idRouter.patch(
  "/joinStatus",
  //TODO:TEST

  validate(joinStatusSchema, "body"),
  controller.modifyJoinStatus
);

// Patch an admin user info
// address : users/admins/{id}
idRouter.patch(
  "/",
  //TODO:TEST
  validate(requestBodySchema, "body"),
  controller.modifyUserInfo
);

// delete admin account API
// address : users/admins/{id}
idRouter.delete("/", controller.deleteAdmin);
//TODO:TEST

export default idRouter;
