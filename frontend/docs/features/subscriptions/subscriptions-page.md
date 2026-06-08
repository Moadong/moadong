# 구독한 동아리 페이지 (SubscriptionsPage)

바텀 네비게이션 "구독" 탭의 페이지(`/subscriptions`). 앱 네이티브 구독 화면(RN `ui/subscribe/`)을 웹으로 이식했다.

## 동작

- **웹뷰(`isInAppWebView()`)**: `useWebviewSubscribe`로 네이티브 브릿지에서 구독 동아리 ID(`subscribedClubIds`)를 받아오고, `useGetCardList`(메인과 동일 쿼리, 캐시 공유) 결과를 해당 ID로 필터링해 `ClubCard` + `SubscribeButton`(현장 구독 토글)로 렌더. 로딩/에러/빈 상태("홈으로 가기") 처리.
- **순수 웹(앱 아님)**: 구독은 네이티브 브릿지 전용이라 웹엔 데이터가 없다. "구독 기능은 모아동 앱에서 이용 가능" 안내 + 앱 다운로드 CTA(`getAppStoreLink`)를 렌더.

구독 토글·상태 동기화는 기존 브릿지(`SUBSCRIBE_TOGGLE` / `SUBSCRIBE_STATE`)를 그대로 사용한다.

## 관련 코드

- `src/pages/SubscriptionsPage/SubscriptionsPage.tsx` — 페이지 (웹뷰/웹 분기)
- `src/pages/SubscriptionsPage/SubscriptionsPage.styles.ts`
- `src/hooks/useWebviewSubscribe.ts` — 구독 상태 브릿지 훅 (재사용)
- `src/hooks/Queries/useClub.ts` (`useGetCardList`) — 동아리 목록 (재사용)
- `src/pages/MainPage/components/ClubCard/ClubCard.tsx`, `src/pages/MainPage/components/SubscribeButton/SubscribeButton.tsx` — 카드/구독 버튼 (재사용)
- `src/utils/appStoreLink.ts` (`getAppStoreLink`) — 웹 CTA 링크
- `src/routes/AppRoutes.tsx` — `/subscriptions` 라우트

## 참고

`/subscriptions`는 `AppLayout`의 하위 라우트로 공용 헤더/바텀네비를 사용한다.
