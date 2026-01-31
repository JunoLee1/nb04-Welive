import { JoinStatus } from "../../../../prisma/generated/client.js";
import type { Role } from "../super-admins/super-admin.dto.js";
export interface apartmentDTO {
  id: string | string[];
  //createdAt: Date;
  //updatedAt: Date;
  name: string;
  address: string;
  description: string;
  officeNumber: string;
  buildings:number[],
  floorCountPerBuilding: number;
  unitCountPerFloor: number;
  adminId: string;
}

export interface ReqParams {
  page: number;
  limit: number;
  keyword: string;
  joinStatus: JoinStatus;
  role: Role;
}
export interface RequestBody {
  email: string;
  password: string;
  name: string;
  username: string;
  avatar: string | undefined | null;
  contact: string;
}

export interface RequestPayloadDTO {
  contact?: string | null;
  name?: string | null;
  email?: string;
  adminOf?: apartmentDTO | null;
  avatar?: string | undefined | null;
}
export interface Pagenation {
  page: number;
  limit: number;
}
export type StatusAction = "APPROVED" | "REJECTED";
//------------response DTO
export interface AdminsCreateResponseDTO {
  id: string | string[];
  contact: string;
  name: string;
  role: Role;
  avatar: string | null;
  joinStatus: JoinStatus;
  isActive: boolean;
  approvedAt: Date | null;
  adminOf: apartmentDTO | null;
}

export interface AccessAdminItemDTO {
  id: string | string[];
  contact: string;
  name: string;
  role: string;
  joinStatus: JoinStatus;
  avatar: string | null;
  isActive: boolean;
  approvedAt: Date | null;
  adminOf: apartmentDTO | null;
}
export interface AccessListOfAdminsResDTO {
  data: AdminsCreateResponseDTO[] ;
  page?: number;
  limit?: number;
  totalCount: number;
  hasNext: boolean;
}

export interface AdminsModifiedResponseDTO {
  id: string | string[];
  contact: string;
  username: string;
  name: string;
  email: string;
  role: string;
  avatar: string | undefined | null;
  isActive: boolean;
  approvedAt: Date | null;
  adminOf: apartmentDTO | null;
}
export interface AdminsModifiedRequestDTO {
  contact?: string;
  username?: string;
  name?: string;
  email?: string;
  role: string;
  avatar?: Express.Multer.File | undefined;
  isActive: boolean;
  approvedAt: Date | null;
  adminOf: apartmentDTO | null;
}
