import type { ResidentCreateSchema } from "./residents.validator.js";
import {Repository}from"./residents.repo.js"
export class Service {
  constructor(readonly repo:Repository) {}
  createResident = async (input: ResidentCreateSchema) => {
    const {username, name, password, contact, resident, email } = input;
    const result = await this.repo.register(input)
  };
  findMany = async () => {};
  modifyResidentsStatus = async () => {};
  modifyResidentStatus = async () => {};
  delete = async () => {};
}
