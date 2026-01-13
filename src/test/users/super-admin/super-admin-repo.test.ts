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

    const result = await repo.findUniqueUsername("testuser");

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { username: "testuser" },
    });
    expect(result).toEqual(fakeUser); // 반환값 검증
  });
  it.todo("휴대폰 번호로 유저 찾기");
});
describe("create 호출", () => {
  it.todo(
    "신규 유저 생성하기" //async () => {
    //1️⃣ given
    //const mockCreateData = {
    //email: "

    //}
  );
});
