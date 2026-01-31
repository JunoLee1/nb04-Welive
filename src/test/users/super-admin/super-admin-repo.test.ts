import { jest, describe, it, expect } from "@jest/globals";
import { Repository } from "../../../features/user/super-admins/super-admin.repository.js";
import { mockDeep, type DeepMockProxy } from "jest-mock-extended";

jest.mock("../../../lib/prisma.js", () => ({
  __esModule: true, // this fixes the default import issue
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

import {
  JoinStatus,
  Role,
  type PrismaClient,
} from "../../../../prisma/generated/client.js";

describe("super.admin.repository", () => {
  let repo: Repository;
  let prismaMock: DeepMockProxy<PrismaClient>;
  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock = mockDeep<PrismaClient>();
    repo = new Repository(prismaMock);
  });

  it("이메일로 유저 찾기", async () => {
    // ✅ Mock return value
    const fakeUser = {
      id: "1",
      email: "test@example.com",
      username: "testuser",
      contact: "01012345678",
      password: "hashedpassword",
      name: "Test User",
      role: Role.SUPER_ADMIN,
      joinStatus: JoinStatus.APPROVED,
      approvedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      avatar: null,
      hasNext: false,
    };
    prismaMock.user.findUnique.mockResolvedValue(fakeUser);

    const result = await repo.findUniqueEmail("test@example.com");

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
    expect(result).toEqual(fakeUser); // 반환값 검증
  });
  it("유저네임으로 유저 찾기", async () => {
    const fakeUser = {
      id: "2",
      email: "test@example.com",
      username: "testuser",
      contact: "01012345678",
      password: "hashedpassword",
      name: "Test User",
      role: Role.SUPER_ADMIN,
      joinStatus: JoinStatus.APPROVED,
      approvedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      avatar: null,
      hasNext: false,
    };
    prismaMock.user.findUnique.mockResolvedValue(fakeUser);

    const result = await repo.findUniqueUsername("testuser", "SUPER_ADMIN");

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { username: "testuser", role: "SUPER_ADMIN" },
    });
    expect(result).toEqual(fakeUser); // 반환값 검증
  });
  //=============================================

  it("휴대폰 번호로 유저 찾기", async () => {
    const fakeUser = {
      id: "3",
      username: "testuser",
      email: "test@example.com",
      password: "12345678",
      contact: "01012345678",
      name: "Test User",
      role: Role.SUPER_ADMIN,
      joinStatus: JoinStatus.APPROVED,
      approvedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      avatar: null,
      hasNext: false,
    };
    prismaMock.user.findUnique.mockResolvedValue(fakeUser);
    const result = await repo.findUniquePhoneNumber("01012345678");

    expect(result).toBe(fakeUser);
  });
});
describe("create 호출", () => {
  let repo: Repository;
  let prismaMock: DeepMockProxy<PrismaClient>;
  beforeEach(() => {
    prismaMock = mockDeep<PrismaClient>();
    repo = new Repository(prismaMock);
  });
  it("신규 유저 생성하기", async () => {
    //1️⃣ given
    const input = {
      email: "test@test.com",
      password: "12345678",
      contact: "01012345678",
      username: "junoLee",
      name: "test",
    };
    const mockCreateData = {
      id: "1",
      email: "test@test.com",
      password: "12345678",
      contact: "01012345678",
      username: "junoLee",
      name: "test",
      role: Role.SUPER_ADMIN,
      hasNext: false,
      joinStatus: JoinStatus.APPROVED,
      createdAt: new Date(),
      updatedAt: new Date(),
      approvedAt: new Date(),
      isActive: true,
      avatar: null,
    };
    prismaMock.user.create.mockResolvedValue(mockCreateData);
    const result = await repo.createSuperAdmin(input);

    expect(result).toMatchObject({
      email: input.email,
      username: input.username,
      name: input.name,
    });
  });
});
