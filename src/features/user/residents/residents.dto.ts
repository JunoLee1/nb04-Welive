
//===============================
// lib tyoe
//===============================

import type { Role } from "../super-admins/super-admin.dto.js";

type Status = "PENDING" | "APPROVED" | "REJECTED";  

//===============================
// requst Dto
//===============================

export interface RegisterApartmentDTO {
 apartmentId:string,
 userId?: string | null,
 unit: number,
 building: number,
 isHouseholder: boolean,
 updatedAt:Date,
 createdAt:Date
}

export interface ResidentRequestParamQuery {
  page: number,
  limit: number, 
  building: number,
  unit: number,
  searchKeyword: string,
  joinStatus: Status
}

export interface ResidentCreateRequest {
  username: string,
  email: string,
  name: string,
  password: string,
  contact: string,
  resident:RegisterApartmentDTO | null
}

//==================================
 // response
//==================================

export interface ResidentCreateResponse {
  email: string,
  name: string,
  password: string,
  contact: string,
  role: Role,
  joinStatus: Status,
  isActive: boolean,
  resident:RegisterApartmentDTO | null,
  createdAt: Date,
  updatedAt: Date
}

export interface ResidentUserFindAllPageResponse  {
  data:ResidentCreateResponse[],
  hasNext:boolean,
  totalCount: number,
  limit: number,
  page: number
}