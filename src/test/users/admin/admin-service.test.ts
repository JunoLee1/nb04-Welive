import { jest, describe, it, expect } from "@jest/globals";
import { Service } from "../../../features/user/admins/admins.service.js";
import { Repository } from "../../../features/user/admins/admins.repository.js";
import { adminInput, admins } from "./admins.data.js";
import { Service as adminIdService } from "../../../features/user/admins/id/admin-id.service.js";
import { Repository as adminIdRepo } from "../../../features/user/admins/id/admin-id.repo.js";
import * as jwtStrategy from "../../../lib/passport/jwt-strategy.js";
import { HttpError } from "../../../lib/middleware/error.middleware/httpError.js";
import { userList, approvedUserList } from "./admins.data.js";
import { Role } from "../../../../prisma/generated/enums.js";
interface RequestBody {
  email: string;
  password: string;
  name: string;
  username: string;
  avatar: string | null;
  contact: string;
}
jest.mock("../../../features/user/admins/id/admin-id.repo.js");
jest.mock("../../../features/user/admins/admins.repository.js");
describe("admin.service", () => {
  let adminRepository: jest.Mocked<Repository>;
  let service: Service;
  describe("register admin api", () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      adminRepository = {
        createAdmin: jest.fn(),
        findMany: jest.fn(),
        findByUsername: jest.fn(),
        findByEmail: jest.fn(),
        findManyByStatus: jest.fn(),
        updateMany: jest.fn(),
        count: jest.fn(),
        findById: jest.fn(),
        deleteMany: jest.fn(),
      };

      service = new Service(adminRepository);
    });
    describe("fail case", () => {
      it("해당 유저의 이메일가 이미 db상에 존재 하는 경우 400 에러 뱉기", async () => {
        adminRepository.findByEmail.mockResolvedValue(admins.approvedAdmin);
        await expect(
          service.registerAdmin({
            ...adminInput.validAdmin,
            email: admins.approvedAdmin.email,
            avatar: admins.approvedAdmin.avatar,
          })
        ).rejects.toThrow(
          "잘못된 요청(필수사항 누락 또는 잘못된 입력값)입니다"
        );
      });
      it("해당 유저의 아이디가 이미 db상에 존재 하는 경우 400 에러 뱉기", async () => {
        adminRepository.findByUsername.mockResolvedValue(admins.approvedAdmin);
        await expect(
          service.registerAdmin({
            ...adminInput.validAdmin,
            username: admins.approvedAdmin.username,
          })
        ).rejects.toThrow(
          "잘못된 요청(필수사항 누락 또는 잘못된 입력값)입니다"
        );
      });
    });
    it("회원가입 성공 시 204 반환", async () => {
      adminRepository.findByUsername.mockResolvedValue(null);
      adminRepository.findByEmail.mockResolvedValue(null);

      await expect(
        service.registerAdmin(adminInput.validAdmin)
      ).resolves.toBeUndefined(); // send data to controller
      expect(adminRepository.createAdmin).toHaveBeenCalledTimes(1);
      expect(adminRepository.createAdmin).toHaveBeenCalledWith(
        expect.objectContaining({
          email: adminInput.validAdmin.email,
          username: adminInput.validAdmin.username,
        })
      );
    });
  });

  //-------------------------------------------
  describe("access admins api", () => {
    let adminRepository: jest.Mocked<Repository>;
    let service: Service;
    let mockInput: any;
    let adminsList: any;
    beforeEach(async () => {
      jest.clearAllMocks();
      adminRepository = {
        createAdmin: jest.fn(),
        findMany: jest.fn(),
        findByUsername: jest.fn(),
        findByEmail: jest.fn(),
        findManyByStatus: jest.fn(),
        updateMany: jest.fn(),
        count: jest.fn(),
        findById: jest.fn(),
        deleteMany: jest.fn(),
      };
      adminsList = userList;
      service = new Service(adminRepository);
    });
    test("리스트 조회 성공 시 데이터와 데이터 갯수 page 랑 Limit 보이기", async () => {
      adminRepository.findMany.mockResolvedValue(adminsList);
      adminRepository.count.mockResolvedValue(3);

      const data = await service.accessList({
        pageNumber: 1,
        limitNumber: 10,
        keyword: "",
        joinStatus: "PENDING",
      });
      expect(data.totalCount).toBe(3);
      expect(data.hasNext).toBe(false);
    });
  });
  //-------------------------------------------
  describe("patch an admin info api", () => {
    let repo: jest.Mocked<adminIdRepo>;
    let service: adminIdService;
    beforeEach(async () => {
      repo = {
        findOne: jest.fn(),
        modifyUserInfo: jest.fn(),
        modifyStatus: jest.fn(),
        delete: jest.fn(),
      } as unknown as jest.Mocked<adminIdRepo>;
      jest.clearAllMocks();
      // service 생성 전에 mock 설정

      repo.findOne.mockResolvedValue({
        id: "user-125",
        username: "tester",
        email: "test@test.com",
        contact: "0101111222",
        name: "test",
        password: "123",
        role: Role.ADMIN,
        avatar: null,
        joinStatus: "APPROVED",
        hasNext: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        approvedAt: null,
        isActive: true,
      });
      repo.modifyUserInfo.mockImplementation(async (id, input) => {
        return {
          id,
          name: "test",
          joinStatus: "APPROVED",
          avatar: null,
          email: input.email ?? "test@test.com",
          username: input.username ?? "tester",
          contact: input.contact ?? "0101111222",
          role: Role.ADMIN,
          password: "12341234",
          approvedAt: null,
          isActive: true,
          hasNext: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          adminOf: {
            id: "sk-01",
            name: "sk view 아파트",
            createdAt: new Date(),
            updatedAt: new Date(),
            address: "부산광역시",
            description: "sk view 아파트 102동",
            buildingNumberFrom: 101,
            buildingNumberTo: 1004,
            floorCountPerBuilding: 2,
            unitCountPerFloor: 4,
            officeNumber: "051112222",
            adminId: id,
          },
        };
      });
      service = new adminIdService(repo);
    });
    describe("failed cases", () => {
      it("해당 유저가 존재 하지 않는 경우 404", async () => {
        //1️⃣ given
        const mockUserId = {
          id: "user-125",
        };
        const mockUser = {
          username: "tester",
          avatar: null,
        };
        repo.findOne.mockResolvedValue(null);
        //2️⃣ when && 3️⃣ then
        await expect(
          service.modifyUserInfo(mockUserId.id, mockUser)
        ).rejects.toThrow("NotFound");
      });
    });
    it("관리자 정보 수정 성공 시관리자 정보 리턴", async () => {
      //1️⃣ given
      const id = "user-125";
      const mockUser = {
        username: "tester",
        email: "test@test.com",
        contact: "0101111222",
        avatar: null,
      };
      //2️⃣ when
      const result = await service.modifyUserInfo(id, mockUser);

      //3️⃣ then
      expect(result.id).toBe(id);
      expect(result.username).toBe(mockUser.username);
      expect(result.adminOf?.name).toBe("sk view 아파트");
    });
  });
  //-------------------------------------------
  describe("patch admin joinStatus api", () => {
    let repo: jest.Mocked<adminIdRepo>;
    let service: adminIdService;
    let mockUser: any;
    beforeEach(() => {
      repo = {
        findOne: jest.fn(),
        modifyUserInfo: jest.fn(),
        modifyStatus: jest.fn(),
        delete: jest.fn(),
      };
      mockUser = admins.approvedAdmin;
      service = new adminIdService(repo);
      jest.clearAllMocks();
    });
    test("해당 유저가 존재하지 않는 경우 -> 404", async () => {
      //1️⃣ given
      repo.findOne.mockResolvedValue(null);
      //2️⃣ when 3️⃣ then
      await expect(
        service.modifyStatus("not-exist-id", "APPROVED")
      ).rejects.toThrow("존재 하지 않는 유저 입니다");
    });

    test("관리자(단건) 가입 상태변경 성공시 해당 ", async () => {
      //1️⃣ given
      repo.findOne.mockResolvedValue(mockUser);
      repo.modifyStatus.mockResolvedValue(mockUser);

      //2️⃣ when
      await service.modifyStatus(mockUser.id, "APPROVED");
      //3️⃣ then
      expect(mockUser.joinStatus).toBe("APPROVED");
    });
  });
  //-------------------------------------------
  describe("patch admins joinStatus api", () => {
    let repo: jest.Mocked<Repository>;
    let service: Service;
    let joinStatus: any;
    let adminList: any[];
    beforeEach(() => {
      (repo = {
        createAdmin: jest.fn(),
        findMany: jest.fn(),
        findByUsername: jest.fn(),
        findByEmail: jest.fn(),
        findManyByStatus: jest.fn(),
        updateMany: jest.fn(),
        count: jest.fn(),
        findById: jest.fn(),
        deleteMany: jest.fn(),
      }),
        (service = new Service(repo));
      adminList = approvedUserList;
    });
    it("hasNext = true", async () => {
      //1️⃣ given
      repo.findManyByStatus.mockResolvedValue(adminList); // length = 3
      repo.updateMany.mockResolvedValue({ count: 3 });

      const pagenation = { pageNumber: 1, limitNumber: 2 }; // 1*2 < 3

      //2️⃣ when 3️⃣ then
      const result = await service.modifyStatus(pagenation, "APPROVED");

      expect(result.hasNext).toBe(true);
    });

    it("hasNext = false", async () => {
      //1️⃣ given
      repo.findManyByStatus.mockResolvedValue(adminList)
      repo.updateMany.mockResolvedValue({ count: 3 });
  
      const pagenation = {pageNumber :1,limitNumber : 10};

      //2️⃣ when
      const result = await service.modifyStatus(pagenation, "APPROVED");
      
       //3️⃣ then
      expect(result.hasNext).toBe(false)
    });

    it("관리자 (다건) 가입 상태 변경 성공 시 관리자들 정보 리턴", async () => {
      //1️⃣ given
      repo.findManyByStatus.mockResolvedValue(adminList);
      repo.updateMany.mockResolvedValue({ count: 3 });
      repo.count.mockResolvedValue(3);
      //repo.findMany.mockResolvedValue(adminsList);
      const pagenation = { limitNumber: 10, pageNumber: 1 };

      //2️⃣ when 3️⃣ then
      const result = await service.modifyStatus(pagenation, "APPROVED");

      expect(result).toEqual({
        data: adminList,
        hasNext: false,
        limit: pagenation.limitNumber,
        page: pagenation.pageNumber,
        totalCount: 3,
      });
    });
  });
  //-------------------------------------------
  describe("delete rejected admins", () => {
    it.todo(
      "거절된 관리자 일괄 삭제 성공시 빈 값 반환"
      //async() => {
      //1️⃣ given
      //2️⃣ when
      //3️⃣ then
      //}
    );
  });
});
