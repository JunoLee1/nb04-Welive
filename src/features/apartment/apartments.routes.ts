import Router from "express";
import { Controller } from "./apartments.controller.js";
import { queryParamSchema, paramSchema } from "./apartments.validataion.js";

const controller = new Controller();
const aptRouter = Router();

aptRouter.get("/", validate(queryParamSchema, "query"), controller.findMany);
aptRouter.get("/:id", validate(paramSchema, "params"), controller.findOne);
export default aptRouter;
