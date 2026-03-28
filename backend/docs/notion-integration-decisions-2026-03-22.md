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

## 보안 수정 기록 (2026-03-28)

### AESCipher 고정 IV 취약점 수정

**원인**

`AESCipher`가 환경변수(`APP_ENCRYPTION_IV`)에 저장된 고정 IV를 모든 암호화 호출에 재사용하고 있었다.
AES-GCM 모드에서 동일한 key+IV 조합이 두 번 이상 사용되면 암호문을 XOR하는 것만으로
원본 데이터를 추출할 수 있어 기밀성과 무결성이 완전히 손상된다.

**영향 범위**

이 취약점은 Notion 기능 추가 이전부터 존재했으며, `AESCipher`를 사용하는 모든 경로에 해당한다.

| 파일                                                 | 저장 데이터                            |
| ---------------------------------------------------- | -------------------------------------- |
| `ClubApplyPublicService`                             | 지원서 답변 (이름, 연락처 등 개인정보) |
| `ClubApplicantsResult`, `ApplicantIdMessageConsumer` | 지원서 답변 복호화                     |
| `NotionOAuthService`                                 | Notion OAuth 액세스 토큰               |

**해결 방법**

- `encrypt`: `SecureRandom`으로 12바이트 IV를 매번 신규 생성, `v2:<Base64(iv || ciphertext)>` 포맷으로 저장
- `decrypt`: `v2:` 접두사가 있으면 내장 IV를 추출해 복호화, 없으면 기존 고정 IV로 폴백(레거시 데이터 하위 호환)
- API 계약 및 프론트엔드 변경 없음

**마이그레이션**

별도 데이터 마이그레이션 불필요. 기존 저장 데이터는 레거시 경로로 자동 복호화되며,
다음 저장 시점(재연동, 재지원)에 새 포맷으로 자연 교체된다.

---

## 운영 메모 / 주의사항

- 노출된 Notion access token은 반드시 폐기(revoke) 후 재발급한다.
- CORS는 환경별 Origin 값에 따라 결과가 달라지므로, 로컬/개발/운영 설정을 분리 관리한다.
