import type { Apartment, Resident, Role } from '../../../prisma/generated/client.js';

export interface LoginRequestDTO {
    username: string;
    password: string;
}

export interface LoginResponseDTO {
    id: string;
    username: string;
    email: string;
    avatar: string;
    isActive: boolean;
    role: Role;
    adminOf?: Apartment[];
    resident?: Resident;
}