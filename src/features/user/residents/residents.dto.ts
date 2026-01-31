//===============================
// lib tyoe
//===============================

import type { JoinStatus } from "../../../../prisma/generated/enums.js";
import type { Role } from "../super-admins/super-admin.dto.js";

type Status = "PENDING" | "APPROVED" | "REJECTED";

//===============================
// requst Dto
//===============================

export interface RegisterApartmentDTO {
  id: string;
  userId?: string | null;
  unit: string | null;
  building: string | null;
  isHouseholder: boolean;
}

export interface ResidentRequestParamQuery {
  building: string| number| undefined ;
  unit: string | number|undefined;
  searchKeyword: string | undefined;
  joinStatus: JoinStatus;
}

export interface ResidentCreateRequest {
  username: string;
  email: string;
  name: string;
  password: string;
  contact: string;
  resident: RegisterApartmentDTO | null;
}

//==================================
// response
//==================================

export interface APTInfo {
  buildings: number[] | string[] | null;
  units: number[] | string[] | null;
}
export interface ResidentCreateResponse {
  email: string;
  name: string;
  contact: string;
  joinStatus: Status;
  resident: RegisterApartmentDTO | null;
}
export interface FindAllpagesResidentResponse {
  email: string;
  name: string;
  contact: string;
  joinStatus: Status;
  resident: {
    id: string;
    unit: string;
    building: string;
  }[];
  apartment:APTInfo
}[]

export interface ResidentUserFindAllPageResponse {
  data: FindAllpagesResidentResponse[];
  hasNext: boolean;
  totalCount: number;
  skip: number;
  page: number;
}
