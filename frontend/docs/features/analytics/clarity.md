# Microsoft Clarity (정성 분석)

Mixpanel(정량 이벤트) 외에 세션 리플레이·히트맵 등 정성 분석을 위해 Microsoft Clarity를 도입했다. 다른 SDK와 동일하게 `src/utils/initSDK.ts`에서 초기화하고 `src/index.tsx`에서 앱 부팅 시 호출한다.

## 패키지 선택 — `@microsoft/clarity` (중요)

반드시 공식 래퍼 **`@microsoft/clarity`**를 사용한다. 저수준 OSS 패키지 `clarity-js`는 기본 업로드 엔드포인트가 없어(`config.upload`를 직접 문자열로 주지 않으면 전송 안 함) **데이터가 Clarity 대시보드에 잡히지 않는다**. `@microsoft/clarity`의 `Clarity.init(projectId)`는 `https://www.clarity.ms/tag/<projectId>` 호스팅 태그를 주입해 업로드까지 자동 처리한다.

## 초기화

```ts
// src/utils/initSDK.ts
import Clarity from '@microsoft/clarity';

export function initializeClarity() {
  if (!import.meta.env.VITE_CLARITY_PROJECT_ID) {
    console.warn('Clarity 환경변수 설정이 안 되어 있습니다.');
    return; // env 가드
  }
  if (import.meta.env.DEV) return; // 개발 환경(localhost·127.0.0.1 등) 제외
  Clarity.init(import.meta.env.VITE_CLARITY_PROJECT_ID);
}
```

- 환경변수: `VITE_CLARITY_PROJECT_ID` (Clarity 프로젝트 Settings > Overview의 ID). 배포 환경에도 등록 필요.
- `import.meta.env.DEV` 가드로 개발 환경에서는 init하지 않는다 (localhost뿐 아니라 `127.0.0.1` 등 모든 dev 주소 포함).

## PII 마스킹

지원서 답변에는 이름·연락처 등 PII가 들어가므로, 정성 분석은 전역으로 유지하되 **답변 영역만 마스킹**한다. 공식 속성 `data-clarity-mask="true"`를 답변 컨테이너에 부여하면 해당 영역의 내용만 가려지고, 스크롤·클릭·이탈 등 상호작용 데이터는 유지된다.

```tsx
// ApplicationFormPage.tsx
<Styled.QuestionsWrapper data-clarity-mask='true'>
```

## 한계

추적 차단기(uBlock 등)나 강화된 추적 보호(Firefox/Zen ETP, Brave Shields)를 쓰는 사용자는 `clarity.ms`가 차단돼 잡히지 않는다. Clarity뿐 아니라 모든 분석 툴의 공통 한계이며, 정성 분석은 전수가 아닌 표본 기준으로 본다.

## 관련 코드

- `src/utils/initSDK.ts` — `initializeClarity()` (init, env·dev 가드)
- `src/index.tsx` — 앱 부팅 시 호출
- `src/pages/ApplicationFormPage/ApplicationFormPage.tsx` — 답변 영역 `data-clarity-mask` 마스킹
