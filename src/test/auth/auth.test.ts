describe("../../services/auth.service", () => {
  //auth login API
  describe("login API", () => {//TODO: auth 관련 test code 작성
    describe("fail cases", () => {
      it.todo("해당 유저의 아이디가 db 상에 존재 하지 않는 경우 400 에러 뱉기");
      it.todo(
        "해당 유저의 비밀번호가 db 상에 존재 하는 비밀번호와 다른 경우 400 에러 뱉기"
      );
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
