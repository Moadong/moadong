import { useEffect } from 'react';
import type { Preview } from '@storybook/react-vite';
import mixpanel from 'mixpanel-browser';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from '../src/styles/Global.styles';
import { BREAKPOINT } from '../src/styles/mediaQuery';
import { theme } from '../src/styles/theme';
import WebviewGlobalStyles from '../src/styles/WebviewGlobal.styles';

// isInAppWebView()는 userAgent의 MoadongApp으로 판정한다. 툴바의 웹뷰 토글이
// 켜져 있을 때만 MoadongApp을 붙여, 웹뷰 분기가 있는 컴포넌트를 앱 화면으로 본다.
// HMR로 이 모듈이 다시 실행돼도 덮어쓴 getter가 아닌 원래 값을 읽도록 프로토타입에서 가져온다.
const ORIGINAL_USER_AGENT = Object.getOwnPropertyDescriptor(
  Navigator.prototype,
  'userAgent',
)!.get!.call(navigator) as string;
let isWebviewMode = false;
Object.defineProperty(navigator, 'userAgent', {
  configurable: true,
  get: () =>
    isWebviewMode ? `${ORIGINAL_USER_AGENT} MoadongApp` : ORIGINAL_USER_AGENT,
});

// 뷰포트 선택지를 mediaQuery의 브레이크포인트와 같은 폭으로 둔다.
const BREAKPOINT_VIEWPORTS = Object.fromEntries(
  Object.entries(BREAKPOINT).map(([name, width]) => [
    name,
    {
      name: `${name} (${width}px)`,
      styles: { width: `${width}px`, height: '800px' },
      type:
        width > BREAKPOINT.tablet
          ? 'desktop'
          : width > BREAKPOINT.mobile
            ? 'tablet'
            : 'mobile',
    },
  ]),
);

const preview: Preview = {
  globalTypes: {
    webview: {
      description: '앱 웹뷰 환경으로 보기',
      toolbar: {
        title: '웹뷰',
        icon: 'mobile',
        items: [
          { value: 'off', title: '웹' },
          { value: 'on', title: '앱 웹뷰' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    webview: 'off',
  },
  decorators: [
    (Story, context) => {
      isWebviewMode = context.globals.webview === 'on';

      useEffect(() => {
        try {
          mixpanel.init('storybook', { debug: false, ignore_dnt: true });
          mixpanel.disable();
        } catch (error) {
          console.warn('Failed to initialize mixpanel for Storybook:', error);
        }
      }, []);

      return (
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          {isWebviewMode && <WebviewGlobalStyles />}
          {/* 토글을 바꾸면 다시 마운트해 useState 초기값·마운트 effect에서 판정하는 코드도 따라오게 한다. */}
          <Story key={context.globals.webview} />
        </ThemeProvider>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      options: BREAKPOINT_VIEWPORTS,
    },
    a11y: {
      // 위반을 패널에만 보여 주고 빌드·Chromatic은 막지 않는다.
      test: 'todo',
    },
  },
};

export default preview;
