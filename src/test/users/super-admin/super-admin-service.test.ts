import { jest, describe, it, expect } from "@jest/globals";
import { Service } from "../../../features/user/super-admins/super-admin.service.js";
import { Repository } from "../../../features/user/super-admins/super-admin.repository.js";
import { superAdminData } from "./super-admin.data.js";
import { HttpError } from "../../../lib/middleware/error.middleware/httpError.js";
import type { PrismaClient } from "../../../../prisma/generated/client.js";
const prismaMock = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
};

describe("super.admin.service", () => {
  let superAdminRepository: jest.Mocked<Repository>;
  let service: Service;
  let user: typeof superAdminData;
  describe("signUpHandler", () => {
    beforeEach(() => {
      const repoInstance = new Repository(prismaMock);
      superAdminRepository = jest.mocked(repoInstance);
      service = new Service(superAdminRepository);
      user = superAdminData;
    });
    describe("failed case", () => {
      it("신규 유저의 이메일이 이미 db상에 존재하는 경우 400 에러 뱉기", async () => {
        //1️⃣ given
        console.log("mocked email:", user.email),
        superAdminRepository.findUniqueUsername.mockResolvedValue(null);
        superAdminRepository.findUniquePhoneNumber.mockResolvedValue(null);
        superAdminRepository.findUniqueEmail.mockResolvedValue({
          email: "juno@test.com",
          password: "hashedpassword",
          name: "testname",
          username: "testusername",
          avatar: null,
          contact: "01012345678",
          id: "uuid-v4-string",
          role: "SUPER_ADMIN",
          hasNext: false,
          joinStatus: "APPROVED",
          createdAt: new Date(),
          updatedAt: new Date(),
          approvedAt: null,
          isActive: true,
        });
        //2️⃣ when  3️⃣ then

        await expect(
          service.signUpHandler({
            email: "juno@test.com",
            password: "testpassword",
            name: "junoLee",
            username: "junlee",
            avatar: null,
            contact: "01012345678",
          })
        ).rejects.toThrow("잘못된 요청 입니다.");
        //3️⃣ then
        console.log(user.email);
        expect(superAdminRepository.findUniqueEmail).toHaveBeenCalledTimes(1);
      });

      it("신규 유저의 아이디가 이미 db상에 존재 하는 경우 400 에러 뱉기", async () => {
        //1️⃣ given
        superAdminRepository.findUniqueEmail.mockResolvedValue(null);
        superAdminRepository.findUniquePhoneNumber.mockResolvedValue(null);
        superAdminRepository.findUniqueUsername.mockResolvedValue({
          email: "juno@test.com",
          password: "testpassword",
          name: "junoLee",
          username: "junlee",
          avatar: null,
          contact: "01012345678",
          id: "uuid-v4-string",
          role: "SUPER_ADMIN",
          hasNext: false,
          joinStatus: "APPROVED",
          createdAt: new Date(),
          updatedAt: new Date(),
          approvedAt: null,
          isActive: true,
        });
        console.log("mocked username:", test);
        //2️⃣ when3️⃣ then
        await expect(
          service.signUpHandler({
            email: "juno11@test.com",
            password: "testpassword",
            name: "junoLee",
            username: "junolee",
            avatar: null,
            contact: "01012345678",
          })
        ).rejects.toThrow("잘못된 요청 입니다.");
        //3️⃣ then
      });
      it("신규 유저의 휴대폰 번호가 이미 db상에 존재하는 경우 400 에러 뱉기", async () => {
        //1️⃣ given
        superAdminRepository.findUniquePhoneNumber.mockResolvedValue({
          ...user,
          id: "uuid-v4-string",
          role: "SUPER_ADMIN",
          hasNext: false,
          joinStatus: "APPROVED",
          createdAt: new Date(),
          updatedAt: new Date(),
          approvedAt: null,
          isActive: true,
        });
        //2️⃣ when
        //3️⃣ then
        await expect(
          service.signUpHandler({
            email: "juno11@test.com",
            password: "testpassword",
            name: "junoLee",
            username: "testusername",
            avatar: null,
            contact: "01012345678",
          })
        ).rejects.toThrow("잘못된 요청 입니다.");
      });
      //it("신규 유저가 이전에 회원가입을 한적이 있다면 400에러")
    });
    it("회원가입 성공 시 데이터 반환 반환", async () => {
      //1️⃣ given
      superAdminRepository.findUniqueEmail.mockResolvedValue(null);
      superAdminRepository.findUniquePhoneNumber.mockResolvedValue(null);
      superAdminRepository.findUniqueUsername.mockResolvedValue(null);
      superAdminRepository.createSuperAdmin.mockResolvedValue({
        ...user,
        id: "uuid-v4-string",
        role: "SUPER_ADMIN",
        hasNext: false,
        joinStatus: "APPROVED",
        createdAt: new Date(),
        updatedAt: new Date(),
        approvedAt: null,
        isActive: true,
      });
      const result = await service.signUpHandler({
        email: "juno@test.com",
        password: "testpassword",
        name: "juno",
        username: "juno",
        avatar: null,
        contact: "01012345678",
      });
      console.log("result:", result);
      expect(result).toEqual({
        ...user,
        id: "uuid-v4-string",
        role: "SUPER_ADMIN",
        hasNext: false,
        joinStatus: "APPROVED",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        approvedAt: null,
        isActive: true,
      });
    });
  });
});
