import { jest, describe, it, expect } from "@jest/globals";
import { HttpError } from "../../lib/middleware/error.middleware/httpError.js";
import { Controller } from "../../features/auth/auth.controller.js";
import { Service } from "../../features/auth/auth.services.js";
import * as tokenUtil from "../../lib/tokens.js";
describe("../../services/auth.service", () => {
  //auth login API
  describe("login API", () => {
    //TODO: auth 관련 test code 작성
    let controller: Controller;
    let service: Service;
    let req: any;
    let res: any;
    let next: any;
    beforeEach(() => {
      res = {
        status: jest.fn(),
        end: jest.fn(),
      };
      req = {
        body: {
          username: "juno11",
          password: "12345678",
        },
        token: {},
      };
      next = jest.fn();
      service = new Service();
      controller = new Controller(service);
      jest.clearAllMocks();
    });
    describe("fail cases", () => {
      it("인증 되지 않는 유저인경우 -> 401", async () => {
        // given
        req.body = {
          username: "juno111",
          password: "12345678",
        };
        // when
        await controller.loginHandler(req, res, next);
        // then
        jest.spyOn(service, "login").mockImplementation(async () => {
          throw new HttpError(
            400,
            "잘못된 요청(필수사항 누락 또는 잘못된 입력값)입니다."
          );
        });

        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 400,
            message: "잘못된 요청(필수사항 누락 또는 잘못된 입력값)입니다.",
          })
        );
      });
      it("알수없는 에러 인경우 -> 500", async () => {
        // given
        req.body = {
          username: "juno11",
          password: "12345678",
        };
        jest.spyOn(service, "login").mockImplementation(async () => {
          throw new HttpError(500, "알 수 없는 에러 입니다.");
        });

        // when then
        await controller.loginHandler(req, res, next);
        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 500,
            message: "알 수 없는 에러 입니다.",
          })
        );
      });
      it("토큰 생성 실패 => 500", async () => {
        //1️⃣ given
        req.body = {
          username: "juno111",
          password: "12345678",
        };
        jest.spyOn(service, "login").mockResolvedValue(req.body);
        jest.spyOn(tokenUtil, "generateToken").mockImplementation(() => {
          throw new HttpError(500, "알 수 없는 에러 입니다.");
        });

        //2️⃣ when
        await controller.loginHandler(req, res, next);

        //3️⃣ then
        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 500,
            message: "알 수 없는 에러 입니다.",
          })
        );
      });
    });

    it("로그인 성공시 204", async () => {
      //1️⃣ given
      req.body = {
        username: "juno111",
        password: "12345678",
      };

      jest.spyOn(service, "login").mockResolvedValue({
        id: "user-1",
        username: "juno111",
        email: "test@test.com",
        contact: "01011112222",
        avatar: null,
        isActive: true,
        role: "ADMIN",
      });
      //2️⃣ when
      await controller.loginHandler(req, res, next);
      //3️⃣ then
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled()
    });
  });

  //auth refreshToken Handler API
  describe("refreshToken API", () => {
    it.todo(
      "알수 없는 에러인 경우 => 500" // async() => {
      //1️⃣ given
      //2️⃣ when
      //3️⃣ then
      //}
    );
    it.todo("refeshToken이 db상에 존재 하지 않는 경우 401 뱉기");
  });
  //auth logOut Handler API
  describe("logOut API", () => {
    it.todo(
      "알수 없는 에러인 경우 => 500" // async() => {
      //1️⃣ given
      //2️⃣ when
      //3️⃣ then
      //}
    );
    it.todo(
      "로그아웃 성공 => 204" // async() => {
      //1️⃣ given
      //2️⃣ when
      //3️⃣ then
      //}
    );
  });
});
