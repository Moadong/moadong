import { expect, test } from '@playwright/test';
import {
  MOCK_CLUB_ID,
  MOCK_FORM_ID,
  mockApplicationFormResponse,
  mockApplicationOptionsResponse,
  mockClubDetailResponse,
  mockClubSearchResponse,
} from './fixture/mock-data';

// 팝업 닫기 헬퍼 함수 (main-page.spec.ts와 동일)
async function closePopupIfExists(page: import('@playwright/test').Page) {
  const popup = page.locator('[aria-modal="true"]');
  const isPopupVisible = await popup.isVisible().catch(() => false);

  if (isPopupVisible) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    if (await popup.isVisible().catch(() => false)) {
      const closeButton = popup.locator('button').first();
      if (await closeButton.isVisible().catch(() => false)) {
        await closeButton.click({ force: true });
        await page.waitForTimeout(300);
      }
    }
  }
}

test.describe('지원하기 플로우', () => {
  test.beforeEach(async ({ context }) => {
    // context.route는 서비스 워커를 통과하는 요청도 가로챌 수 있음

    // 모든 API 요청을 하나의 핸들러에서 URL 기반으로 분기 처리
    await context.route(
      (url) => url.href.includes('/api/club'),
      async (route) => {
        const url = route.request().url();
        const method = route.request().method();
        console.log(`[MOCK] ${method} ${url}`);

        // 지원서 폼 데이터 (GET) + 지원 제출 (POST)
        if (url.includes(`/api/club/${MOCK_CLUB_ID}/apply/${MOCK_FORM_ID}`)) {
          if (method === 'POST') {
            await route.fulfill({ status: 200, body: '' });
          } else {
            await route.fulfill({ json: mockApplicationFormResponse });
          }
          return;
        }

        // 지원서 옵션 목록 (GET /api/club/{clubId}/apply)
        if (
          url.includes(`/api/club/${MOCK_CLUB_ID}/apply`) &&
          !url.includes(`/apply/`)
        ) {
          await route.fulfill({ json: mockApplicationOptionsResponse });
          return;
        }

        // 동아리 검색 (GET /api/club/search/)
        if (url.includes('/api/club/search')) {
          await route.fulfill({ json: mockClubSearchResponse });
          return;
        }

        // 동아리 상세 (GET /api/club/{clubId}) — 위에서 매칭되지 않은 나머지
        if (
          url.includes(`/api/club/${MOCK_CLUB_ID}`) &&
          !url.includes('/apply') &&
          !url.includes('/search')
        ) {
          await route.fulfill({ json: mockClubDetailResponse });
          return;
        }

        // 매칭되지 않는 API 요청은 통과
        await route.continue();
      },
    );
  });

  test('메인페이지 → 동아리 카드 클릭 → 상세 → 지원하기 → 폼 작성 → 제출', async ({
    page,
  }) => {
    // 브라우저 콘솔 에러 로깅
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`[BROWSER ERROR] ${msg.text()}`);
      }
    });
    page.on('pageerror', (err) => {
      console.log(`[PAGE ERROR] ${err.message}`);
    });

    // Step 1: 메인페이지 진입
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await closePopupIfExists(page);

    await expect(page.getByText(/전체 \d+개의 동아리/)).toBeVisible({
      timeout: 10000,
    });

    // Step 2: 동아리 카드 클릭 → 상세페이지 이동
    await page.getByText('테스트 동아리').first().click();

    await expect(page).toHaveURL(new RegExp(`/clubDetail/${MOCK_CLUB_ID}`), {
      timeout: 10000,
    });

    // Step 3: 상세페이지에서 동아리명 확인 및 지원하기 버튼 확인
    await expect(page.getByText('테스트 동아리').first()).toBeVisible({
      timeout: 10000,
    });

    const applyButton = page.getByText('지원하기');
    await expect(applyButton).toBeVisible({ timeout: 10000 });

    // Step 4: 지원하기 버튼 클릭 → 지원서 폼 페이지 이동
    await applyButton.click();

    await expect(page).toHaveURL(
      new RegExp(`/application/${MOCK_CLUB_ID}/${MOCK_FORM_ID}`),
      { timeout: 10000 },
    );

    // Step 5: 지원서 폼 확인 및 답변 입력
    await expect(
      page.getByText('2026년 1학기 신입부원 모집').first(),
    ).toBeVisible({ timeout: 10000 });

    // NAME 질문: 이름 입력
    const nameInput = page.getByPlaceholder('답변입력란(최대 100자)').first();
    await nameInput.fill('홍길동');

    // SHORT_TEXT 질문: 지원 동기 입력
    const motivationInput = page
      .getByPlaceholder('답변입력란(최대 100자)')
      .nth(1);
    await motivationInput.fill('동아리 활동에 관심이 많습니다.');

    // CHOICE 질문: 선택지 클릭
    await page.getByText('프로그래밍').click();

    // Step 6: 제출하기 클릭 → alert 확인 → 상세페이지 복귀
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    await page.getByText('제출하기').click();

    await expect(page).toHaveURL(new RegExp(`/clubDetail/${MOCK_CLUB_ID}`), {
      timeout: 10000,
    });
  });
});
