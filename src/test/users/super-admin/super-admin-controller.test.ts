import { jest, describe, it, expect } from "@jest/globals";
import { Controller } from "../../../features/user/super-admins/super-admin.controller.js";
import upload from "../../../lib/middleware/upload.js";
import { Service } from "../../../features/user/super-admins/super-admin.service.js";
import { Repository } from "../../../features/user/super-admins/super-admin.repository.js";
import { HttpError } from "../../../lib/middleware/error.middleware/httpError.js";

jest.mock("../../../features/user/super-admins/super-admin.repository.js");
jest.mock("../../../features/user/super-admins/super-admin.service.js");

describe("super.admin.controller", () => {
  describe("register test", () => {
    let controller: Controller;
    let service: jest.Mocked<Service>;
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
      req = {
        body: {
          email: "test@test.com",
          password: "testpassword",
          name: "testname",
          username: "testusername",
          avatar: null,
          contact: "01012345678",
        },
        file: null,
      };
      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
        end: jest.fn(),
      };
      next = jest.fn();

      service = {
        repo: {} as any,
        signUpHandler: jest.fn(),
      } as unknown as jest.Mocked<Service>;

      controller = new Controller(service);
    });
    describe("fail cases", () => {
      it("서버에러 에러 던지기", async () => {
        //1️⃣ given
        req.body = {
          email: "test@test.com",
          password: "testpassword",
          name: "testname",
          username: "testusername",
          avatar: null,
          contact: "01012345678",
        };

        jest.spyOn(service, "signUpHandler").mockImplementation(async () => {
          throw new HttpError(500, "알 수 없는 에러 입니다.");
        });
        //2️⃣ when
        await controller.signUpHandler(req, res, next);
        console.log("is spy:", service.signUpHandler);
        //3️⃣ then
        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 500,
            message: "알 수 없는 에러 입니다.",
          })
        );
      });
      //it("신규 유저가 이전에 회원가입을 한적이 있다면 에러 던지기")

      it("사진 타입이 올바르지 못한 경우 에러 던지기", async () => {
        //1️⃣ given
        req.body = {
          email: "test@test.com",
          password: "testpassword",
          name: "testname",
          username: "testusername",
          avatar: null,
          contact: "01012345678",
        };
        req.file = {
          originalname: "example.html",
          mimetype: "text/html",
          buffer: Buffer.from(""),
        };

        //2️⃣ when
        await controller.signUpHandler(req, res, next);
        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 400,
            message: "잘못된 요청입니다",
          })
        );
      });
      describe("성공 케이스", () => {
        describe("파일 업로드 관련", () => {
          beforeEach(() => {
            req.body = {
              email: "test@test.com",
              password: "testpassword",
              name: "testname",
              username: "testusername",
              avatar: null,
              contact: "01012345678",
            };
            req.file = {
              originalname: "example.png",
              mimetype: "image/png",
              buffer: Buffer.from(""),
            };
          });
          it("사진 업로드 요청 값 있으면 avatar가 파일이름으로 저장됨", async () => {
            //1️⃣ given
            req.file = {
              originalname: "example.png",
              mimetype: "image/png",
              buffer: Buffer.from(""),
            };
            req.body = {
              email: "test@test.com",
              password: "testpassword",
              name: "testname",
              username: "testusername",
              avatar: req.file.originalname,
              contact: "01012345678",
            };
        
            //2️⃣ when
            await controller.signUpHandler(req, res, next);
            //3️⃣ then
            expect(service.signUpHandler).toHaveBeenCalledWith(
              expect.objectContaining({
                email: "test@test.com",
                password: "testpassword",
                name: "testname",
                username: "testusername",
                avatar: "example.png",
                contact: "01012345678",
              })
            );
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.end).toHaveBeenCalledWith();
          });
          it(
            "사진 업로드 요청 값 없으면 avatar가 null로 저장됨", 
            async() => {
            //1️⃣ given
            req.file = null;
            //2️⃣ when
            await controller.signUpHandler(req, res, next);
            //3️⃣ then
            expect(service.signUpHandler).toHaveBeenCalledWith(
              expect.objectContaining({
                email: "test@test.com",
                password: "testpassword",
                name: "testname",
                username: "testusername",
                avatar: null,
                contact: "01012345678",
              })
            );
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.end).toHaveBeenCalledWith();
            }
          );
        });
        beforeEach(() => {
          req.body = {
            email: "test@test.com",
            password: "testpassword",
            name: "testname",
            username: "testusername",
            avatar: null,
            contact: "01012345678",
          };
          req.file = {
            originalname: "example.png",
            mimetype: "image/png",
            buffer: Buffer.from(""),
          };
        });
        it.todo(
          "슈퍼 관리자 생성 성공시 204 응답 " //, async() => {
          //1️⃣ given
          //2️⃣ when
          //3️⃣ then
          //}
        );
      });
    });
  });
});
