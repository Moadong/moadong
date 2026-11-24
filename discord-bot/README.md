# 모아동 Discord 봇

모아동 Mixpanel 지표(DAU, 누적 사용자, 페이지별 PV·체류시간 등)를 Discord 채널에 자동 전송하고, `@멘션`으로 채팅 조회할 수 있는 봇입니다.

## 기능

- **일간 리포트**: 매일 오전 9시 KST(UTC 00:00)에 어제 DAU, 누적 사용자, 메인 PV 자동 전송
- **주간 리포트**: 매주 월요일 오전 9시 KST에 주요 페이지별 PV 테이블 전송
- **@멘션 조회**: 봇을 멘션하고 키워드를 입력해 주요 지표 즉시 조회

## 환경 변수

`.env.example`을 복사해 `.env` 파일을 만들고 아래 값을 채웁니다.

| 변수명 | 설명 |
|---|---|
| `MP_SERVICE_ACCOUNT` | Mixpanel Service Account 이메일 (Project Settings → Service Accounts) |
| `MP_SERVICE_SECRET` | Mixpanel Service Account 시크릿 |
| `MP_PROJECT_ID` | Mixpanel 프로젝트 ID |
| `DISCORD_TOKEN` | Discord 봇 토큰 (Discord Developer Portal) |
| `DISCORD_CHANNEL_ID` | 리포트를 보낼 Discord 채널 ID |

```bash
cp .env.example .env
# .env 파일을 열어 값 입력
```

## 로컬 실행

```bash
npm install
npm run dev      # ts-node로 바로 실행
# 또는
npm run build && npm start
```

## @멘션 키워드

| 키워드 | 조회 내용 |
|---|---|
| `오늘`, `신규` | 오늘 DAU |
| `어제` | 어제 DAU |
| `누적`, `전체` | 전체(누적) 사용자 수 |
| `메인`, `main` | 메인 페이지 7일 PV·순방문·체류시간 |
| `동아리 상세`, `club_detail` | 동아리 상세 페이지 7일 통계 |
| `지원`, `지원서` | 지원서 제출·클릭 수 (7일) |
| 기타 | 도움말 임베드 |

## 배포

### Railway (추천)

1. [Railway](https://railway.app)에서 New Project → Deploy from GitHub repo 선택
2. Settings → Environment Variables에서 `.env` 값 입력
3. Root Directory: `discord-bot`
4. Start Command: `npm run build && npm start`

### Render (대안)

1. [Render](https://render.com)에서 New → Background Worker 선택
2. GitHub 레포 연결, Root Directory: `discord-bot`
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Environment Variables 탭에서 `.env` 값 입력

> **주의**: Render 무료 플랜은 15분 비활성 시 슬립될 수 있습니다. 스케줄러를 안정적으로 운영하려면 유료 플랜 또는 Railway를 권장합니다.

## Mixpanel 이벤트 참고

| 이벤트명 | 설명 |
|---|---|
| `Page Viewed` | 페이지뷰 (속성: `page_name`) |
| `Page Left` | 페이지 이탈 (속성: `page_name`, `duration_seconds`) |
| `Application Form Submitted` | 지원서 제출 |
| `Club Apply Button Clicked` | 동아리 지원 버튼 클릭 |

`page_name` 값: `main`, `club_detail`, `subscriptions`, `admin_statistics`, `introduce`, `promotion_list`, `promotion_detail`, `feedback_list`, `feedback_write`
