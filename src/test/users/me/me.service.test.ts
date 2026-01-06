describe("me.service", () => {
  // TODO: 테스트코드 짜기
  describe("change password", () => {
    describe("failed case", () => {
      it.todo(
        "해쉬화된 현재 비밀번호가 db상에 등록된 비밀번호와 다른 경우 400에러 던지기"
      );
      it.todo("새 비밀번호가 이전 비밀번호와 같은 경우 400 에러 던지기");
    });
    it.todo("비밀번호 수정 성공시 204 반환");
  });
  describe("patch profile", () => {
    describe("요청된 파일이 있는 경우", () => {
      it.todo("이전 프로필 사진이 없었던 경우 바로 업로드");
      it.todo(
        "직전의 프로필 사진이 있는 경우 이전 프로필 사진을 지우고(DB), 새로운 이미지 업로드 "
      );
    });
  });
});
