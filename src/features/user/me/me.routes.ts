import { Router } from "express";
import { Controller } from "./me.controller.js";
import { validate } from "../../../lib/middleware/validator.js";
import { avatarImageSchema, passwordSchema } from "./me.validator.js";
import passport from "../../../lib/passport/index.js";

const meRouter = Router();
const controller = new Controller();
meRouter.patch(
  "/avatar",
  validate(avatarImageSchema, "body"),
  passport.authenticate("accessToken", {session:false}),
  controller.modifiedAvatar
); // TODO:test
meRouter.patch(
  "/password",
  passport.authenticate("accessToken", {session:false}),
  validate(passwordSchema, "body"),
  controller.modifiedPassword
); // TODO:test
export default meRouter;
