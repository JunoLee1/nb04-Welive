import { Router } from "express";
import { Controller } from "./admins.controller.js";
import idRouter from "./id/admin-id.routes.js";
import { validate } from "../../../lib/middleware/validator.js";
import {
  requestBodySchema,
  requestQuerySchema,
  joinStatusSchema,
  requestParamSchema,
} from "./admins.validation.js";
import passport from "../../../lib/passport/index.js";

const controller = new Controller();
const adminRouter = Router();

adminRouter.use(
  "/id",
  validate(requestParamSchema, "params"),
  passport.authenticate("accessToken", { session: false }),
  idRouter
);

// create admin Api
// address : users/admins
adminRouter.post("/", validate(requestBodySchema, "body"), controller.register);

// access admins API
// address : users/admins
adminRouter.get(
  "/",
  validate(requestQuerySchema, "query"),
  passport.authenticate("accessToken", { session: false }),
  controller.accessList
);

// patch the admins Join status API
// address : users/admins/joinStatus
adminRouter.patch(
  "/joinStatus",
  validate(joinStatusSchema, "body"),
  passport.authenticate("accessToken", { session: false }),
  controller.modifyStatus
);

// delete rejected Admin user
// address : users/admins/rejected
adminRouter.delete(
  "/rejected",
  passport.authenticate("accessToken", { session: false }),
  controller.deleteRejectedAdmins
);

export default adminRouter;
