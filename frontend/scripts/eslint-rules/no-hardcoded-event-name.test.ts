import { RuleTester } from 'eslint';
import rule from './no-hardcoded-event-name';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTester.run('no-hardcoded-event-name', rule, {
  valid: [
    // eventName.ts 상수 사용 — 정상
    'trackEvent(USER_EVENT.BANNER_CLICKED, { id: 1 });',
    'mixpanel.track(USER_EVENT.SEARCH_EXECUTED);',
    'mixpanel.track(PAGE_EVENT.PAGE_VIEWED, { page_name: pageName });',
    // 추적 호출이 아니면 무시
    "track('something');",
    "logger.track('event');",
  ],
  invalid: [
    {
      code: "trackEvent('Banner Clicked');",
      errors: [{ messageId: 'hardcoded' }],
    },
    {
      code: "mixpanel.track('Search Executed', { q: 'a' });",
      errors: [{ messageId: 'hardcoded' }],
    },
    {
      // 표현식 없는 정적 템플릿도 하드코딩으로 간주
      code: 'trackEvent(`Banner Clicked`);',
      errors: [{ messageId: 'hardcoded' }],
    },
    {
      // 동적 템플릿 이벤트명은 값마다 이벤트가 생기므로 금지
      code: 'mixpanel.track(`${pageName} Visited`);',
      errors: [{ messageId: 'dynamic' }],
    },
    {
      // 문자열 연결로 만든 이벤트명도 금지
      code: "trackEvent(pageName + ' Visited');",
      errors: [{ messageId: 'dynamic' }],
    },
    {
      // 옵셔널 체이닝(mixpanel?.track)으로 우회해도 검출
      code: "mixpanel?.track('Search Executed');",
      errors: [{ messageId: 'hardcoded' }],
    },
  ],
});
