import { HttpError } from "../../../lib/middleware/error.middleware/httpError.js";
import type {
  RequestBody,
  AdminsCreateResponseDTO,
  ReqParams,
  AccessListOfAdminsResDTO,
  StatusAction,
} from "./admin.dto.js";
import { Repository } from "./admins.repository.js";
import  bcrypt  from "bcrypt";
export class Service {
  constructor(readonly repo: Repository) {}

  register = async (input: RequestBody): Promise<AdminsCreateResponseDTO> => {
    const { email, name, username, password, avatar, contact } = input;
    const duplicatedEmail = await this.repo.findByEmail(email);
    if (duplicatedEmail)
      throw new HttpError(400);
    const duplicatedUsername = await this.repo.findByUsername(username);
    if (duplicatedUsername)
      throw new HttpError(
        400
      );

    const hashedPassword = await bcrypt.hash(password,10)
    const newAdmin = await this.repo.createAdmin({ email, name, username, password: hashedPassword, avatar, contact});
    const result = {
      ...newAdmin,
    };
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
      page:pageNumber,
      limit:limitNumber,
      totalCount: data.length,
      hasNext: true,
    };
  };

  modifyStatus = async (// TODO: fix it
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
      hasNext: true, //TODO : test 
    };
  };

  deleteRejectedAdmins = async (joinStatus: StatusAction): Promise<void> => {
    if (joinStatus !== "REJECTED")
      throw new HttpError(400);
    return await this.repo.deleteMany(joinStatus);
  };
}
