---
description: 테스트 코드 작성 (Jest / RTL / Playwright)
allowed-tools: Bash(npm run test *), Bash(npx jest *), Bash(npx playwright *), Read, Write, Edit, Glob, Grep
---

# 테스트 코드 작성

대상 파일 또는 기능에 대한 테스트 코드를 작성합니다.

---

## Step 1: 테스트 유형 확인

사용자에게 테스트 유형을 확인합니다:

1. **단위 테스트 (Jest)** - 유틸리티 함수, 훅, 순수 로직
2. **컴포넌트 테스트 (RTL)** - React 컴포넌트 렌더링 및 인터랙션
3. **E2E 테스트 (Playwright)** - 사용자 시나리오 기반 통합 테스트

---

## Step 2: 대상 파일 분석

테스트 대상 파일을 읽고 분석합니다:

- 함수/컴포넌트의 입력과 출력
- 엣지 케이스 및 예외 상황
- 의존성 (외부 API, 스토어, 라우터 등)

---

## Step 3: 테스트 작성

### 단위 테스트 (Jest)

**파일 위치**: 대상 파일과 동일 경로에 `*.test.ts` 생성

**패턴**:

```typescript
import { targetFunction } from './targetFile';

describe('targetFunction', () => {
  beforeEach(() => {
    // 테스트 환경 설정
  });

  afterEach(() => {
    // 정리
  });

  it('정상 케이스를 처리한다', () => {
    const result = targetFunction(input);
    expect(result).toBe(expected);
  });

  it('엣지 케이스를 처리한다', () => {
    // ...
  });

  it('예외 상황에서 적절히 동작한다', () => {
    // ...
  });
});
```

**체크리스트**:

- [ ] 정상 동작 케이스
- [ ] 경계값 테스트
- [ ] 예외/에러 케이스
- [ ] 타이머 사용 시 `jest.useFakeTimers()`
- [ ] 비동기 함수는 `async/await` 사용

---

### 컴포넌트 테스트 (RTL)

**파일 위치**: 컴포넌트와 동일 경로에 `*.test.tsx` 생성

**패턴**:

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TargetComponent from './TargetComponent';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('TargetComponent', () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it('초기 상태가 올바르게 렌더링된다', () => {
    renderWithProviders(<TargetComponent />);
    expect(screen.getByText('예상 텍스트')).toBeInTheDocument();
  });

  it('사용자 인터랙션에 올바르게 반응한다', async () => {
    renderWithProviders(<TargetComponent />);

    fireEvent.click(screen.getByRole('button', { name: '버튼명' }));

    await waitFor(() => {
      expect(screen.getByText('변경된 텍스트')).toBeInTheDocument();
    });
  });

  it('로딩 상태를 표시한다', () => {
    // ...
  });

  it('에러 상태를 처리한다', () => {
    // ...
  });
});
```

**체크리스트**:

- [ ] 초기 렌더링 상태
- [ ] 사용자 인터랙션 (클릭, 입력 등)
- [ ] 로딩/에러 상태
- [ ] 조건부 렌더링
- [ ] Props 변경에 따른 업데이트
- [ ] 필요시 MSW로 API 모킹

---

### E2E 테스트 (Playwright)

**파일 위치**: `e2e/` 폴더에 `*.spec.ts` 생성

**패턴**:

```typescript
import { expect, test } from '@playwright/test';

test.describe('기능명', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/target-page');
  });

  test('사용자 시나리오를 완료한다', async ({ page }) => {
    // 1. 페이지 로드 확인
    await expect(
      page.getByRole('heading', { name: '페이지 제목' }),
    ).toBeVisible();

    // 2. 사용자 액션
    await page.getByRole('button', { name: '버튼명' }).click();

    // 3. 결과 확인
    await expect(page.getByText('성공 메시지')).toBeVisible();
  });

  test('에러 케이스를 처리한다', async ({ page }) => {
    // ...
  });
});
```

**체크리스트**:

- [ ] 핵심 사용자 플로우
- [ ] 폼 제출 및 유효성 검사
- [ ] 네비게이션
- [ ] 반응형 (모바일/데스크톱)
- [ ] 에러 처리 및 복구

---

## Step 4: 테스트 실행

```bash
# 단위/컴포넌트 테스트
npx jest path/to/file.test.ts

# 전체 테스트
npm run test

# E2E 테스트
npx playwright test e2e/file.spec.ts

# E2E 테스트 (UI 모드)
npx playwright test --ui
```

---

## 작성 원칙

1. **테스트 설명은 한국어로** - `it('정상적으로 동작한다')`
2. **Given-When-Then 구조** - 준비 → 실행 → 검증
3. **독립적인 테스트** - 테스트 간 의존성 없음
4. **의미 있는 테스트명** - 무엇을 테스트하는지 명확히
5. **과도한 모킹 지양** - 실제 동작에 가깝게

---

## 참고: 프로젝트 테스트 설정

- Jest 설정: `jest.config.js`
- RTL 설정: `@testing-library/react`, `@testing-library/jest-dom`
- MSW 핸들러: `src/mocks/handlers/`
- Playwright 설정: `playwright.config.ts` (없으면 생성 필요)
