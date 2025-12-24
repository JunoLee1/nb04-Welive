import { HttpError } from "../../../lib/middleware/error.middleware/httpError.js";
import type {
  RequestBody,
  AdminsCreateResponseDTO,
  ReqParams,
  AccessListOfAdminsResDTO,
  StatusAction,
} from "./admin.dto.js";
import { Repository } from "./admins.repository.js";
export class Service {
  constructor(readonly repo: Repository) {}

  register = async (input: RequestBody): Promise<AdminsCreateResponseDTO> => {
    const { email, name, username, password, avatar } = input;
    console.log("⚓️receivded:", email, name, username, password, avatar);
    const duplicatedEmail = await this.repo.findByEmail(email);
    if (duplicatedEmail)
      throw new HttpError(400, "해당 이메일은 이미 존재하는 이메일 입니다."); //TODO:fix error message
    const duplicatedUsername = await this.repo.findByUsername(username);
    if (duplicatedUsername)
      throw new HttpError(
        400,
        "해당 이메일은 이미 존재하는 유저 아이디 입니다."
      );

    const newAdmin = this.repo.createAdmin(input);
    const result = {
      ...newAdmin,
    };
    console.log("✌️result: ", result);
    return result;
  };
  accessList = async (input: ReqParams): Promise<AccessListOfAdminsResDTO> => {
    console.log("received request from access list routes");
    const { pageNumber, limitNumber, keyword, joinStatus } = input;
    const skip = (pageNumber - 1) * limitNumber;
    console.log(pageNumber, limitNumber, skip);

    const whereCondition = keyword
      ? {
          OR: [
            { username: { contains: keyword } },
            { email: { contains: keyword } },
            { contact: { contains: keyword } },
            { name: { contains: keyword } },
          ], //TODO: Refactor
        }
      : {};
    const admins = await this.repo.findMany({
      limitNumber,
      skip,
      whereCondition,
      status: joinStatus,
    });
    const data = admins.map((u) => ({
      id: u.id,
      contact: u.contact,
      name: u.name,
      role: "ADMIN",
      avatar: u.avatar,
      isActive: u.isActive,
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
            buildingNumberFrom: u.adminOf.buildingNumberFrom,
            buildingNumberTo: u.adminOf.buildingNumberTo,
            floorCountPerBuilding: u.adminOf.floorCountPerBuilding,
            unitCountPerFloor: u.adminOf?.unitCountPerFloor,
            adminId: u.adminOf?.adminId,
          }
        : null,
    }));
    return {
      data,
      totalCount: data.length,
      hasNext: true,
    };
  };

  modifyStatus = async (
    joinStatus: StatusAction
  ): Promise<AccessListOfAdminsResDTO> => {
    const modifiedStatusAdmins = await this.repo.updateMany(joinStatus);
    const admins = await this.repo.findManyByStatus(joinStatus);
    const data = admins.map((u) => ({
      id: u.id,
      contact: u.contact,
      name: u.name,
      role: "ADMIN",
      avatar: u.avatar,
      isActive: u.isActive,
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
            buildingNumberFrom: u.adminOf.buildingNumberFrom,
            buildingNumberTo: u.adminOf.buildingNumberTo,
            floorCountPerBuilding: u.adminOf.floorCountPerBuilding,
            unitCountPerFloor: u.adminOf?.unitCountPerFloor,
            adminId: u.adminOf?.adminId,
          }
        : null,
    }));
    return {
      data,
      totalCount: data.length,
      hasNext: true,
    };
  };

  deleteRejectedAdmins = async (joinStatus: StatusAction): Promise<void> => {
    if (joinStatus !== "REJECTED")
      throw new HttpError(400, "승인된 유저는 삭제 할 수 없습니다.");
    return await this.repo.deleteMany(joinStatus);
  };
}
