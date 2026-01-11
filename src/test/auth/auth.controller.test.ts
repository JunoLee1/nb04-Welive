import { HttpError } from "lib/middleware/error.middleware/httpError.js";
import { Controller }from "../../features/auth/auth.controller.js"
import { Service }from "../../features/auth/auth.services.js"
describe("../../services/auth.service", () => {
  //auth login API
  describe("login API", () => {//TODO: auth 관련 test code 작성
    let controller : Controller
    let service: Service
    beforeEach(() => {
        service = new Service()
        controller = new Controller(service)
        jest.clearAllMocks()
    })
    describe("fail cases", () => {
      it("알수없는 에러 인경우 -> 500", async () => {
        jest.spyOn(service,"login"),mockImplementataion(() =>{
            return new HttpError(500,"알 수 없는 에러 입니다.")
        })
        
      });
    });
    it.todo("로그인 성공시 204");
  });

  //auth refreshToken Handler API
  describe("refreshToken API", () => {
    it.todo("refeshToken이 db상에 존재 하지 않는 경우 401 뱉기"); 
  });
  //auth logOut Handler API
  describe("logOut API", () => {
    it.todo("로그아웃 성공시 204");
  });
});
