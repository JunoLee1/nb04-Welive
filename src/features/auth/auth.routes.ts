import { Router, type RequestHandler } from "express";
import { Controller } from "./auth.controller.js";
import { Express }from "express"
import { Service } from "./auth.services.js";
// 로그인 라우트
const service = new Service();
const controller = new Controller(service);
const router = Router();
router.post("/login", controller.loginHandler);
// 로그아웃 라우트
router.post("/logout", controller.logoutHandler);
// 토큰 갱신 라우트
router.post("/refresh-token", controller.refreshTokenHandler);

export function authRoutes(app: Express) {
    app.use("/auth", router);
};

