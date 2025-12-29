import { HttpError } from "../../lib/middleware/error.middleware/httpError.js";
import type {
  GetApartmentsResponseDto,
  RequestQuery,
  ApartmentDto,
} from "./apartments.dto.js";
import { Repository } from "./apartments.repo.js";
export class Service {
  constructor(readonly repo: Repository) {}
  findMany = async (input: RequestQuery): Promise<GetApartmentsResponseDto> => {
    const { page, limit, searchKeyword } = input;
    const apts = await this.repo.findMany({ page, limit, searchKeyword });
    const result = {
      data: apts,
      hasNext: true,
      totalCount: apts.length,
      page,
      limit,
    };
    return result;
  };

  findOne = async (id: string): Promise<ApartmentDto> => {
    const apt = await this.repo.findOne(id);
    if (!apt) throw new HttpError(404, "NotFound");
    const result = {
      id: apt.id,
      name: apt.name,
      address: apt.address,
      officeNumber: apt.officeNumber,
      description: apt.description,
    };
    return result;
  };
}
