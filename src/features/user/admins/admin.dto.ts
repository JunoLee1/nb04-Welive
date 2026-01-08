import { JoinStatus } from "../../../../prisma/generated/client.js";
export interface apartmentDTO {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  address: string;
  description: string;
  officeNumber: string;
  buildingNumberFrom: number;
  buildingNumberTo: number;
  floorCountPerBuilding: number;
  unitCountPerFloor: number;
  adminId: string;
}

export interface ReqParams {
  pageNumber: number;
  limitNumber: number;
  keyword: string;
  joinStatus: JoinStatus;
}
export interface RequestBody {
  email: string;
  password: string;
  name: string;
  username: string;
  avatar: string | null;
  contact: string;
}

export interface RequestPayloadDTO {
  contact: string | null;
  username: string | null;
  email: string | null;
  adminOf: apartmentDTO[] | null;
  avatar: Express.Multer.File | undefined;
}
export interface Pagenation {
  pageNumber: number,
  limitNumber: number
}
export type StatusAction = "APPROVED" | "REJECTED";
//------------response DTO
export interface AdminsCreateResponseDTO {
  id: string;
  contact: string;
  name: string;
  role: string;
  avatar: string | null;
  isActive: boolean;
  approvedAt: Date | null;
  adminOf: apartmentDTO | null;
}

export interface AccessAdminItemDTO {
  id: string;
  contact: string;
  name: string;
  role: string;
  joinStatus: JoinStatus;
  avatar: string | null;
  isActive: boolean;
  approvedAt: Date | null;
  adminOf: apartmentDTO[] | null;
}
export interface AccessListOfAdminsResDTO {
  data: AdminsCreateResponseDTO[];
  page?: number;
  limit?: number;
  totalCount: number;
  hasNext: boolean;
}

export interface AdminsModifiedResponseDTO {
  id: string;
  contact: string;
  username:string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  isActive: boolean;
  approvedAt: Date | null;
  adminOf: apartmentDTO | null;
} 
export interface AdminsModifiedRequestDTO {
  contact?: string;
  username?:string;
  name?: string;
  email?: string;
  role: string;
  avatar?: Express.Multer.File | null;
  isActive: boolean;
  approvedAt: Date | null;
  adminOf: apartmentDTO | null;
}