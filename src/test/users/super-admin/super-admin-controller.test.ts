import { jest, describe, it, expect } from "@jest/globals";
describe("super.admin.service", () => {
  describe("register test", () => {
    describe("fail cases", () => {
      
      beforeEach(() => {})
      it.todo(
        "서버에러 => 500" //, async() => {
        //1️⃣ given
        //2️⃣ when
        //3️⃣ then
        //}
      );
      //it("신규 유저가 이전에 회원가입을 한적이 있다면 400에러")
    });
    describe("요청된 프로필 사진 존재", () => {
      it.todo("사진 업로드 하기");
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
