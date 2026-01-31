import type {
  ResidentCreateSchema,
  ReqParamQuerySchema,
} from "./residents.validator.js";
import { Repository } from "./residents.repo.js";
import type {
  RegisterApartmentDTO,
  ResidentCreateResponse,
  FindAllpagesResidentResponse,
  ResidentRequestParamQuery,
  ResidentUserFindAllPageResponse,
} from "./residents.dto.js";
import type { Pagenation, StatusAction } from "../admins/admin.dto.js";
import { HttpError } from "../../../lib/middleware/error.middleware/httpError.js";
import { Prisma } from "../../../../prisma/generated/client.js";
export class Service {
  constructor(readonly repo: Repository) {}
  createResident = async (input: ResidentCreateSchema) => {
    const { username, name, password, contact, resident, email } = input;
    const result = await this.repo.register({
      username,
      name,
      password,
      contact,
      resident,
      email,
    });
    return result;
  };
  findMany = async (
    adminId: string,
    pagenation: Pagenation,
    query: ResidentRequestParamQuery
  ): Promise<ResidentUserFindAllPageResponse> => {
    const { page, limit } = pagenation;
    const { searchKeyword, joinStatus, building, unit } = query;

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    // repo에서 resident 기준으로 가져오기
    console.log(12);
    const residents = await this.repo.findMany(adminId, limitNumber, skip, query);
    const apartmentId = residents[0]?.apartmentId;
    if(!apartmentId) throw new Error("notfound")
    const uniqueApt = await this.repo.findApartment(apartmentId)


    console.log(1234);
    const filteredResidents = residents.filter(
      (r) =>
        (building === undefined || r.building === building) &&
        (unit === undefined || r.unit === unit)
    );

    // adminId 기준 필터
    const totalCount = filteredResidents.length;

    const data: FindAllpagesResidentResponse[] = residents.map((r) => ({
      email: r.user.email,
      name: r.user.name,
      contact: r.user.contact,
      joinStatus: r.user.joinStatus,
      apartment: {
        buildings: r.apartment.buildings ?? [],
        units: r.apartment.units ?? []
      },
      resident: [
        {
          id: r.id,
          building: r.building,
          unit: r.unit,
        },
      ],
    }));
    console.log(data);
    const result = {
      data,
      //apartment: uniqueApt,
      hasNext: pageNumber * limitNumber < totalCount,
      page: pageNumber,
      skip,
      totalCount,
    };
    console.log(result)
    return result
  };

  modifyResidentsStatus = async (joinStatus: StatusAction) => {
    // find all user that join status is Pending.
    // request value => approved? status => approved all | status => reject all
    // Im not to sure for adding pending checker
    const result = await this.repo.updateMany(joinStatus);
    return result;
  };
  modifyResidentStatus = async (id: string, joinStatus: StatusAction) => {
    const result = await this.repo.update(id, joinStatus);
    return result;
  };
  deleteMany = async (joinStatus: "REJECTED") => {
    return await this.repo.deleteMany(joinStatus);
  };
}
