import { JoinStatus } from "../../../../prisma/generated/enums.js";
import { HttpError } from "../../../lib/middleware/error.middleware/httpError.js";
import type {
  RequestBody,
  AdminsCreateResponseDTO,
  ReqParams,
  AccessListOfAdminsResDTO,
  StatusAction,
  Pagenation,
} from "./admin.dto.js";
import { Repository } from "./admins.repository.js";
import bcrypt from "bcrypt";
export class Service {
  constructor(readonly repo: Repository) {}

  registerAdmin = async (input: RequestBody): Promise<void> => {
    const { email, name, username, password, avatar, contact } = input;
    const duplicatedEmail = await this.repo.findByEmail(email);
    if (duplicatedEmail)
      throw new HttpError(
        400,
        "	잘못된 요청(필수사항 누락 또는 잘못된 입력값)입니다."
      );
    const duplicatedUsername = await this.repo.findByUsername(username);
    if (duplicatedUsername)
      throw new HttpError(
        400,
        "	잘못된 요청(필수사항 누락 또는 잘못된 입력값)입니다."
      );

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.repo.createAdmin({
      email,
      name,
      username,
      password: hashedPassword,
      avatar,
      contact,
    });
    return;
  };
  accessList = async (
    adminId: string,
    input: ReqParams
  ): Promise<AccessListOfAdminsResDTO> => {
    console.log("received request from access list routes");
    const { page, limit, keyword, joinStatus } = input;
    const skip = (page - 1) * limit;

    const whereCondition = {
      ...(keyword && {
        OR: [
          { username: { contains: keyword } },
          { email: { contains: keyword } },
          { contact: { contains: keyword } },
          { name: { contains: keyword } },
        ], //TODO: Refactor
      }),
      adminOf: {
        adminId: adminId,
      },
    };

    const admins = await this.repo.findMany({
      limit,
      skip,
      whereCondition,
      status: joinStatus,
    });
    if (!admins) throw new HttpError(404, "Not Found");
    const data = admins.map((u) => ({
      id: u.id,
      contact: u.contact,
      name: u.name,
      role: u.role,
      avatar: u.avatar,
      joinStatus: u.joinStatus,
      username: u.username,
      email: u.email,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      isActive: u.isActive,
      hasNext: u.hasNext,
      approvedAt: u.approvedAt,
      adminOf: u.adminOf
        ? {
            id: u.adminOf.id,
            name: u.adminOf.name,
            //createdAt: u.adminOf.createdAt,
            //updatedAt: u.adminOf.updatedAt,
            address: u.adminOf.address,
            description: u.adminOf.description,
            officeNumber: u.adminOf.officeNumber,
            buildings: u.adminOf.buildings,
            floorCountPerBuilding: Number(u.adminOf.floorCountPerBuilding),
            unitCountPerFloor: Number(u.adminOf.unitCountPerFloor),
            adminId: u.adminOf.adminId,
          }
        : null,
    }));

    const totalCount = data.length; // TODO: refactor to count query
    const hasNext =page * limit < totalCount;
    return {
      data,
      page,
      limit,
      totalCount,
      hasNext,
    };
  };

  modifyStatus = async (
    // TODO: fix it
    pagenation: Pagenation,
    joinStatus: StatusAction
  ): Promise<AccessListOfAdminsResDTO> => {
    const toStatus =
      joinStatus === "APPROVED" ? JoinStatus.APPROVED : JoinStatus.REJECTED;
    await this.repo.updateMany(joinStatus);
    const modifiedStatusAdmins = await this.repo.updateMany(toStatus);
    const { page, limit } = pagenation;
    const admins = await this.repo.findManyByStatus(toStatus);
    const data = admins.map((u) => ({
      id: u.id,
      contact: u.contact,
      email: u.email,
      joinStatus: toStatus,
      password: u.password,
      username: u.username,
      name: u.name,
      role: u.role,
      avatar: u.avatar,
      isActive: u.isActive,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      approvedAt: null,
      adminOf: u.adminOf
        ? {
            id: u.adminOf.id,
            name: u.adminOf.name,
            createdAt: u.adminOf.createdAt,
            updatedAt: u.adminOf.updatedAt,
            address: u.adminOf.address,
            description: u.adminOf.description,
            officeNumber: u.adminOf.officeNumber,
            buildings: u.adminOf.buildings,
            floorCountPerBuilding: Number(u.adminOf.floorCountPerBuilding),
            unitCountPerFloor: Number(u.adminOf?.unitCountPerFloor),
            adminId: u.adminOf?.adminId,
          }
        : null,
    }));
    const totalCount = data.length;
    const hasNext = page * limit < totalCount;
    return {
      data,
      totalCount,
      hasNext,
      page: page,
      limit: limit,
    };
  };

  deleteRejectedAdmins = async (): Promise<void> => {
    return await this.repo.deleteMany();
  };
}
