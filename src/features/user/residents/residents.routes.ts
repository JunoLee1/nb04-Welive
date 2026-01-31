import Router from "express";
import { Controller } from "./residents.controller.js"
import { validate } from "../../../lib/middleware/validator.js";
import { residentCreateSchema,reqParamQuerySchema, joinStatusSchema, paramSchema} from "./residents.validator.js";
const uResidentsRouter = Router()

import passport from "../../../lib/passport/index.js";
import { Service } from "./residents.service.js";
import { Repository } from "./residents.repo.js";
import prisma from "../../../lib/prisma.js";


uResidentsRouter.use((req, res, next) => {
  console.log("🚀 [전역 로그] 요청 들어옴!");
  console.log("메서드:", req.method);
  console.log("주소:", req.url);
  next();
});

const repo = new Repository(prisma)
const service = new Service(repo)
const controller = new Controller(service);
uResidentsRouter.post("/",
    validate(residentCreateSchema,"body"),
    controller.createResident
);

uResidentsRouter.get("/",
    validate(reqParamQuerySchema,"query"),
    passport.authenticate("accessToken", {session: false}),
    controller.findMany
);

uResidentsRouter.patch("/join-status",
    validate(joinStatusSchema, "body"),
    passport.authenticate("accessToken", {session: false}),
    controller.modifyResidentsStatus
);

uResidentsRouter.patch("/:id/join-status",
    validate(paramSchema, "params"),
    validate(joinStatusSchema, "body"),
    passport.authenticate("accessToken", {session: false}),
    controller.modifyResidentStatus
);

uResidentsRouter.delete("/rejected",
    passport.authenticate("accessToken", {session: false}),
    controller.delete
);

export default uResidentsRouter;
