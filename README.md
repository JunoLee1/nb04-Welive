# nb04-Welive


## 프로젝트 개요: 
- 슈퍼 관리자로 아파트 관리자 관리
- 관리자 권한으로 주민과 아파트 공지 관리


## 내가 맡은 역할: 
    1. 슈퍼 관리자 CRUD
        -  슈퍼관리자의 권한으로 관리자 회원가입 요청시 승인/ 거절 상태 변경
        -  
        -  
    2. 관리자 CRUD
        - 관리자의 권한으로 주민 승인및 거절
    
    3. 주민
        - 
## 내가 겪었던 문제점

1. "users/admins/:id/join-status"에서 컨트롤러 까진 진입이 되었으나 params.id가 undefined 나옴..
-> 자식 라우터에 쓸경우 mergeParams 속성 쓰기

2. Front End와 URL 이 맞지 않아서 오류
frontEnd 에서 Http Url로 user/admin/join-status로 쓰여져 있었으나 BE 에서  user/admin/joinStatus로 되어져 있었음 -> FE의 URL로 맞춰줌으로 해결

3. 슈퍼관리자로 로그인후 괸리자 가입요청 승인을 했을때 승인 실패
 -> adminOf의 역할을 명확히 하고, 

4. 슈퍼 관리자의 계정으로 로그인후 해당 관리자들 관리 