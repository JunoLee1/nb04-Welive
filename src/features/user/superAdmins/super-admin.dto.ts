type JoinStatus = "APPROVED" | "DENIED"
type Role = "SUPER_ADMIN" | "ADMIN"| ""//TODO check it is resident or user
export interface SuperAdminCreateReqDTO {
    email:string,
    password: string,
    name: string,
    username:string,
    contact: string
}

export interface SuperAdminCreateResDTO {
    email:string,
    name: string,
    username:string,
    contact: string,
    role: Role,
    avatar: string,
    joinStatus: JoinStatus,
    isActive: Boolean,
}