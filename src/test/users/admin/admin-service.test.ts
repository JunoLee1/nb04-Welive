import { Service } from "../../../features/user/admins/admins.service.js";
import { Repository } from "../../../features/user/admins/admins.repository.js";
import { adminInput, admins} from './admins.data.js' with { type: 'json' };
import { jest, describe, it, expect } from '@jest/globals';
import * as jwtStrategy from "../../../lib/passport/jwt-strategy.js";
import { HttpError } from "../../../lib/middleware/error.middleware/httpError.js";

interface RequestBody {
  email: string;
  password: string;
  name: string;
  username: string;
  avatar: string | null;
  contact: string;
}
describe("admin.service", () => {
  let adminRepository: jest.Mocked<Repository>;
  let service: Service;
  describe("register admin api", () => {
    beforeEach(() => {
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
         adminRepository.findByEmail.mockResolvedValue(admins.approvedAdmin)
        await expect(service.registerAdmin({
           ...adminInput.validAdmin,
          email:admins.approvedAdmin.email
        })).rejects.toThrow(
          "잘못된 요청(필수사항 누락 또는 잘못된 입력값)입니다"
        );
      });
      it("해당 유저의 아이디가 이미 db상에 존재 하는 경우 400 에러 뱉기", async () => {
        adminRepository.findByUsername.mockResolvedValue(admins.approvedAdmin);
        await expect(service.registerAdmin({
           ...adminInput.validAdmin,
          username:admins.approvedAdmin.username
        })).rejects.toThrow(
          "잘못된 요청(필수사항 누락 또는 잘못된 입력값)입니다"
        );
      });
    });
    it("회원가입 성공 시 204 반환", async () => {
      adminRepository.findByUsername.mockResolvedValue(null);
      adminRepository.findByEmail.mockResolvedValue(null);
     
      await expect(service.registerAdmin( adminInput.validAdmin)).resolves.toBeUndefined(); // send data to controller
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
    beforeEach(() => {
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
      mockInput = {}
    service = new Service(adminRepository);
    })
    describe("failed cases", () => {
      test.todo("해당 유저가 권한이 super-admin이 아닌 경우 403 에러 뱉기")
    });
    test.todo("리스트 조회 성공 시 데이터 보이기");
  });
  //-------------------------------------------
  describe("access an admin api", () => {
    describe("failed cases", () => {
      test.todo("해당 유저가 권한이 super-admin이 아닌 경우 403에러 뱉기");
    });
    test.todo("관리자 조회 성공 시 관리자 정보 반환");
  });
  //-------------------------------------------
  describe("patch admins joinStatus api", () => {
    describe("failed cases", () => {
      test.todo("해당 유저가 권한이 super-admin이 아닌 경우 403에러 뱉기");
    });
    test.todo("관리자(다건) 가입 상태변경 성공 시 204 반환");
  });
  //-------------------------------------------
  describe("patch an admin joinStatus api", () => {
    describe("failed cases", () => {
      test.todo("해당 유저가 권한이 super-admin이 아닌 경우 403에러 뱉기");
    });
    test.todo("관리자 (단건) 가입 상태 변경 성공 시 관리자 정보 리턴");
  });
  //-------------------------------------------
  describe("patch an admin info api", () => {
    describe("failed cases", () => {
      it.todo("해당 유저가 권한이 super-admin이 아닌 경우 403에러 뱉기");
    });
    it.todo("관리자 정보 수정 성공 시관리자 정보 리턴");
  });
  //-------------------------------------------
  describe("delete rejected admins", () => {
    describe("failed cases", () => {
      it.todo("해당 유저가 권한이 super-admin이 아닌 경우 403에러 뱉기");
    });
    it.todo("거절된 관리자 일괄 삭제 성공시 204 반환");
  });
});