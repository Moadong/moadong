# Notion 연동 결정사항 기록 (2026-03-22)

## 범위

- 백엔드: `moadong/integration/notion/*`
- CORS: `moadong/global/config/WebConfig.java`

## 최종 결정사항

1. Notion 연동 코드는 `src/main/java/moadong/integration/notion` 경로에 유지한다.
2. `NOTION_CLIENT_SECRET`, `NOTION_CLIENT_ID`는 서버 전용 값으로 관리한다. (프론트 요청 바디로 받지 않음)
3. `NOTION_REDIRECT_URI`도 서버 전용 값으로 관리하며, Notion 콘솔 등록값과 완전히 일치해야 한다.
4. OAuth 인가 URL 생성은 백엔드 엔드포인트로 제공한다.
   - `GET /api/integration/notion/oauth/authorize?state=...`
5. OAuth 토큰 교환 엔드포인트는 인증 사용자만 호출 가능하며 `code`만 받는다.
   - `POST /api/integration/notion/oauth/token`
6. Notion access token은 백엔드에서 암호화(AES)하여 MongoDB에 저장하고, 프론트로 반환하지 않는다.
7. Notion 페이지 조회는 백엔드 인증 후, 서버 저장 토큰으로 조회한다.
   - `GET /api/integration/notion/pages`
8. Notion 연동 API에 Swagger 어노테이션을 적용한다. (`@Tag`, `@Operation`, `@SecurityRequirement`)
9. `NotionConnectionRepository`는 Spring Data Mongo 자동 구현 구조로 실제 서비스에서 사용 중이므로 유지한다.
10. CORS는 `WebConfig` 변경을 되돌려 현재 `allowedOriginPatterns(...)`를 사용한다.

## 현재 API 계약

- `GET /api/integration/notion/oauth/authorize`
  - 인증 필요: 예 (`BearerAuth`)
  - 쿼리: `state` (선택)
  - 응답: `data.authorizeUrl`

- `POST /api/integration/notion/oauth/token`
  - 인증 필요: 예 (`BearerAuth`)
  - 요청 바디:
    ```json
    { "code": "..." }
    ```
  - 응답: 워크스페이스 메타데이터만 반환 (`workspaceName`, `workspaceId`)

- `GET /api/integration/notion/pages`
  - 인증 필요: 예 (`BearerAuth`)
  - 프론트에서 Notion 토큰 헤더 전달 불필요
  - 백엔드가 저장 토큰 복호화 후 Notion API 호출

## 필수 환경변수

- `NOTION_CLIENT_ID`
- `NOTION_CLIENT_SECRET`
- `NOTION_REDIRECT_URI`
- (선택) `NOTION_VERSION` (기본값: `2022-06-28`)

## 검증 상태

- `./gradlew compileJava -q`: 주요 변경마다 통과 확인
- `http://localhost:3000` 기준 CORS preflight: 통과
  - `200`
  - `Access-Control-Allow-Origin`/`Access-Control-Allow-Credentials` 확인

## 운영 메모 / 주의사항

- 노출된 Notion access token은 반드시 폐기(revoke) 후 재발급한다.
- CORS는 환경별 Origin 값에 따라 결과가 달라지므로, 로컬/개발/운영 설정을 분리 관리한다.

## Codex 활용 기록

- 설계/구조 정리
  - `integration/notion` 패키지 구조 제안 및 적용
  - 프론트 토큰 노출 제거 방향(서버 저장형)으로 API 계약 정리
- 구현 자동화
  - Notion OAuth Controller/Service/DTO/Repository/Entity 생성
  - 토큰 암호화 저장(AESCipher 연계) 및 페이지 조회 로직 구현
  - Swagger 어노테이션 및 인증 가드(`@PreAuthorize`, `@SecurityRequirement`) 반영
- 검증 지원
  - 변경 후 `./gradlew compileJava -q` 반복 검증
  - CORS preflight 체크 포인트 정리
- 협업 산출물
  - 결정사항 문서화
  - 파일 단위 커밋 분리
  - PR 초안 작성(제목/요약/변경사항/리스크/후속작업)
