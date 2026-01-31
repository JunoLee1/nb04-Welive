import { HttpError } from "../../../lib/middleware/error.middleware/httpError.js";
import prisma from "../../../lib/prisma.js";
import type { APTInfo, ResidentCreateResponse } from "./residents.dto.js";
import type {
  ResidentCreateSchema,
  ReqParamQuerySchema,
} from "./residents.validator.js";
import { JoinStatus, Prisma, PrismaClient } from "../../../../prisma/generated/client.js";
import bcrypt from "bcrypt";
import type { Pagenation } from "../admins/admin.dto.js";
type FindKey = "id" | "username" | "contact" | "email";
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
export type StatusAction = "APPROVED" | "REJECTED";

export class Repository {
  constructor(private prisma: PrismaClient) {}
  register = async (
    input: ResidentCreateSchema
  ): Promise<ResidentCreateResponse> => {
    const { email, username, name, contact, password } = input;
    const dulplicatedEmail = await this.findOne("email", email);
    const duplicatedContact = await this.findOne("contact", contact);
    const duplicatedUsername = await this.findOne("username", username);
    const hashedPassword = await bcrypt.hash(password, 10);

    if (dulplicatedEmail)
      throw new HttpError(400, "해당 이메일은 이미 존재 합니다");
    if (duplicatedContact)
      throw new HttpError(400, "해당 휴대폰 번호는 이미 존재 합니다");
    if (duplicatedUsername)
      throw new HttpError(400, "해당 아이디는 이미 존재 합니다");

    const newResident = await prisma.user.create({
      data: {
        email,
        username,
        role: "USER",
        name,
        contact,
        password: hashedPassword,
        joinStatus: JoinStatus.PENDING,
        isActive: false,
      },
      select: {
        email: true,
        //username: true,
        //role: true,
        name: true,
        contact: true,
        joinStatus: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        resident: {
          select: {
            id: true,
            apartmentId: true,
            unit: true,
            building: true,
            isHouseholder: true,
          },
        },
      },
    });
    return newResident;
  };

  findOne = async (field: FindKey, value: string) => {
    const where = buildWhereClause(field, value);
    console.log(where)
    const resident = await prisma.user.findUnique({
      where,
    });
    return resident;
  };

  findMany = async (
    adminId: string,
    limit: number,
    skip: number,
    query: any, // TODL: fix the type
  ) => {
    const { building, unit, joinStatus, searchKeyword } = query;
    console.log(123)
    console.log(query)
    const residents = await this.prisma.resident.findMany({
      where: {
        apartment: { adminId },
        ...(building !== undefined ? { building } : {}),
        ...(unit !== undefined ? { unit} : {}),
      },
      include: {
        user: true,
        apartment:true
      },
      skip,
      take:limit,
    });
    console.log("residents:", residents)
    return residents;
  };
  findApartment = async(apartmentId: string):Promise<APTInfo | null > => {
    const result = await this.prisma.apartment.findUnique({
      where:{
        id: apartmentId
      },
      select:{
        buildings:true,
        units:true,
      }
  })
  return result
  }
  updateMany = async (joinStatus: StatusAction) => {
    const toStatus =
      joinStatus === "APPROVED" ? JoinStatus.APPROVED : JoinStatus.REJECTED;

    const result = await prisma.user.updateMany({
      where: { joinStatus: JoinStatus.PENDING },
      data: { joinStatus: toStatus },
    });
    return result;
  };

  update = async (id: string, joinStatus: StatusAction) => {
    const residentId = await this.findOne("id", id);
    console.log(residentId)
    const toStatus =
      joinStatus === "APPROVED" ? JoinStatus.APPROVED : JoinStatus.REJECTED;

    if (!residentId) throw new HttpError(404, "해당유저의 정보가 없습니다");
    const result = await prisma.user.update({
      where: {
        id: id,
        joinStatus: JoinStatus.PENDING,
      },
      data: {
        joinStatus: toStatus,
      },
    });
    return result;
  };

  deleteMany = async (joinStatus: "REJECTED") => {};
}
