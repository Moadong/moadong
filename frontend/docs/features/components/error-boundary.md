# ErrorBoundary — 3계층 에러 경계 및 Sentry 연동

React 에러 경계를 3계층으로 구성해 에러 범위를 격리하고, 각 계층별로 Sentry 리포팅 정책을 다르게 적용한다.

## 계층 구조

| 계층 | 컴포넌트 | 기반 | Sentry 전송 |
|---|---|---|---|
| 최상위 | `GlobalBoundary` | `Sentry.ErrorBoundary` | 자동 전송 (모든 에러) |
| 라우트 단위 | `ContentErrorBoundary` | `BaseErrorBoundary` | 전체 전송 (`boundary: content`) |
| 데이터 페칭 단위 | `ApiErrorBoundary` | `BaseErrorBoundary` | 5xx·예상 외만 전송, 4xx 제외 (`boundary: api`) |

## 설계 원칙

- `BaseErrorBoundary`는 Sentry에 비의존(순수). Sentry 보고 정책은 각 경계의 `onError` prop으로 주입한다.
- React 에러 경계는 잡은 에러를 상위로 재전파하지 않으므로, 하위 경계가 별도로 Sentry를 호출해야 한다.

## ApiErrorBoundary 필터 로직

```ts
// 예상된 4xx(HttpError.isClientError())는 사용자에게 UI로 안내되는 에러 → Sentry 제외
// 5xx와 HttpError가 아닌 예상 외 에러만 전송
if (error instanceof HttpError && error.isClientError()) return;
Sentry.captureException(error, { extra: { boundary: 'api' } });
```

4xx를 제외하는 이유: 404·403 등은 예상된 상황으로 폴백 UI가 사용자에게 안내한다. 이를 Sentry로 모두 전송하면 노이즈가 과다해 실제 장애 감지가 어려워진다.

## 관련 코드

- `src/components/common/ErrorBoundary/BaseErrorBoundary.tsx` — 순수 에러 경계 기반 클래스. `onError` prop으로 외부에서 에러 처리 주입 가능
- `src/components/common/ErrorBoundary/GlobalError/GlobalBoundary.tsx` — Sentry.ErrorBoundary 래핑, 앱 최상위 안전망
- `src/components/common/ErrorBoundary/ContentError/ContentErrorBoundary.tsx` — 라우트 단위, pathname 기반 자동 리셋, Sentry 전송
- `src/components/common/ErrorBoundary/ApiError/ApiErrorBoundary.tsx` — 데이터 페칭 단위, 5xx·예상 외만 Sentry 전송
- `src/errors/HttpError.ts` — `isClientError()`, `isServerError()` 헬퍼 제공
