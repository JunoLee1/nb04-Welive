import { jest, describe, it, expect } from "@jest/globals";
import { Controller } from "../../../features/user/admins/admins.controller.js";
import { Service } from "../../../features/user/admins/admins.service.js";
import { Repository } from "../../../features/user/admins/admins.repository.js";
import * as jwtStrategy from "../../../lib/passport/jwt-strategy.js";
import { HttpError } from "../../../lib/middleware/error.middleware/httpError.js";

jest.mock("../../../features/user/admins/admins.service.js");
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

        expect(next).toHaveBeenCalledWith(error)
        expect(res.status).not.toHaveBeenCalled()
        expect(res.end).not.toHaveBeenCalledWith();
    });
  });
  describe("관리자 목록 조회 컨트롤러", () => {
    describe("실패 케이스", () => {
      it.todo("인증 실패 -> 401");
      it.todo("권한 없음 -> 403");
      it.todo("서비스로부터 서비스 값을 반환 실패 -> 500");
    });
    it.todo("서비스로부터 서비스 값을 반환 성공 -> 204");
  });
  describe("관리자 정보 수정 컨트롤러", () => {
    describe("실패 케이스", () => {
      it.todo("인증 실패 -> 401");
      it.todo("권한 없음 -> 403");
      it.todo("서비스로부터 서비스 값을 반환 실패 -> 500");
    });
    it.todo("서비스로부터 서비스 값을 반환 성공 -> 204");
  });
  describe("관리자 가입 상태 수정 컨트롤러", () => {
    describe("실패 케이스", () => {
      it.todo("인증 실패 -> 401");
      it.todo("권한 없음 -> 403");
      it.todo("서비스로부터 서비스 값을 반환 실패 -> 500");
    });
    it.todo("서비스로부터 서비스 값을 반환 성공 -> 204");
  });
  describe("거절된 관리자 일괄 삭제 컨트럴러", () => {
    describe("실패 케이스", () => {
      it.todo("인증 실패 -> 401");
      it.todo("권한 없음 -> 403");
      it.todo("서비스로부터 서비스 값을 반환 실패 -> 500");
    });
    it.todo("서비스로부터 서비스 값을 반환 성공 -> 204");
  });
});
