import { JoinStatus } from "../../../../prisma/generated/client.js";

export interface apartmentDTO{
    id: string,
    createdAt: Date,
    updatedAt: Date,
    name: string,
    address: string,
    description: string,
    officeNumber:string,
    buildingNumberFrom: number,
    buildingNumberTo: number,
    floorCountPerBuilding: number,
    unitCountPerFloor: number,
    adminId: string
}

export interface ReqParams {
    pageNumber: number,
    limitNumber: number,
    keyword: string,
    joinStatus: JoinStatus
}
export interface RequestBody {
    email:string,
    password: string,
    name:string,
    username:string, 
    avatar: string | null,
    contact: string,
}
export type StatusAction = "APPROVED" | "REJECTED"
//------------response DTO
export interface AdminsCreateResponseDTO {
    id: string,
    contact:string,
    name:string,
    role: string,
    avatar: string | null,
    isActive:boolean,
    approvedAt: Date | null,
    adminOf: apartmentDTO | null,
}

export interface AccessAdminItemDTO {
    id: string;
    contact: string;
    name: string;
    role: string;
    joinStatus: JoinStatus,
    avatar: string | null;
    isActive: boolean;
    approvedAt: Date | null;
    adminOf: apartmentDTO | null;
}
export interface AccessListOfAdminsResDTO {
    data: AdminsCreateResponseDTO[];
    hasNext:boolean;
}
