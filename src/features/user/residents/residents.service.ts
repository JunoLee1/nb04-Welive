import type {
  ResidentCreateSchema,
  ReqParamQuerySchema,
} from "./residents.validator.js";
import { Repository } from "./residents.repo.js";
import type { ResidentUserFindAllPageResponse } from "./residents.dto.js";
import type { StatusAction } from "../admins/admin.dto.js";
import { HttpError } from "../../../lib/middleware/error.middleware/httpError.js";
export class Service {
  constructor(readonly repo: Repository) {}
  createResident = async (input: ResidentCreateSchema) => {
    const { username, name, password, contact, resident, email } = input;
    const result = await this.repo.register(input);
    return result;
  };
  findMany = async (
    query: ReqParamQuerySchema
  ): Promise<ResidentUserFindAllPageResponse> => {
    const { page, limit, searchKeyword, joinStatus, building, unit } = query;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const keyword = searchKeyword as string;
    const whereCondition = keyword
      ? {
          OR: [
            { username: { contains: keyword } },
            { email: { contains: keyword } },
            { contact: { contains: keyword } },
            { name: { contains: keyword } },
          ],
        }
      : {};
    const users = await this.repo.findMany({
      page: pageNumber,
      limit: limitNumber,
      keyword: whereCondition,
    });
    const data = users.map((u) => ({
      id: u.id,
      name: u.name,
      username: u.username,
      role: u.role,
      contact: u.contact,
      joinStatus: u.joinStatus,
      isActive: u.isActive,
      email: u.email,
      password: u.password,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      approvedAt: u.approvedAt,
      resident: u.resident
        ? {
            apartmentId: u.resident.apartmentId,
            unit: u.resident.unit,
            building: u.resident.building,
            isHouseholder: u.resident.isHouseholder,
            updatedAt: u.resident.updatedAt,
            createdAt: u.resident.createdAt,
          }
        : null,
      avatar: u.avatar,
      hasNext: u.hasNext,
    }));
    const result = {
      data: data,
      hasNext: true,
      limit,
      page,
      totalCount: data.length,
    };
    return result;
  };
  modifyResidentsStatus = async (joinStatus: StatusAction)=> {
    // find all user that join status is Pending.
    // request value => approved? status => approved all | status => reject all
    const result = await this.repo.updateMany(joinStatus);
    return result;
  };
  modifyResidentStatus = async (id: string, joinStatus: StatusAction)=> {
    const result = await this.repo.update(id,joinStatus)
    return result
  };
  deleteMany = async (joinStatus: "REJECTED") => {
    await this.repo.deleteMany( joinStatus )
  };
}
