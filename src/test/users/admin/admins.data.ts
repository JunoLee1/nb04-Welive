import { Role } from "../../../../prisma/generated/enums.js";
import { JoinStatus } from "../../../../prisma/generated/enums.js";

export const adminInput = {
  validAdmin: {
    email: "test@test.com",
    password: "hashed1234",
    name: "juno",
    username: "juno",
    avatar: null,
    contact: "01012345678",
  },
};

export const admins = {
  approvedAdmin: {
    id: "exist-1",
    email: "test@test.com",
    name: "juno",
    username: "juno",
    contact: "01012345678",
    password: "hashed",
    role: Role.ADMIN,
    hasNext: false,
    joinStatus: JoinStatus.APPROVED,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2025-01-02"),
    approvedAt: null,
    isActive: true,
    avatar: null,
  },

  superAdmin: {
    id: "exist-2",
    email: "hana@test.com",
    name: "hana",
    username: "hana",
    contact: "01012245678",
    password: "hashed",
    role: Role.SUPER_ADMIN,
    hasNext: false,
    joinStatus: JoinStatus.APPROVED,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2025-01-01"),
    approvedAt: null,
    isActive: true,
    avatar: null,
  },

  pendingAdmin: {
    id: "exist-4",
    email: "dark@test.com",
    name: "darkness",
    username: "heidi",
    contact: "01012225678",
    password: "hashed",
    role: Role.ADMIN,
    hasNext: false,
    joinStatus: JoinStatus.PENDING,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2025-01-01"),
    approvedAt: null,
    isActive: true,
    avatar: null,
    adminOf: {
      id: "apt-1",
      name: "모라주공",
      createdAt: new Date("1990-12-01"),
      updatedAt: new Date("1999-12-01"),
      address: "부산광역시 사상구 모라동",
      description: "모라 주공 아파트 102동 입니다",
      buildingNumberFrom: 101,
      buildingNumberTo: 404,
      floorCountPerBuilding: 4,
      unitCountPerFloor: 4,
      officeNumber: "0515557777",
      adminId: "exist-4",
    },
  },

  rejectedAdmin: {
    id: "exist-8",
    email: "tofuLee@test.com",
    name: "duwon",
    username: "tofu",
    contact: "0109991678",
    password: "hashed",
    role: "ADMIN",
    hasNext: false,
    joinStatus: "REJECTED",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2025-01-01"),
    approvedAt: null,
    isActive: true,
    avatar: null,
  },
};

export const userList = [
  admins.approvedAdmin,
  admins.pendingAdmin,
  admins.rejectedAdmin,
];
