import { promotionHandlers } from './promotion';

// 모든 MSW 핸들러를 여기에 통합
export const handlers = [
  ...promotionHandlers,
  // 다른 핸들러들을 여기에 추가
];
