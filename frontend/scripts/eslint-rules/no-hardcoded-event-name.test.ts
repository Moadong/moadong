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
    // USER_EVENT 상수 사용 — 정상
    'trackEvent(USER_EVENT.BANNER_CLICKED, { id: 1 });',
    'mixpanel.track(USER_EVENT.SEARCH_EXCUTED);',
    // 동적 템플릿(페이지뷰 패턴)은 허용
    'mixpanel.track(`${pageName} Visited`);',
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
      // 옵셔널 체이닝(mixpanel?.track)으로 우회해도 검출
      code: "mixpanel?.track('Search Executed');",
      errors: [{ messageId: 'hardcoded' }],
    },
  ],
});
