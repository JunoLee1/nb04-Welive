import multer, { type FileFilterCallback } from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 업로드된 파일이 저장될 디렉토리 (미리 생성되어 있어야 함)
    // cb는 callback 이라는 뜻...
    cb(null, "uploads/"); // 'uploads/' 디렉토리에 저장
  },
  filename: function ( req, file, cb ) {
    // 저장될 파일 이름 설정
    // 원본 파일명에서 확장자를 추출하여 고유한 이름으로 저장 (중복 방지)
    const ext = path.extname(file.originalname); // .jpg, .png 등 확장자 추출
    cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    // 예: my_image.jpg -> my_image1678888888888.jpg
  },
});

const upload = multer({
  storage: storage, // 위에서 정의한 저장소 설정 적용
  limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기 제한 (예: 5MB)
  fileFilter: ( req, file, cb ) => {
    // 파일 필터링 (선택 사항)
    const allowedMimes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true); // 허용된 MIME 타입이면 true
    } else {
      cb(new Error("something went wrong")); // 허용되지 않으면 에러
    }
  },
});

export default upload; // 설정된 Multer 인스턴스 내보내기
