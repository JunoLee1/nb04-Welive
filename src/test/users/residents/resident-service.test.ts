describe("users-residents.service", () => {
  describe("거주민 생성", () => {
    describe("failed case", () => {
      it.todo("해당 유저의 이메일이 이미 db상에 존재 하는 경우 400 에러 뱉기");
      it.todo("해당 유저의 아이디가 이미 db상에 존재 하는 경우 400 에러 뱉기");
      it.todo("해당 유저의 휴대폰 번호가 이미 db상에 존재 하는 경우 400 에러 뱉기");
    });
    describe("success case", () => {
      it.todo("거주민 생성 성공시 거주민 데이터");// TODO:반환값확인
    });
  });
  describe("거주민 리스트 조회", () => {
    describe("success case", () => {
        it.todo("거주민 리스트 조회 성공 -> 거주민들 정보및 총갯수 반환");
    });
  });
  describe("거주민 조회", () => {
    describe("success case", () => {
         it.todo("거주민 조회 성공시 -> 거주민 정보 반환");
    });
  });
  describe("거주민들 가입 상태 변경", () => {
    describe("success case", () => {
        it.todo("거주민들 가입 상태 변경 성공시=> 변경한 거주민들 정보 및총갯수 반환");
    });
  });
  describe("거주민 가입 상태 변경", () => {
    describe("success case", () => {
        it.todo("거주민들 가입 상태 변경 성공시 data 반환");
    });
  });
  describe("가입 거절된 거주민 일괄 삭제", () => {
    describe("success case", () => {
        it.todo("거절된 유저 삭제 성공");
    });
  });
  describe("거주민 정보 변경", () => {
    describe("success case", () => {
         it.todo("거주민들 정보 변경 성공");
    });
  });
});
