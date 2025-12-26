import type { RequestHandler } from "express";
import { Service } from "./residents.service.js";
import type { ResidentCreateSchema } from "./residents.validator.ts";
import { Repository } from "./residents.repo.js";

const repo = new Repository()
const service = new Service(repo);
export class Controller {
  constructor() {}

  createResident: RequestHandler = async (req, res, next) => {
    const { username, email, name, password, contact, resident } =
      req.body as ResidentCreateSchema;
    await service.createResident({
      username,
      email,
      name,
      password,
      contact,
      resident,
    });
  };

  findMany: RequestHandler = async (req, res, next) => {
    await service.findMany;
  };

  modifyResidentsStatus: RequestHandler = async (req, res, next) => {
    await service.modifyResidentsStatus;
  };

  modifyResidentStatus: RequestHandler = async (req, res, next) => {
    await service.modifyResidentStatus;
  };

  delete: RequestHandler = async (req, res, next) => {
    await service.delete;
  };
}
