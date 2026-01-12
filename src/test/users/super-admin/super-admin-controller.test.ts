import { jest, describe, it, expect } from "@jest/globals";
import { Controller } from "../../../features/user/super-admins/super-admin.controller.js";
import { Service } from "../../../features/user/super-admins/super-admin.service.js";
import { Repository } from "../../../features/user/super-admins/super-admin.repository.js";
import { HttpError } from "../../../lib/middleware/error.middleware/httpError.js";

jest.mock("../../../features/user/super-admins/super-admin.repository.js");
jest.mock("../../../features/user/super-admins/super-admin.service.js");
jest.mock("../../../lib/middleware/upload.js", () => ({
  __esModule: true,
  default: {
    single: jest.fn(() => (req: any, res: any, next: any) => next()),
  },
}));
import upload from "../../../lib/middleware/upload.js";
describe("super.admin.service", () => {
  describe("register test", () => {
    let controller: Controller;
    let req: any;
    let res: any;
    let next: any;
    let service: jest.Mocked<Service>;
    let repository: jest.Mocked<Repository>;
    let updoad: any;
    beforeEach(() => {
      // setup code
      req = {
        body: {},
      };
      res = {
        status: jest.fn().mockReturnThis(),
        end: jest.fn(),
        json: jest.fn(),
      };
      next = jest.fn();
      // mock repository methods
      repository = new Repository() as jest.Mocked<Repository>;
      service = new Service(repository) 
      controller = new Controller(service);
      jest.clearAllMocks();
    });
    describe("fail cases", () => {
      it("서버에러 에러 던지기", async () => {
        //1️⃣ given
        jest.spyOn(service,"signUp").mockImplementation(() => {
          throw new HttpError(500, "알 수없는 에러 입니다.");
        });
        //2️⃣ when
        await controller.signUpHandler(req, res, next);
        //3️⃣ then
        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 500,
            message: "알 수 없는 에러 입니다.",
          })
        );
      });
      //it("신규 유저가 이전에 회원가입을 한적이 있다면 에러 던지기")
      describe("요청된 프로필 사진 존재", () => {
        it("사진 타입이 올바르지 못한 경우 에러 던지기", async () => {
          req.body = {
            avatar: "example.html",
          };
          await controller.signUpHandler(req, res, next);

          (upload.single as jest.Mock).mockImplementation(() => {
            throw new HttpError(400, "잘못된 요청입니다");
          });
          expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
              status: 400,
            })
          );
        });

        it.todo("사진 업로드 하기");
      });
    });

    describe("요청된 프사 사진이 없는 경우 null", () => {
      it.todo("null 로 db 보내기");
    });
    it.todo(
      "슈퍼 관리자 생성 성공 => 204" //, async() => {
      //1️⃣ given
      //2️⃣ when
      //3️⃣ then
      //}
    );
  });
});
