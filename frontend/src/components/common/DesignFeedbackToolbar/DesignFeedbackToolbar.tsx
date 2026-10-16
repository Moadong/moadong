import { lazy, Suspense } from 'react';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import isInAppWebView from '@/utils/isInAppWebView';

// 일반 사용자 번들에 들어가지 않게 별도 청크로 분리한다.
// 배포 직후 옛 탭에서 청크 404가 나도 앱 전체 에러 화면으로 번지지 않게 툴바만 포기한다.
const Agentation = lazy(() =>
  import('agentation')
    .then((m) => ({ default: m.Agentation }))
    .catch(() => ({ default: () => null })),
);

/** agentation이 자기 설정을 담아 두는 키. 우리 STORAGE_KEYS가 아니라 그쪽 소유다 */
const TOOLBAR_SETTINGS_KEY = 'feedback-toolbar-settings';

// `?design=1`로 켜고 `?design=0`으로 끈다. 쿼리가 없으면 저장된 값을 따른다.
// 저장소가 막힌 브라우저(사파리 프라이빗 등)에서 setItem이 던지면 툴바만 포기한다.
const resolveEnabled = () => {
  try {
    const flag = new URLSearchParams(window.location.search).get('design');
    if (flag === '1') localStorage.setItem(STORAGE_KEYS.DESIGN_FEEDBACK, '1');
    if (flag === '0') localStorage.removeItem(STORAGE_KEYS.DESIGN_FEEDBACK);
    const enabled = localStorage.getItem(STORAGE_KEYS.DESIGN_FEEDBACK) === '1';
    // 기본값 standard로는 프로덕션 빌드에서 요소를 특정할 단서가 남지 않는다. detailed라야
    // `**Classes:**` 줄에 styled 파일명·변수명이 온전히 실린다. 직접 바꾼 설정은 덮지 않는다.
    if (enabled && localStorage.getItem(TOOLBAR_SETTINGS_KEY) === null) {
      localStorage.setItem(
        TOOLBAR_SETTINGS_KEY,
        JSON.stringify({ outputDetail: 'detailed' }),
      );
    }
    return enabled;
  } catch {
    return false;
  }
};

const ISSUE_FORM_URL =
  'https://github.com/Moadong/moadong/issues/new?template=design-feedback.yml';

// 실측(2026-09-30): feedback 값이 7,000자쯤부터 500, 8,200자부터 414가 난다. 넉넉히 아래로 끊는다.
// 한글은 encodeURIComponent를 거치며 한 자가 9자로 부푸니 인코딩한 뒤 길이로 재야 한다.
const MAX_ISSUE_URL_LENGTH = 6000;

const TRUNCATED_NOTE =
  '\n\n…(길어서 여기까지만 담겼어요. 클립보드에 전체 내용이 있으면 위 내용을 지우고 붙여넣어 주세요)';

/** 한계를 넘으면 남길 글자 수를 이 비율로 줄여 가며 다시 잰다 */
const TRUNCATE_STEP_RATIO = 0.9;

const buildIssueUrl = (feedback: string) =>
  `${ISSUE_FORM_URL}&feedback=${encodeURIComponent(feedback)}`;

// 복사 버튼을 누르면 이슈 폼을 채워서 연다. 디자이너가 GitHub에서 폼을 찾아 붙여넣는 과정을 없앤다.
// 너무 길면 앞부분만 담는다. agentation은 클립보드 쓰기가 실패해도 onCopy를 부르므로,
// 빈 폼을 열면 클립보드까지 실패한 경우 피드백이 통째로 사라진다.
const openIssueForm = (markdown: string) => {
  let url = buildIssueUrl(markdown);
  // 코드 포인트 단위로 자른다. 서로게이트 쌍(이모지)이 반으로 갈리면 encodeURIComponent가 던진다.
  const chars = Array.from(markdown);
  let keep = chars.length;
  while (url.length > MAX_ISSUE_URL_LENGTH && keep > 0) {
    keep = Math.floor(keep * TRUNCATE_STEP_RATIO);
    url = buildIssueUrl(chars.slice(0, keep).join('') + TRUNCATED_NOTE);
  }
  window.open(url, '_blank', 'noopener');
};

const DesignFeedbackToolbar = () => {
  const enabled = resolveEnabled();
  if (!enabled || isInAppWebView()) return null;

  return (
    <Suspense fallback={null}>
      <Agentation onCopy={openIssueForm} />
    </Suspense>
  );
};

export default DesignFeedbackToolbar;
