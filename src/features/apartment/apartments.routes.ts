import Router from "express";
import { Controller } from "./apartments.controller.js";
import { queryParamSchema, paramSchema } from "./apartments.validation.js";
import { validate } from "../../lib/middleware/validator.js";

const controller = new Controller();
const aptRouter = Router();

aptRouter.get("/", validate(queryParamSchema, "query"), controller.findMany);//TODO :TEST
aptRouter.get("/:id", validate(paramSchema, "params"), controller.findOne);//TODO :TEST
export default aptRouter;
