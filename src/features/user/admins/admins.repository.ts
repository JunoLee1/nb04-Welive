import prisma from "../../../lib/prisma.js";
import type { RequestBody,StatusAction } from "./admin.dto.js";
import { JoinStatus } from "../../../../prisma/generated/client.js";

type Param = {
  whereCondition: object;
  skip: number;
  limitNumber: number;
  status: JoinStatus | null;
};

type StatusResult = //TODO: 좀더 공부 해보기
  | { action: "APPROVED"; from: "PENDING"; to: "APPROVED" }
  | { action: "REJECTED"; from: "PENDING"; to: "REJECTED" };

export class Repository {
  constructor() {}

  findManyByStatus = async (joinStatus:StatusAction) => { //TODO: 제너릭으로 ?
    const result = await prisma.user.findMany({
      where:{
        joinStatus:JoinStatus.PENDING
      },
      include:{
        adminOf:true
      }
    })
    return result
  }
  updateMany = async (joinStatus:StatusAction) => {//TODO: updateMany 좀더 깊게 알아보기
    const toStatus = 
      joinStatus === "APPROVED" ? JoinStatus.APPROVED : JoinStatus.REJECTED
    
    const result = await prisma.user.updateMany({
      where:{joinStatus: JoinStatus.PENDING},
      data:{joinStatus:toStatus}
    })
    return result
  };
  findMany = async ({ whereCondition, skip, limitNumber, status }: Param) => {
    const result = await prisma.user.findMany({
      where: {
        ...whereCondition,
        joinStatus: status as JoinStatus,
      },
      select: {
        id: true,
        name: true,
        contact: true,
        email: true,
        username: true,
        avatar: true,
        isActive: true,
        hasNext: true,
        adminOf: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            name: true,
            address: true,
            description: true,
            officeNumber: true,
            buildingNumberFrom: true,
            buildingNumberTo: true,
            floorCountPerBuilding: true,
            unitCountPerFloor: true,
            adminId: true,
          },
        },
      },
      take: limitNumber,
      skip,
    });
    return result;
  };

  findById = async (id: string) => { //TODO: 제너릭으로 할수 있지 않을까 고민 해보기
    const userId = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return userId;
  };
  findByUsername = async (username: string) => {//TODO: 제너릭으로 할수 있지 않을까 고민 해보기
    const userName = await prisma.user.findUnique({
      where: { username },
    });
    return userName;
  };
  findByEmail = async (email: string) => { //TODO: 제너릭으로 할수 있지 않을까 고민 해보기
    const userEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return userEmail;
  };
  createAdmin = async (input: RequestBody) => {
    const newAdmin = await prisma.user.create({
      data: {
        email: input.email ?? "",
        username: input.username ?? "",
        name: input.name ?? "",
        password: input.password ?? "",
        contact: input.contact ?? "",
        role: "ADMIN",
        avatar: input.avatar ?? "",
        approvedAt: "",
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        contact: true,
        role: true,
        isActive: true,
        approvedAt: true,
        createdAt: true,
        hasNext: true,
        avatar: true,
        adminOf: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            address: true,
            description: true,
            buildingNumberFrom: true,
            buildingNumberTo: true,
            floorCountPerBuilding: true,
            unitCountPerFloor: true,
            officeNumber: true,
            adminId: true,
          },
        },
      },
    });
    return newAdmin;
  };
  
  deleteMany = async (joinStatus:StatusAction) => {
    await prisma.user.deleteMany({
      where:{
        joinStatus: "REJECTED"
      }
    })
  }
}
