import { jest, describe, it, expect } from "@jest/globals";
import { Controller } from "../../../features/user/admins/admins.controller.js";
import { Controller as AdminIdController } from "../../../features/user/admins/id/admin-id.controller.js";
import { Service } from "../../../features/user/admins/admins.service.js";
import { Service as AdminIdService } from "../../../features/user/admins/id/admin-id.service.js";
import { accessTokenStrategy } from "../../../lib/passport/jwt-strategy.js";
import { HttpError } from "../../../lib/middleware/error.middleware/httpError.js";
import { Repository as adminIdRepo } from "../../../features/user/admins/id/admin-id.repo.js";
import { admins } from "./admins.data.js";
type FindUniqueKey = "id" | "email" | "username" | "contact";

jest.mock("../../../features/user/admins/admins.service.js");
jest.mock("../../../features/user/admins/id/admin-id.service.js");
jest.mock("../../../features/user/admins/id/admin-id.repo.js", () => ({
  findOne: jest.fn(),
}));
jest.mock("../../../lib/passport/jwt-strategy.js", () => ({
  accessTokenStrategy: {
    get: jest.fn(),
    authenticate: jest.fn(),
  },
}));

interface JWTpayload {
  sub: string;
  email: string;
  role: "ADMIN" | "USER" | "SUPER_ADMIN";
}

describe("관리자 컨트롤러 테스트", () => {
  describe("관리자 생성 컨트롤러", () => {
    let controller: Controller;
    let serviceMock: jest.Mocked<Service>;
    let req: any;
    let res: any;
    let next: any;
    beforeEach(() => {
      req = {
        body: {
          name: "test",
          contact: "01011112222",
          username: "testuser",
          password: "1234",
          email: "test@test.com",
          avatar: null,
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
        end: jest.fn(),
      };
      (next = jest.fn()),
        (serviceMock = {
          repo: {} as any,
          accessList: jest.fn(),
          registerAdmin: jest.fn(),
          modifyStatus: jest.fn(),
          deleteRejectedAdmins: jest.fn(),
        });
      controller = new Controller(serviceMock);
    });
    it("서비스로부터 서비스 값을 반환 성공 -> 204", async () => {
      jest.spyOn(serviceMock, "registerAdmin").mockResolvedValue(undefined);
      await controller.register(req, res, next);

      expect(serviceMock.registerAdmin).toHaveBeenCalledTimes(1);
      expect(serviceMock.registerAdmin).toHaveBeenCalledWith(req.body);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalledWith();
    });
    it("서비스로부터 서비스 값을 반환 실패 -> 500", async () => {
      const error = new Error("서버 오류");
      jest.spyOn(serviceMock, "registerAdmin").mockRejectedValue(error);

      await controller.register(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.end).not.toHaveBeenCalledWith();
    });
  });
  //=================================================================
  describe("관리자 목록 조회 컨트롤러", () => {
    let controller: Controller;
    let serviceMock: jest.Mocked<Service>;
    let req: any;
    let res: any;
    let next: any;
    beforeEach(() => {
      req = {
        query: {
          page: 1,
          limit: 10,
          searchKeyword: "",
          joinStatus: "PENDING",
        },
        user: undefined,
      };
      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
        end: jest.fn(),
      };
      next = jest.fn();

      (serviceMock = {
        repo: {} as any,
        accessList: jest.fn(),
        registerAdmin: jest.fn(),
        modifyStatus: jest.fn(),
        deleteRejectedAdmins: jest.fn(),
      }),
        (controller = new Controller(serviceMock));
      jest.clearAllMocks();
    });
    describe("실패 케이스", () => {
      // 입구 컷
      it("인증 실패 -> 401", async () => {
        const mockPayload: JWTpayload = {
          sub: "user-id-123",
          role: "ADMIN",
          email: "test@test.com",
        };
        const mockJwtVerify: jest.Mock = jest.fn((mockPayload, done: any) => {
          done(new HttpError(401, "인증 실패"), null);
        });

        jest
          .spyOn(accessTokenStrategy, "authenticate")
          .mockImplementation(mockJwtVerify);
        await controller.accessList(req, res, next);

        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 401, // HttpError의 속성명 확인 필요
            message: "인증과 관련된 오류입니다.",
          })
        );

        expect(res.status).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalledWith();
      });
      // 인증만 통과
      it("권한 없음 -> 403", async () => {
        req.user = {
          sub: "user-id-123",
          role: "ADMIN",
          email: "test@test.com",
        };

        await controller.accessList(req, res, next);

        expect(req.user.role).not.toBe("SUPER_ADMIN");

        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 403, // HttpError의 속성명 확인 필요
            message: "권한과 관련된 오류입니다.",
          })
        );
        expect(res.status).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalledWith();
      });
      // 인증 && 권한  통과
      it("서비스로부터 서비스 값을 반환 실패 -> 500", async () => {
        req.user = {
          sub: "user-id-123",
          role: "SUPER_ADMIN",
          email: "test@test.com",
        };

        jest.spyOn(serviceMock, "accessList").mockImplementation(() => {
          throw new HttpError(500, "알 수 없는 에러 입니다.");
        });
        await controller.accessList(req, res, next);

        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 500, // HttpError 속성명 확인
            message: "알 수 없는 에러 입니다.",
          })
        );
        expect(res.status).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalledWith();
      });
    });
    describe("성공", () => {
      it("서비스로부터 서비스 값을 반환 성공 -> 200", async () => {
        req.user = {
          sub: "user-id-123",
          role: "SUPER_ADMIN",
          email: "test@test.com",
        };
        jest.spyOn(serviceMock, "accessList").mockResolvedValue({
          data: [],
          totalCount: 0,
          hasNext: false,
        });
        await controller.accessList(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          data: {
            data: [],
            totalCount: 0,
            hasNext: false,
          },
        });
      });
    });
  });

  //=================================================================
  describe("관리자 정보 수정 컨트롤러", () => {
    //preps
    let controller!: AdminIdController;
    let adminIdServiceMock!: jest.Mocked<AdminIdService>;
    let repo: jest.Mocked<adminIdRepo>;
    let res: any;
    let req: any;
    let error: any;
    let next!: jest.Mock;
    beforeEach(() => {
      adminIdServiceMock = {
        repo: {} as any,
        modifyUserInfo: jest.fn(),
      } as unknown as jest.Mocked<AdminIdService>;

      controller = new AdminIdController(adminIdServiceMock);
      repo = {
        findOne: jest.fn(),
      } as unknown as jest.Mocked<adminIdRepo>;

      res = {
        status: jest.fn().mockReturnThis(),
        end: jest.fn(),
      };

      req = {
        body: {
          id: "user-id-123",
          name: "test",
          contact: "01011112222",
          username: "testuser",
          password: "1234",
          email: "test@test.com",
          avatar: null,
          role: "SUPER_ADMIN",
          hasNext: false,
          joinStatus: "APPROVED",
          createdAt: new Date("2023-01-21"),
          updatedAt: new Date("2023-01-01"),
          approvedAt: null,
          isActive: false,
          adminOf: [],
        },
        user: {
          id: "user-id-123",
          name: "test",
          contact: "01011112222",
          username: "testuser",
          password: "12341245",
          email: "test@test.com",
          avatar: null,
          role: "SUPER_ADMIN",
          joinStatus: "APPROVED",
          createdAt: new Date("2023-01-21"),
          updatedAt: new Date("2023-01-01"),
          adminOf: [],
        },
      };
      error = {
        status: jest.fn(),
        message: jest.fn(),
      };
      next = jest.fn();
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });
    describe("실패 케이스", () => {
      it("인증 실패 -> 401", async () => {
        // 1️⃣ GIVEN
        // - create mocking data
        req.user = undefined;
        
        // 2️⃣ WHEN
        // - call actaul service
        await controller.modifyUserInfo(req, res, next);
        // 3️⃣ THEN
        // - check statusCode and message

        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 401, // HttpError 속성명 확인
            message: "인증과 관련된 오류입니다",
          })
        );
        expect(res.status).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalledWith();
      });

      // - insert mocking data as expected return value
      it("권한 없음 -> 403", async () => {
        req.user = {
          id: "user-id-123",
          role: "ADMIN",
          email: "test@test.com",
        };
        await controller.modifyUserInfo(req, res, next);
        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 403,
            message: "권한과 관련된 오류입니다.",
          })
        );
        // - check statusCode and message
      });

      it("서비스로부터 서비스 값을 반환 실패시 -> 500", async () => {
        //TODO: after all failed mocking test, success test
        // 1️⃣ GIVEN
        // - create mocking data
        console.log(1);
        req.user = {
          id: "exist-2",
          role: "SUPER_ADMIN",
        };
        // - insert mocking data as expected return value
        console.log(12);
        console.log("userTest:", req.user);
        jest
          .spyOn(repo, "findOne")
          .mockResolvedValue(admins.approvedAdmin);
        jest
          .spyOn(adminIdServiceMock, "modifyUserInfo")
          .mockRejectedValue(new HttpError(500, "알 수없는 에러 입니다."));

        // 2️⃣ WHEN
        // - call actaul service
        await controller.modifyUserInfo(req, res, next);

        // 3️⃣ THEN
        // - check statusCode and message
        expect(res.status).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalledWith();
      });
    });

    it("서비스로부터 서비스 값을 반환 성공 -> 204", async () => {
      //TODO: after all failed mocking test, success test
      // 1️⃣ GIVEN
      // - create mocking data
      req.user = {
        id: "user-id-123",
        role:"SUPER_ADMIN"
      };
      // - insert mocking data as expected return value
     
      jest.spyOn(adminIdServiceMock, "modifyUserInfo").mockResolvedValue({
        id: req.user.id,
        name: req.user.name ?? req.body.name,
        contact: req.user.contact ?? req.body.contact,
        username: req.user.username ?? req.body.username,
        email: req.user.email ?? req.body.email,
        avatar: req.user.avatar ?? req.body.avatar,
        role: req.user.role ?? req.body.role,
        isActive: true,
        approvedAt: null,
        adminOf: req.user.adminOf ?? [],
      });
      // 2️⃣ WHEN
      // - call actaul service
      await controller.modifyUserInfo(req, res, next);
      // 3️⃣ THEN
      // - check statusCode and message
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });

  //=================================================================
  describe("관리자 가입 상태 수정 컨트롤러", () => {
    // preps
    describe("실패 케이스", () => {
      it.todo(
        "인증 실패 -> 401"
        //TODO: authorization test
        // 1️⃣ GIVEN
        // - create mocking data
        // - insert mocking data as expected return value
        // 2️⃣ WHEN
        // - call actaul service
        // 3️⃣ THEN
        // - check statusCode and message
      );
      it.todo(
        "권한 없음 -> 403"
        //TODO: after authorization test, controller test
        // 1️⃣ GIVEN
        // - create mocking data
        // - insert mocking data as expected return value
        // 2️⃣ WHEN
        // - call actaul service
        // 3️⃣ THEN
        // - check statusCode and message
      );
      it.todo(
        "서비스로부터 서비스 값을 반환 실패 -> 500"
        //TODO: after passing all the mocking test,
        // 1️⃣ GIVEN
        // - create mocking data
        // - insert mocking data as expected return value
        // 2️⃣ WHEN
        // - call actaul service
        // 3️⃣ THEN
        // - check statusCode and message
      );
    });
    it.todo(
      "서비스로부터 서비스 값을 반환 성공 -> 204"
      //TODO: after all failed mocking test, success test
      // 1️⃣ GIVEN
      // - create mocking data
      // - insert mocking data as expected return value
      // 2️⃣ WHEN
      // - call actaul service
      // 3️⃣ THEN
      // - check statusCode emty
    );
  });

  //=================================================================
  describe("거절된 관리자 일괄 삭제 컨트럴러", () => {
    // preps
    describe("실패 케이스", () => {
      it.todo(
        "인증 실패 -> 401"
        //TODO: authorization test
        // 1️⃣ GIVEN
        // - create mocking data
        // - insert mocking data as expected return value
        // 2️⃣ WHEN
        // - call actaul service
        // 3️⃣ THEN
        // - check statusCode and message
      );
      it.todo(
        "권한 없음 -> 403"
        //TODO: after authorization test, controller test
        // 1️⃣ GIVEN
        // - create mocking data
        // - insert mocking data as expected return value
        // 2️⃣ WHEN
        // - call actaul service
        // 3️⃣ THEN
        // - check statusCode and message
      );
      it.todo(
        "서비스로부터 서비스 값을 반환 실패 -> 500"
        //TODO: after passing all the mocking test,
        // 1️⃣ GIVEN
        // - create mocking data
        // - insert mocking data as expected return value
        // 2️⃣ WHEN
        // - call actaul service
        // 3️⃣ THEN
        // - check statusCode and message
      );
    });
    it.todo(
      "서비스로부터 서비스 값을 반환 성공 -> 204"
      //TODO: after all failed mocking test, success test
      // 1️⃣ GIVEN
      // - create mocking data
      // - insert mocking data as expected return value
      // 2️⃣ WHEN
      // - call actaul service
      // 3️⃣ THEN
      // - check statusCode emty
    );
  });
});
