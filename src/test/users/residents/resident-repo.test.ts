describe("users-residents.repo", () => {
  describe("거주민 생성", () => {
    describe("failed case", () => {
      it.todo("해당 유저의 이메일이 이미 db상에 존재 하는 경우 400 에러 뱉기");
      it.todo("해당 유저의 아이디가 이미 db상에 존재 하는 경우 400 에러 뱉기");
      it.todo("해당 유저의 휴대폰 번호가 이미 db상에 존재 하는 경우 400 에러 뱉기");
    });
    describe("success case", () => {
      it.todo("거주민 생성 성공시 204 뱉기");
    });
  });
  describe("거주민 리스트 조회", () => {
    describe("failed case", () => {
      it.todo("인증된 유저가 아닌경우 401 에러던지기");
      it.todo("관리자 권한이 아닌경우 403 에러던지기");
    });
    describe("success case", () => {
        it.todo("거주민 리스트 조회 성공시 204 뱉기");
    });
  });
  describe("거주민 조회", () => {
    describe("failed case", () => {
      it.todo("인증된 유저가 아닌경우 401 에러던지기");
      it.todo("관리자 권한이 아닌경우 403 에러던지기");
    });
    describe("success case", () => {
         it.todo("거주민 조회 성공시 204 뱉기");
    });
  });
  describe("거주민들 가입 상태 변경", () => {
    describe("failed case", () => {
      it.todo("인증된 유저가 아닌경우 401 에러던지기");
      it.todo("관리자 권한이 아닌경우 403 에러던지기");
    });
    describe("success case", () => {
        it.todo("거주민들 가입 상태 변경 성공시 204 뱉기");
    });
  });
  describe("거주민 가입 상태 변경", () => {
    describe("failed case", () => {
      it.todo("인증된 유저가 아닌경우 401 에러던지기");
      it.todo("관리자 권한이 아닌경우 403 에러던지기");
    });
    describe("success case", () => {
        it.todo("거주민들 가입 상태 변경 성공시 204 뱉기");
    });
  });
  describe("가입 거절된 거주민 일괄 삭제", () => {
    describe("failed case", () => {
      it.todo("인증된 유저가 아닌경우 401 에러던지기");
      it.todo("관리자 권한이 아닌경우 403 에러던지기");
    });
    describe("success case", () => {
        it.todo("거절된 유저 삭제 성공시 204 뱉기");
    });
  });
  describe("거주민 정보 변경", () => {
    describe("failed case", () => {
      it.todo("인증된 유저가 아닌경우 401 에러던지기");
      it.todo("관리자 권한이 아닌경우 403 에러던지기");
    });
    describe("success case", () => {
         it.todo("거주민들 정보 변경 성공시 204 뱉기");
    });
  });
});
