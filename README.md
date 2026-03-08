# nb04-Weliv
해당 프로젝트는 관리자들이 거주민 정보를 관리할 수 있는 웹어플리케이션입니다.

# 역할

- 관리자 인증 시스템 기반 거주민 정보 CRUD API 구현
- 아파트 CRUD 구현
- 슈펴관리자 인증 시스템 기반 관리자 정보 CRUD 구현
- 테스트코드 작성

## - features

- 관리자 인증 및 권한 관리
- 거주민 정보 관리 (CRUD)
- 아파트 정보 관리
- 관리자 계정 관리 (Super Admin)
- 파일 업로드 기능 (AWS S3)

## - 기술
- backend 
    * docker
    * aws S3, ec2
    * TypeScript
    * multer 

- Database
    * prisma ORM


### - 배운점 / 부족했던점 
1. 타 팀원과의 개발환경 불일치 <Prisma version || type script version> -> docker container를 통해 개발환경 획일화.

2. AWS 를 통해 사용자 개인 정보를 안전하게 업로드및 관리.

3. 테스트 코드 작성으로 코드의 안정성 향상
