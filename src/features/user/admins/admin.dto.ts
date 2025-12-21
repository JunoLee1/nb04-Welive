export interface ReqParams {
    page: number,
    limit: number,
    searchKeyword: string,
    joinStatus: string,
}

export interface RequestBody {
    email:string,
    password: string,
    name:string,
    username:string, 
    avatar: string | null,
    contact: string,
}

export interface AdminsCreateResponseDTO {
    id: string,
    contact:string,
    name:string,
    role: string,
    avatar: string | null,
    isActive:boolean,
    refreshToken?: string,
    hasNext:boolean,
    approvedAt?: Date | null,
    adminOf: apartmentDTO | null,
}

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