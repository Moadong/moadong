# 관리자 로그아웃 refresh token 쿠키 스펙

## 목적

관리자가 로그아웃할 때 로그인 시 발급된 refresh token이 서버 저장소와 브라우저 쿠키에서 모두 제거되어야 한다.

## 문제

로그인 응답은 `refreshToken` 이름으로 쿠키를 발급한다.
로그아웃과 토큰 재발급 요청도 같은 이름의 쿠키를 읽어야 한다.

쿠키 이름이 다르면 서버는 refresh token을 받지 못하고, 빈 토큰으로 계정을 조회해 `700-2 존재하지 않는 계정입니다.`를 반환할 수 있다.

## 대상 범위

- `POST /auth/user/login`
- `GET /auth/user/logout`
- `POST /auth/user/refresh`
- 개발자 포털 관리자 인증 흐름

## 정책

1. refresh token 쿠키 이름은 `refreshToken`으로 통일한다.
2. 로그아웃은 `refreshToken` 쿠키 값을 사용해 저장된 refresh token을 제거한다.
3. 로그아웃 성공 시 로그인 쿠키와 같은 `Path=/`, `Domain=.moadong.com`, `Secure`, `HttpOnly`, `SameSite=None` 속성으로 `refreshToken` 쿠키를 만료시킨다.
4. refresh token 쿠키가 없거나 비어 있으면 계정 조회를 하지 않고 `TOKEN_INVALID(701-1)`로 실패한다.
5. DB에 저장된 refresh token과 일치하지 않는 유효한 형식의 토큰은 기존 정책대로 `USER_NOT_EXIST(700-2)`를 반환한다.
6. 개발자 포털 로그아웃 버튼은 `/auth/user/logout`을 호출한 뒤 로컬 access token과 화면 상태를 정리한다.
7. 서버 로그아웃 요청이 실패하더라도 클라이언트의 로컬 로그인 상태는 정리한다.

## 검증 기준

1. `GET /auth/user/logout` 요청에 `refreshToken` 쿠키가 있으면 서비스에 같은 토큰 값이 전달된다.
2. 로그아웃 응답은 `refreshToken` 쿠키를 `Domain=.moadong.com`, `Max-Age=0`으로 만료시킨다.
3. refresh token이 없으면 `USER_NOT_EXIST`가 아니라 `TOKEN_INVALID`가 발생한다.
4. `POST /auth/user/refresh`도 `refreshToken` 쿠키를 읽는다.
5. 개발자 포털 로그아웃 함수는 credentials 포함 요청으로 서버 로그아웃 API를 호출한다.
