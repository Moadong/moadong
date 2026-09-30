export const PROMOTION_LIST_PATH = '/admin/promotion';

/** 백엔드 902-2와 같은 문구. 심사 전 동아리는 서버에서도 403으로 막힌다 */
export const PROMOTION_NOT_APPROVED_MESSAGE =
  '심사가 완료된 동아리만 홍보 게시글을 작성할 수 있습니다.';

/** 심사 완료 여부. 상세·목록 API 모두 ClubState enum 이름('AVAILABLE'/'UNAVAILABLE')을 준다 (백엔드 #2013에서 통일) */
export const isClubApproved = (state: string | undefined) =>
  state === 'AVAILABLE';

/** 알림 발송은 운영진이 수동으로 처리한다. 관리자는 오픈채팅(오른쪽 하단 문의 버튼)으로 요청해야 한다 */
export const PROMOTION_ALERT_EMPTY_GUIDE =
  '이벤트를 만들면 알림을 보낼 수 있어요! 오른쪽 하단 버튼을 클릭해 저희에게 문의해주세요!';

export const PROMOTION_ALERT_GUIDE =
  '이벤트 알림을 보내려면 오른쪽 하단 버튼을 클릭해 저희에게 문의해주세요!';
