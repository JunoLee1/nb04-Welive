import { jest, describe, it, expect } from "@jest/globals";
import { Controller } from "../../../features/user/admins/admins.controller.js";
import { Service } from "../../../features/user/admins/admins.service.js";
import { Repository } from "../../../features/user/admins/admins.repository.js";
import { accessTokenStrategy } from "../../../lib/passport/jwt-strategy.js";
import * as jwtModule from "../../../lib/passport/jwt-strategy.js";
import { HttpError } from "../../../lib/middleware/error.middleware/httpError.js";
import type { VerifiedCallback } from "passport-jwt";
jest.mock("../../../features/user/admins/admins.service.js");
jest.mock("../../../lib/passport/jwt-strategy.js", () => ({
  accessTokenStrategy: {
    get: jest.fn(),
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
    let service: Service;
    let repo: Repository;
    let req: any;
    let res: any;
    let next: any;
    interface ErrorTypes {
      status: 500 | 400 | 401 | 403;
      message: "인증과 관련된 에러 입니다" | "권한과 관련된 에러 입니다";
    }

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
      repo = new Repository();
      service = new Service(repo);
      controller = new Controller(service);
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

        jest.spyOn(service, "accessList").mockImplementation(() => {
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
        jest.spyOn(service, "accessList").mockResolvedValue({
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
    describe("실패 케이스", () => {
      it.todo("인증 실패 -> 401");
      it.todo("권한 없음 -> 403");
      it.todo("서비스로부터 서비스 값을 반환 실패 -> 500");
    });
    it.todo("서비스로부터 서비스 값을 반환 성공 -> 204");
  });

  //=================================================================
  describe("관리자 가입 상태 수정 컨트롤러", () => {
    describe("실패 케이스", () => {
      it.todo("인증 실패 -> 401");
      it.todo("권한 없음 -> 403");
      it.todo("서비스로부터 서비스 값을 반환 실패 -> 500");
    });
    it.todo("서비스로부터 서비스 값을 반환 성공 -> 204");
  });

  //=================================================================
  describe("거절된 관리자 일괄 삭제 컨트럴러", () => {
    describe("실패 케이스", () => {
      it.todo("인증 실패 -> 401");
      it.todo("권한 없음 -> 403");
      it.todo("서비스로부터 서비스 값을 반환 실패 -> 500");
    });
    it.todo("서비스로부터 서비스 값을 반환 성공 -> 204");
  });
});
