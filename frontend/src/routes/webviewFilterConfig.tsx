import { ComponentType } from 'react';
import BuskingPage from '@/pages/FestivalPage/BuskingPage/BuskingPage';
import PromotionListPage from '@/pages/PromotionPage/PromotionListPage';
import WebviewMainPage from '@/pages/WebviewMainPage/WebviewMainPage';

interface WebviewFilterItem {
  label: string;
  path: string;
  component: ComponentType;
}

export const WEBVIEW_FILTER_CONFIG: WebviewFilterItem[] = [
  { label: '동아리', path: '/webview/main', component: WebviewMainPage },
  { label: '홍보', path: '/webview/promotions', component: PromotionListPage },
  {
    label: '대동제',
    path: '/webview/festival-busking',
    component: BuskingPage,
  },
];
