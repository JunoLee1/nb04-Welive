import { Router } from "express";
import { Controller } from "./auth.controller.js";
import type { Express }from "express"
import { Service } from "./auth.services.js";
import { validate } from "../../lib/middleware/validator.js";
import { loginSchema } from "./auth.validator.js";
import { passport } from "../../lib/passport/index.js"
const router = Router();
const service = new Service();
const controller = new Controller(service);

//로그인 API
router.post("/login",passport.authenticate('local', { session: false }), validate(loginSchema, "body"), controller.loginHandler);
// 로그아웃 라우트
router.post("/logout", controller.logoutHandler); 
// 토큰 갱신 라우트
router.post("/refresh-token", controller.refreshTokenHandler);//TODO: manage token by cookie

export function authRoutes(app: Express) {
    app.use("/auth", router);
};

