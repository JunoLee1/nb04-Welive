import type { Apartment, Resident, Role } from '../../../prisma/generated/client.js';

export type adminOfDTO = {id : string; name: string};
export interface LoginRequestDTO {
    username: string;
    password: string;
}

export interface LoginResponseDTO {
    id: string;
    username: string;
    email: string;
    contact: string;
    avatar: string | null;
    isActive: boolean;
    role: Role;
    adminOf?: adminOfDTO | null;
    resident?: Resident;
}