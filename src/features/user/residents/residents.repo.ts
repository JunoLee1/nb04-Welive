import { HttpError } from "../../../lib/middleware/error.middleware/httpError.js";
import prisma from "../../../lib/prisma.js";
import type { ResidentCreateResponse } from "./residents.dto.js";
import type { ResidentCreateSchema } from "./residents.validator.js";

type FindKey = "id" | "username" | "contact" | "email";
type StatusAction = "APPROVED" | "REJECTED";
const buildWhereClause = (field: FindKey, value: string) => {
  //통합
  switch (field) {
    case "id":
      return { id: value };
    case "username":
      return { username: value };
    case "contact":
      return { contact: value };
    case "email":
      return { email: value };
  }
};

export class Repository {
    constructor (){}
  register = async (input:ResidentCreateSchema): Promise<ResidentCreateResponse> => {
    const {email, username, name, contact, password } = input;
    const dulplicatedEmail = await this.findOne("email", email);
    const duplicatedContact = await this.findOne("contact", contact)
    const duplicatedUsername= await this.findOne("username", username)
   
    if(dulplicatedEmail) throw new HttpError(400,"해당 이메일은 이미 존재 합니다")
    if(duplicatedContact) throw new HttpError(400,"해당 휴대폰 번호는 이미 존재 합니다")
    if(duplicatedUsername) throw new HttpError(400,"해당 아이디는 이미 존재 합니다")
    const newResident = await prisma.user.create({
      data:{
        email,
        username,
        role: "USER",
        name,
        contact,
        password,
        joinStatus:"PENDING",
      },
      select:{
        email: true,
        username:true,
        role: true,
        name:true,
        contact:true,
        password:true,
        joinStatus:true,
        isActive: true,
        createdAt:true,
        updatedAt:true,
        resident:{
          select:{
            id: true,
            apartmentId:true,
            unit: true,
            building:true,
            isHouseholder: true,
            createdAt:true,
            updatedAt:true,
          }
        }
      }
      

    })
    return newResident
  };
  findOne = async (field: FindKey, value: string) => {
    const where = buildWhereClause(field, value);
    const resident = await prisma.user.findUnique({
      where,
    });
    return resident;
  };
  findMany = async (field: FindKey, value: string) => {
    const where = buildWhereClause(field, value);
    const residents = await prisma.user.findMany({
      where,
      //.. querry params
    });
    return residents;
  };
  modifyResidentStatus = async (id: string, joinStatus: StatusAction) => {};
  modifyResidentsStatus = async (joinStatus: StatusAction) => {};
  delete = async (field: FindKey, value: string) => {
  };
}
