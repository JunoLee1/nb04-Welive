import Router from "express";
import { Controller } from "./residents.controller.js"
import { validate } from "../../../lib/middleware/validator.js";
import { residentCreateSchema,reqParamQuerySchema, joinStatusSchema, paramSchema} from "./residents.validator.js";
const uResidentsRouter = Router();
import passport from "../../../lib/passport/index.js";

const controller = new Controller();
uResidentsRouter.post("/",
    validate(residentCreateSchema,"body"),
    //TODO: Test
    controller.createResident
);

uResidentsRouter.get("/",
    validate(reqParamQuerySchema,"query"),
    passport.authenticate("accessToken", {session: false}),
    //TODO: Test
    controller.findMany
);

uResidentsRouter.patch("/joinStatus",
    validate(joinStatusSchema, "body"),
    passport.authenticate("accessToken", {session: false}),
    //TODO: Test
    controller.modifyResidentsStatus
);

uResidentsRouter.patch("/:id/joinStatus",
    validate(paramSchema, "params"),
    validate(joinStatusSchema, "body"),
    passport.authenticate("accessToken", {session: false}),
    //TODO: Test
    controller.modifyResidentStatus
);

uResidentsRouter.delete("/rejected",
    passport.authenticate("accessToken", {session: false}),
    //TODO: Test
    controller.delete
);

export default uResidentsRouter;
