export const PROMOTION_LIST_PATH = '/admin/promotion';

/** 백엔드 902-2와 같은 문구. 심사 전 동아리는 서버에서도 403으로 막힌다 */
export const PROMOTION_NOT_APPROVED_MESSAGE =
  '심사가 완료된 동아리만 홍보 게시글을 작성할 수 있습니다.';

/** 심사 완료 여부. 상세·목록 API 모두 ClubState enum 이름('AVAILABLE'/'UNAVAILABLE')을 준다 (백엔드 #2013에서 통일) */
export const isClubApproved = (state: string | undefined) =>
  state === 'AVAILABLE';
