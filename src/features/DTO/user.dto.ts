import type { Apartment, JoinStatus, Resident, Role } from '../../../prisma/generated/client.js';

export interface credentialsDTO {
    username: string;
    password: string;
}

export interface CreateSuperAdminRequestDTO extends credentialsDTO {
    email : string;
    contact: string;
    name: string;
    adminOf: Apartment[];
}

export interface AccessAdminsRequestDTO {
    page?: number;
    limit?: number;
    searchKeyword?: string;
    joinStatus?: JoinStatus;
}

export interface AccessAdminsResponseDTO {
    id : string;
    contact: string;
    email: string;
    name: string;
    joinStatus: JoinStatus;
    adminOf: Apartment[];
    hasNext: boolean;
}
