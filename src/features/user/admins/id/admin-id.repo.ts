import prisma from "../../../../lib/prisma.js";
import type { StatusAction } from "../admin.dto.js";
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
  modifyInfo = async (id: string) => {
    const user = await this.findOne("id", id);
    if (!user) throw new Error("User not found");
    const result = await prisma.user.update({
      where: { id }, //TODO: 관리자 수정시 리턴 타입
      data: {
        //TODO : 관리자가 어떤 관리자 정보를 수정 가능 한가 ?
        username: user.username,
        email: user.email,
        contact: user.contact,
      },
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
      where: {
        id,
        joinStatus: "PENDING",
      },
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
