import { Router } from "express";
import { Controller } from "./admin-id.controller.js";
import { validate } from "../../../../lib/middleware/validator.js";
import { joinStatusSchema, requestPatchSchema } from "../admins.validation.js";
import upload from "../../../../lib/middleware/upload.js";
import { Service } from "./admin-id.service.js";
import { Repository } from "./admin-id.repo.js";

const idRouter = Router();
const repo = new Repository();
const service = new Service(repo);
const controller = new Controller(service);

// patch an admin Join status API
// address : users/admins/:{id}/joinStatus
idRouter.patch(
  "/joinStatus",
  validate(joinStatusSchema, "body"),
  controller.modifyStatus
);

// Patch an admin user info
// address : users/admins/:{id}
idRouter.patch(
  "/",
  upload.single("profileImage"),
  validate(requestPatchSchema, "body"),
  controller.modifyUserInfo
);

// delete admin account API
// address : users/admins/{id}
idRouter.delete("/", controller.deleteAdmin);

export default idRouter;
