import prisma from "../../../../lib/prisma.js";
import type { StatusAction, RequestPayloadDTO } from "../admin.dto.js";
type FindUniqueKey = "id" | "email" | "username" | "contact";

const buildWhereClause = (field: FindUniqueKey, value: string) => {
  switch (field) {
    case "id":
      return { id: value };
    case "email":
      return { email: value };
    case "username":
      return { username: value };
    case "contact":
      return { contact: value };
  }
};
export class Repository {
  constructor() {}
  findOne = async (field: FindUniqueKey, value: string) => {
    const where = buildWhereClause(field, value);
    const result = await prisma.user.findUnique({ where });
    return result;
  };
  modifyUserInfo = async (id: string, input: RequestPayloadDTO) => {
    const user = await this.findOne("id", id);
    if (!user) throw new Error("User not found");
    const data: any = {
      username: input.username ?? user.username,
      email: input.email ?? user.email,
      contact: input.contact ?? user.contact,
    };
    if (input.adminOf !== null && input.adminOf !== undefined ) {
      data.adminOf = {
        update: input.adminOf.map(apt => ({
          where :{id: apt.id},
          data: { name: apt.name, address: apt.address }
        }))
      };
    }
    const result = await prisma.user.update({
      where: { id },
      data,
      include: {
        adminOf: true,
      },
    });
    return result;
  };

  modifyStatus = async (id: string, joinStatus: StatusAction) => {
    const user = await this.findOne("id", id);
    const toStatus = joinStatus === "APPROVED" ? "APPROVED" : "REJECTED";
    if (!user) throw new Error("NotFound");
    const result = await prisma.user.update({
      where: { id },
      data: {
        joinStatus: toStatus,
      },
      include: {
        adminOf: true,
      },
    });

    return result;
  };
  delete = async (field: FindUniqueKey, value: string) => {
    const where = buildWhereClause(field, value);
    await prisma.user.delete({
      where,
    });
    return;
  };
}
