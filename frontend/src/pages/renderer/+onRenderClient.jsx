export default onRenderClient;

import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import {
  initializeMixpanel,
  initializeChannelService,
  initializeSentry,
  initializeKakaoSDK,
} from '@/utils/initSDK.ts';

initializeMixpanel();
initializeChannelService();
initializeSentry();
initializeKakaoSDK();

async function onRenderClient(pageContext) {
  const { Page } = pageContext;
  hydrateRoot(
    document.getElementById('root'),
    <BrowserRouter>
      <Page {...pageContext.pageProps} />
    </BrowserRouter>,
  );
}
