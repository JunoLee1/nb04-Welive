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

// ⭐ 구체적인 라우트 먼저 등록 (순서 중요!)

// create admin Api
adminRouter.post("/", validate(requestBodySchema, "body"), controller.register);

// access admins API
adminRouter.get(
  "/",
  validate(requestQuerySchema, "query"),
  passport.authenticate("accessToken", { session: false }),
  controller.accessList
);

// patch the admins Join status API
adminRouter.patch(
  "/join-status",
  validate(joinStatusSchema, "body"),
  passport.authenticate("accessToken", { session: false }),
  controller.modifyStatus
);

// delete rejected Admin user
adminRouter.delete(
  "/rejected",
  passport.authenticate("accessToken", { session: false }),
  controller.deleteRejectedAdmins
);

// ⭐ /:id는 마지막에! (catch-all 같은 거라 가장 뒤로)
adminRouter.use(
  "/:id",
  validate(requestParamSchema, "params"),
  passport.authenticate("accessToken", { session: false }),
  idRouter
);

export default adminRouter;