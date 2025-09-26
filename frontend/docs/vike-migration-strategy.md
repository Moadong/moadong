# React 프로젝트 Vike SSR 마이그레이션 전략

## 1. 목표

기존 `react-router-dom` 기반의 라우팅 구조를 최대한 유지하면서, Vike(구 vite-plugin-ssr)를 도입하여 서버 사이드 렌더링(SSR)을 적용하는 것을 목표로 합니다.

## 2. 핵심 전략: 하이브리드 라우팅

- **Vike (서버):** Vike는 모든 URL 요청을 받아 처리하는 "Catch-all" 라우트 역할을 합니다. 서버에서 React 앱의 초기 HTML을 렌더링하고 클라이언트로 전송합니다.
- **React Router (클라이언트):** 클라이언트 측에서 JavaScript가 로드된 후, React Router가 애플리케이션의 모든 내부 내비게이션을 담당합니다. 이는 기존의 SPA(Single Page Application) 동작 방식과 동일합니다.

이 접근 방식을 통해 Vike의 SSR 이점을 활용하면서도, 기존의 복잡한 라우팅 로직을 수정하는 비용을 최소화할 수 있습니다.

## 3. 마이그레이션 단계

### 1단계: 의존성 설치

```bash
npm install vike @vikejs/react
```

### 2단계: `vite.config.ts` 수정

Vike와 React 플러그인을 `vite.config.ts`에 추가합니다. Vike 플러그인은 React 플러그인보다 먼저 와야 합니다.

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vike from 'vike/plugin';

export default defineConfig({
  plugins: [
    vike(), // Vike 플러그인
    react() // React 플러그인
  ],
  // ... 기존 설정
});
```

### 3단계: 프로젝트 구조 변경 및 Vike 렌더러 설정

Vike는 렌더링 로직을 위한 `renderer` 디렉토리를 사용하는 것을 권장합니다.

1.  **`renderer` 디렉토리 생성:** 프로젝트 루트에 `renderer` 폴더를 생성합니다.

2.  **서버 렌더러 작성 (`renderer/_default.page.server.tsx`):**
    서버 측에서 React 컴포넌트를 HTML 문자열로 렌더링하는 역할을 합니다. `react-router-dom`의 `StaticRouter`를 사용하여 현재 요청 URL에 맞는 컴포넌트를 렌더링합니다.

    ```tsx
    // renderer/_default.page.server.tsx
    import ReactDOMServer from 'react-dom/server';
    import { StaticRouter } from 'react-router-dom/server';
    import { PageContextProvider } from './PageContextProvider';
    import App from '../src/App';
    import type { PageContextServer } from 'vike/types';

    export async function render(pageContext: PageContextServer) {
      const { urlOriginal } = pageContext;

      const pageHtml = ReactDOMServer.renderToString(
        <StaticRouter location={urlOriginal}>
          <PageContextProvider pageContext={pageContext}>
            <App />
          </PageContextProvider>
        </StaticRouter>
      );

      return {
        documentHtml: `<!DOCTYPE html><html><body><div id="root">${pageHtml}</div></body></html>`,
        pageContext: {
          //
        }
      };
    }
    ```

3.  **클라이언트 렌더러 작성 (`renderer/_default.page.client.tsx`):**
    서버에서 렌더링된 HTML을 클라이언트에서 "hydrate"하는 역할을 합니다. `BrowserRouter`를 사용하여 클라이언트 사이드 라우팅을 활성화합니다.

    ```tsx
    // renderer/_default.page.client.tsx
    import ReactDOM from 'react-dom/client';
    import { BrowserRouter } from 'react-router-dom';
    import { PageContextProvider } from './PageContextProvider';
    import App from '../src/App';
    import type { PageContextClient } from 'vike/types';

    export async function render(pageContext: PageContextClient) {
      const container = document.getElementById('root')!;
      
      ReactDOM.hydrateRoot(
        container,
        <BrowserRouter>
          <PageContextProvider pageContext={pageContext}>
            <App />
          </PageContextProvider>
        </BrowserRouter>
      );
    }
    ```

4.  **페이지 컨텍스트 프로바이더 (`renderer/PageContextProvider.tsx`):**
    Vike의 `pageContext`를 React 컴포넌트 트리 전체에서 사용할 수 있도록 하는 유틸리티 컴포넌트입니다.

    ```tsx
    // renderer/PageContextProvider.tsx
    import React, { useContext } from 'react';
    import type { PageContext } from 'vike/types';

    const Context = React.createContext<PageContext>(undefined as any);

    export function PageContextProvider({ pageContext, children }: { pageContext: PageContext; children: React.ReactNode }) {
      return <Context.Provider value={pageContext}>{children}</Context.Provider>;
    }

    export function usePageContext() {
      return useContext(Context);
    }
    ```

### 4단계: "Catch-All" 라우트 설정

Vike가 모든 경로를 처리하도록 설정합니다.

1.  **페이지 파일 생성 (`src/pages/index.page.tsx`):**
    이 파일은 Vike에게 "페이지"가 존재함을 알리는 역할을 합니다. 내용은 중요하지 않으며, `App` 컴포넌트를 렌더링하기만 하면 됩니다.

    ```tsx
    // src/pages/index.page.tsx
    import App from '../App';

    export default function Page() {
      return <App />;
    }
    ```

2.  **라우트 파일 생성 (`src/pages/index.page.route.ts`):**
    이 파일이 핵심입니다. `/*` 패턴을 사용하여 모든 URL을 이 페이지 파일로 라우팅하도록 Vike에 지시합니다.

    ```typescript
    // src/pages/index.page.route.ts
    export default '/*';
    ```

### 5단계: 데이터 페칭 (React Query)

SSR 시 초기 데이터 로딩을 위해 `onBeforeRender` 훅을 사용합니다.

```tsx
// renderer/_default.page.server.tsx 에 추가

import { QueryClient, dehydrate } from '@tanstack/react-query';

export async function onBeforeRender(pageContext: PageContextServer) {
  const queryClient = new QueryClient();

  // 예시: /club/123 경로일 때 클럽 상세 정보 미리 가져오기
  const clubIdMatch = pageContext.urlOriginal.match(/\/club\/(\d+)/);
  if (clubIdMatch) {
    const clubId = clubIdMatch[1];
    await queryClient.prefetchQuery(['clubDetail', clubId], () => getClubDetail(clubId));
  }

  const dehydratedState = dehydrate(queryClient);

  return {
    pageContext: {
      dehydratedState,
    },
  };
}

// renderer/_default.page.client.tsx 와 server.tsx 수정
// App 컴포넌트를 QueryClientProvider로 감싸고,
// 클라이언트에서는 dehydratedState를 이용해 hydrate 합니다.
```

### 6단계: 빌드 및 실행 스크립트 수정

`package.json`의 스크립트를 Vike SSR 환경에 맞게 수정합니다.

1.  **서버 엔트리 포인트 생성 (`server/index.ts`):**
    Express와 같은 서버 프레임워크를 사용하여 Vike 미들웨어를 실행합니다.

    ```typescript
    // server/index.ts
    import express from 'express';
    import { renderPage } from 'vike/server';

    const app = express();
    app.use(express.static('dist/client')); // 클라이언트 에셋 제공

    app.get('*', async (req, res, next) => {
      const pageContext = await renderPage({ urlOriginal: req.originalUrl });
      if (pageContext.httpResponse === null) return next();
      
      const { body, statusCode, headers } = pageContext.httpResponse;
      res.status(statusCode).set(headers).send(body);
    });

    app.listen(3000, () => console.log('Server running at http://localhost:3000'));
    ```

2.  **`package.json` 스크립트 업데이트:**

    ```json
    "scripts": {
      "dev": "npm run server:dev",
      "build": "vite build",
      "server:dev": "ts-node-dev --respawn --transpile-only server/index.ts",
      "server:prod": "node dist/server/index.js",
      "serve": "npm run server:prod"
    },
    ```

    - `vite build`는 `dist/client`와 `dist/server` 두 개의 결과물을 생성합니다.
    - 개발 시에는 `ts-node-dev` 등으로 개발 서버를 실행하고, 프로덕션에서는 빌드된 `dist/server/index.js`를 실행합니다.

## 4. 결론

이 전략을 통해 기존 React Router 기반의 코드베이스를 거의 수정하지 않고도 Vike를 사용한 SSR의 이점(개선된 SEO, 빠른 초기 로딩 속도)을 얻을 수 있습니다. 데이터 페칭 로직(React Query)은 `onBeforeRender`를 통해 서버와 클라이언트에서 모두 효율적으로 처리할 수 있습니다.
