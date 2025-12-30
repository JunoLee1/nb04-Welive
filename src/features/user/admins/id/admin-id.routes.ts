import { Router } from "express";
import { Controller } from "./admin-id.controller.js";
import { validate } from "../../../../lib/middleware/validator.js";
import { joinStatusSchema, requestPatchSchema } from "../admins.validation.js";

const idRouter = Router();
const controller = new Controller();

// patch an admin Join status API
// address : users/admins/:{id}/joinStatus
idRouter.patch(
  "/joinStatus",
  validate(joinStatusSchema, "body"),
  controller.modifyJoinStatus
);

// Patch an admin user info
// address : users/admins/:{id}
idRouter.patch(
  "/",
  validate(requestPatchSchema, "body"),
  controller.modifyUserInfo
);

// delete admin account API
// address : users/admins/{id}
idRouter.delete("/", controller.deleteAdmin);

export default idRouter;
