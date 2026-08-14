/** 앱 스토어 식별자. 앱 레포의 force-update-dialog와 같은 값이다 */
const IOS_APP_ID = '6755062085';
const ANDROID_PACKAGE = 'com.moadong.moadong';

/**
 * 리뷰 작성 화면 딥링크.
 *
 * `itms-apps://`가 아니라 https를 쓴다. 앱이 OPEN_EXTERNAL_URL을
 * WebBrowser.openBrowserAsync로 처리하는데 이건 http(s)만 연다.
 * iOS는 https App Store 링크를 스토어 앱으로 전환해준다.
 */
export const APP_STORE_REVIEW_URL = `https://apps.apple.com/kr/app/id${IOS_APP_ID}?action=write-review`;
export const PLAY_STORE_REVIEW_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;

/**
 * 만족도를 묻기 전에 필요한 방문일 수 또는 동아리 조회 수.
 * 충분히 써보지 않은 사용자에게 물으면 답도 부정확하고 이탈만 늘어난다.
 *
 * 실행 횟수가 아니라 방문한 '날'을 세는 이유는, 하루에 몇 번 켠 사람은
 * 아직 써본 것이 아니기 때문이다. 하루 만에 임계값을 채울 수 없다.
 */
export const SATISFACTION_ASK_THRESHOLD = 3;
