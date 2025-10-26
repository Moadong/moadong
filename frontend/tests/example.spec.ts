import { test, expect } from '@playwright/test';

test('모아동 사이트에서 동아리 검색 및 상세페이지 확인', async ({ page }) => {
  // 1. 홈페이지 이동
  await page.goto('https://www.moadong.com/');

  // 2. 검색창에 "CCC" 입력 후 검색
  const searchInput = page.getByPlaceholder('어떤 동아리를 찾으세요?');
  await searchInput.fill('CCC');
  await searchInput.press('Enter');

  // 3. 검색 결과에서 "CCC"가 표시되는지 확인
  const resultItem = page.getByText('CCC', { exact: true });
  await expect(resultItem).toBeVisible();

  // 4. 결과 클릭하여 상세 페이지 이동
  await resultItem.click();

  // 5. 동아리 상세 정보 검증
  //    - 제목이 "CCC"인지 확인
  const heading = page.getByRole('heading', { name: 'CCC' });
  await expect(heading).toBeVisible();

  //    - 모집 정보 블록이 존재하는지 확인
  const recruitmentInfo = page
    .locator('[class*="sc-gfjqlz"]')
    .filter({ hasText: /모집기간/ });
  await expect(recruitmentInfo).toContainText('모집기간');

  //    - 소개글 일부 텍스트 존재 여부 확인
  await expect(
    page.getByText(/기독교 동아리 CCC에서 신입생을 모집합니다/),
  ).toBeVisible();

  // 6. 추가적으로 다른 요소가 정상적으로 표시되는지 확인 가능
});
