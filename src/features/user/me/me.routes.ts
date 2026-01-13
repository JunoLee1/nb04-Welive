import { Router } from "express";
import { Controller } from "./me.controller.js";
import { validate } from "../../../lib/middleware/validator.js";
import { avatarImageSchema, passwordSchema } from "./me.validator.js";
import passport from "../../../lib/passport/index.js";
import upload from "../../../lib/middleware/upload.js";

const meRouter = Router();
const controller = new Controller();
meRouter.patch(
  "/avatar",
  passport.authenticate("accessToken", { session: false }),
  upload.single("avatarImage"),
  validate(avatarImageSchema, "body"),
  controller.modifiedAvatar
); // TODO:test
meRouter.patch(
  "/password",
  passport.authenticate("accessToken", { session: false }),
  validate(passwordSchema, "body"),
  controller.modifiedPassword
);
export default meRouter;
