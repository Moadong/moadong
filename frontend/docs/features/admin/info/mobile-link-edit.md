# 링크 추가 모바일 편집 페이지

`ClubInfoEditTabMobile`의 "링크 추가" 항목을 탭하면 `activePage` state가 `'links'`로 전환되어 `LinkEditPage`가 풀스크린으로 노출된다. 라우트 변경 없이 state 기반으로 서브뷰를 전환하는 패턴으로, `FreeTagEditPage`와 동일한 구조다.

## 지원 플랫폼

instagram, youtube 2개만 지원. `ClubInfoEditTab` 데스크탑 버전(`InputField` 사용)과 달리 모바일 전용 `LinkField` 컴포넌트를 사용한다.

## LinkField

`EditField`를 래핑하는 URL 입력 전용 컴포넌트. `TextField`와 유사한 구조이나 `<textarea>` 대신 `<input type='url'>`을 사용하며, 값이 있을 때 텍스트 색상이 `accent[1][900]`(#3DBBFF)으로 변한다. `LinkEditPage`에서만 사용하므로 동일 폴더에 배치한다.

- label 색상: `colors.gray[800]` (`EditField`의 `labelColor` prop으로 전달)
- 텍스트: `typography.paragraph.p4` (weight 400, Regular)
- 에러 메시지: `EditField` 카드 아래 별도 렌더링

## 유효성 검사

`validateSocialLink(key, value)`를 입력 변경 시마다 실행. 저장 시 에러가 남아 있으면 `alert`로 안내하고 저장을 막는다.

## 관련 코드

- `src/pages/AdminPage/tabs/ClubInfoEditTab/components/mobile/LinkEditPage/LinkEditPage.tsx` — 메인 서브페이지 컴포넌트
- `src/pages/AdminPage/tabs/ClubInfoEditTab/components/mobile/LinkEditPage/LinkField.tsx` — URL 입력 필드
- `src/pages/AdminPage/components/editFields/EditField/EditField.tsx` — `labelColor` prop 추가됨
- `src/utils/validateSocialLink.ts` — SNS URL 유효성 검사
- `src/constants/snsConfig.ts` — label, placeholder 상수
