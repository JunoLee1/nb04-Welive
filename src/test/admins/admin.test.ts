describe("admin.service", () => {
  describe("register admin api", () => {
    describe("fail case", () => {
      it("해당 유저의 이메일이 이미 db상에 존재 하는 경우 400 에러 뱉기");
      it("해당 유저의 아이디가 이미 db상에 존재 하는 경우 400 에러 뱉기");
      it("해당 유저의 휴대폰 번호가 이미 db상에 존재 하는 경우 400 에러 뱉기");
    });
    it("회원가입 성공 시 204 반환");
  });
  //-------------------------------------------
  describe("access admins api", () => {
    describe("failed cases", () => {
      it("해당 유저가 인증된 유저가 아닌 경우 401에러 뱉기");
      it("해당 유저가 권한이 super-admin이 아닌 경우 403에러 뱉기");
    });
    it("리스트 조회 성공 시 204 반환");
  });
  //-------------------------------------------
  describe("access an admin api", () => {
    describe("failed cases", () => {
      it("해당 유저가 인증된 유저가 아닌 경우 401에러 뱉기");
      it("해당 유저가 권한이 super-admin이 아닌 경우 403에러 뱉기");
    });
    it("관리자 조회 성공 시 204 반환");
  });
  //-------------------------------------------
  describe("patch admins joinStatus api", () => {
    describe("failed cases", () => {
      it("해당 유저가 인증된 유저가 아닌 경우 401에러 뱉기");
      it("해당 유저가 권한이 super-admin이 아닌 경우 403에러 뱉기");
    });
    it("관리자(다건) 가입 상태변경 성공 시 204 반환");
  });
  //-------------------------------------------
  describe("patch an admin joinStatus api", () => {
    describe("failed cases", () => {
      it("해당 유저가 인증된 유저가 아닌 경우 401에러 뱉기");
      it("해당 유저가 권한이 super-admin이 아닌 경우 403에러 뱉기");
    });
    it("관리자 (단건) 가입 상태 변경 성공 시 204 반환");
  });
  //-------------------------------------------
  describe("patch an admin info api", () => {
    describe("failed cases", () => {
      it("해당 유저가 인증된 유저가 아닌 경우 401에러 뱉기");
      it("해당 유저가 권한이 super-admin이 아닌 경우 403에러 뱉기");
    });
    it("관리자 정보 수정 성공 시 204 반환");
  });
  //-------------------------------------------
  describe("delete rejected admins", () => {
    describe("failed cases", () => {
      it("해당 유저가 인증된 유저가 아닌 경우 401에러 뱉기");
      it("해당 유저가 권한이 super-admin이 아닌 경우 403에러 뱉기");
    });
    it("거절된 관리자 일괄 삭제 성공시 204 반환");
  });
});
