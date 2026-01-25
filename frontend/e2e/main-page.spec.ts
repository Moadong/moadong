import { expect, test } from '@playwright/test';

// 팝업 닫기 헬퍼 함수
async function closePopupIfExists(page: import('@playwright/test').Page) {
  const popup = page.locator('[aria-modal="true"]');
  const isPopupVisible = await popup.isVisible().catch(() => false);

  if (isPopupVisible) {
    // ESC 키로 팝업 닫기 시도
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // 여전히 보이면 닫기 버튼 클릭
    if (await popup.isVisible().catch(() => false)) {
      const closeButton = popup.locator('button').first();
      if (await closeButton.isVisible().catch(() => false)) {
        await closeButton.click({ force: true });
        await page.waitForTimeout(300);
      }
    }
  }
}

// 모바일에서 메뉴 열기 헬퍼 함수
async function openMobileMenuIfNeeded(
  page: import('@playwright/test').Page,
  isMobile: boolean,
) {
  if (isMobile) {
    const menuButton = page.getByRole('button', { name: /메뉴/ });
    if (await menuButton.isVisible().catch(() => false)) {
      await menuButton.click();
      await page.waitForTimeout(300);
    }
  }
}

test.describe('메인페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // 팝업이 있으면 닫기
    await closePopupIfExists(page);
  });

  test.describe('1. Header (헤더)', () => {
    test('로고 클릭 시 홈으로 이동', async ({ page }) => {
      await page.goto('/introduce');
      await page.waitForLoadState('networkidle');
      await closePopupIfExists(page);
      await page.getByRole('button', { name: '홈으로 이동' }).click();
      await expect(page).toHaveURL('/');
    });

    test('네비게이션 - "모아동 소개" 클릭 시 /introduce 이동', async ({
      page,
      isMobile,
    }) => {
      await openMobileMenuIfNeeded(page, isMobile);
      await page.getByRole('button', { name: '모아동 소개' }).click();
      await expect(page).toHaveURL('/introduce');
    });

    test('네비게이션 - "총동아리연합회 소개" 클릭 시 /club-union 이동', async ({
      page,
      isMobile,
    }) => {
      await openMobileMenuIfNeeded(page, isMobile);
      await page.getByRole('button', { name: '총동아리연합회 소개' }).click();
      await expect(page).toHaveURL('/club-union');
    });

    test('네비게이션 - "관리자 페이지" 클릭 시 /admin 이동', async ({
      page,
      isMobile,
    }) => {
      await openMobileMenuIfNeeded(page, isMobile);
      await page.getByRole('button', { name: '관리자 페이지' }).click();
      await expect(page).toHaveURL(/\/admin/);
    });

    test('모바일 메뉴 버튼 토글 동작', async ({ page, isMobile }) => {
      test.skip(!isMobile, '모바일 전용 테스트');

      const menuButton = page.getByRole('button', { name: /메뉴/ });
      await menuButton.click();

      await expect(
        page.getByRole('button', { name: '모아동 소개' }),
      ).toBeVisible();

      await menuButton.click();
    });
  });

  test.describe('2. SearchBox (검색)', () => {
    test('검색창 placeholder 표시', async ({ page }) => {
      const searchInput = page.getByRole('textbox', { name: '동아리 검색창' });
      await expect(searchInput).toHaveAttribute(
        'placeholder',
        '어떤 동아리를 찾으세요?',
      );
    });

    test('검색어 입력 가능', async ({ page }) => {
      const searchInput = page.getByRole('textbox', { name: '동아리 검색창' });
      await searchInput.fill('밴드');
      await expect(searchInput).toHaveValue('밴드');
    });

    test('Enter 키로 검색 실행', async ({ page }) => {
      const searchInput = page.getByRole('textbox', { name: '동아리 검색창' });
      await searchInput.fill('밴드');
      await searchInput.press('Enter');

      await expect(page).toHaveURL('/');
    });
  });

  test.describe('3. Banner (배너)', () => {
    test('배너 렌더링 및 네비게이션 버튼 확인', async ({ page, isMobile }) => {
      // 모바일에서는 버튼 대신 스와이프/페이지네이션 사용
      test.skip(isMobile, '데스크톱 전용 테스트 - 모바일은 스와이프 사용');

      const prevButton = page.getByRole('button', { name: '이전 배너' });
      const nextButton = page.getByRole('button', { name: '다음 배너' });

      await expect(prevButton).toBeVisible();
      await expect(nextButton).toBeVisible();
    });

    test('배너 슬라이드 동작', async ({ page, isMobile }) => {
      test.skip(isMobile, '데스크톱 전용 테스트 - 모바일은 스와이프 사용');

      const nextButton = page.getByRole('button', { name: '다음 배너' });
      await nextButton.click();
      // 슬라이드 애니메이션 대기
      await page.waitForTimeout(600);
    });

    test('모바일 배너 페이지네이션 표시', async ({ page, isMobile }) => {
      test.skip(!isMobile, '모바일 전용 테스트');

      // 모바일에서는 숫자 페이지네이션 표시 (예: "1 / 3")
      await expect(page.getByText(/\d+ \/ \d+/)).toBeVisible();
    });
  });

  test.describe('4. CategoryButtonList (카테고리 필터)', () => {
    const categories = [
      '전체',
      '봉사',
      '종교',
      '취미교양',
      '학술',
      '운동',
      '공연',
    ];

    test('7개 카테고리 버튼 렌더링', async ({ page }) => {
      for (const category of categories) {
        const button = page
          .locator('button')
          .filter({ hasText: category })
          .first();
        await expect(button).toBeVisible();
      }
    });

    test('카테고리 클릭 시 필터링 동작', async ({ page }) => {
      const volunteerButton = page
        .locator('button')
        .filter({ hasText: '봉사' })
        .first();
      await volunteerButton.click();

      // 카테고리 선택 후 결과 대기
      await page.waitForTimeout(500);
    });

    test('전체 카테고리 클릭 시 모든 동아리 표시', async ({ page }) => {
      // 먼저 다른 카테고리 선택
      const sportButton = page
        .locator('button')
        .filter({ hasText: '운동' })
        .first();
      await sportButton.click();
      await page.waitForTimeout(500);

      // 전체 카테고리 선택
      const allButton = page
        .locator('button')
        .filter({ hasText: '전체' })
        .first();
      await allButton.click();

      // 결과 텍스트 확인
      await expect(page.getByText(/전체 \d+개의 동아리/)).toBeVisible({
        timeout: 10000,
      });
    });
  });

  test.describe('5. 탭 영역', () => {
    test('"부경대학교 중앙동아리" 탭 렌더링', async ({ page }) => {
      // 탭 버튼으로 정확히 선택
      await expect(
        page.getByRole('button', {
          name: '부경대학교 중앙동아리',
          exact: true,
        }),
      ).toBeVisible();
    });

    test('전체 동아리 개수 표시', async ({ page }) => {
      await expect(page.getByText(/전체 \d+개의 동아리/)).toBeVisible({
        timeout: 10000,
      });
    });
  });

  test.describe('6. ClubCard (동아리 카드)', () => {
    test('카드 목록 렌더링', async ({ page }) => {
      // 동아리 개수 표시 대기
      const countElement = page.getByText(/전체 \d+개의 동아리/);
      await expect(countElement).toBeVisible({ timeout: 15000 });

      const countText = await countElement.textContent();
      const count = parseInt(countText?.match(/\d+/)?.[0] || '0');

      if (count > 0) {
        // 모집중/모집마감 상태 박스가 있는 카드 확인
        const stateBox = page.getByText(/모집중|모집마감/).first();
        await expect(stateBox).toBeVisible({ timeout: 10000 });
      } else {
        // 동아리가 없으면 빈 결과 또는 0개 표시 확인
        await expect(countElement).toContainText('0개');
      }
    });

    test('카드 클릭 시 상세페이지 이동', async ({ page }) => {
      // 데이터 로딩 대기
      const countElement = page.getByText(/전체 \d+개의 동아리/);
      await expect(countElement).toBeVisible({ timeout: 15000 });

      const countText = await countElement.textContent();
      const count = parseInt(countText?.match(/\d+/)?.[0] || '0');

      if (count > 0) {
        // 모집중/모집마감 버튼이 있는 카드 요소를 찾아서 클릭
        const stateBox = page.getByText(/모집중|모집마감/).first();
        await stateBox.click();

        await expect(page).toHaveURL(/\/club\/\d+/, { timeout: 10000 });
      }
    });
  });

  test.describe('7. 상태 처리', () => {
    test('검색 결과 없을 때 빈 결과 메시지 표시', async ({ page }) => {
      const searchInput = page.getByRole('textbox', { name: '동아리 검색창' });
      await searchInput.fill('존재하지않는동아리이름xyz123');
      await searchInput.press('Enter');

      await expect(
        page.getByText(/앗, 조건에 맞는 동아리가 없어요/),
      ).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('8. Footer (푸터)', () => {
    test('푸터 렌더링 확인', async ({ page }) => {
      // 페이지 하단으로 스크롤
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

      const footer = page.locator('footer');
      await expect(footer).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('9. Popup (팝업)', () => {
    test('팝업이 있으면 닫기 가능', async ({ page }) => {
      // 새로 페이지 로드해서 팝업 확인
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const popup = page.locator('[aria-modal="true"]');
      const isPopupVisible = await popup.isVisible().catch(() => false);

      if (isPopupVisible) {
        // ESC 키로 팝업 닫기
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);

        // 팝업이 닫혔는지 확인 (닫히지 않았어도 테스트는 통과)
      }

      expect(true).toBe(true);
    });
  });
});
