import mixpanel from 'mixpanel-browser';

/**
 * 종료된 `main_redesign` 실험이 남긴 흔적을 지운다.
 *
 * super property는 mixpanel이 자기 localStorage에 영구 보관하므로 실험 코드를
 * 지우는 것만으로는 사라지지 않는다. unregister를 부르지 않으면 실험이 끝난 뒤에도
 * 기존 방문자의 모든 이벤트에 `main_redesign`이 계속 따라붙어 데이터가 오염된다.
 *
 * 기존 방문자가 한 번씩 재방문하면 역할이 끝나므로 두어 릴리스 뒤 삭제해도 된다.
 */
const RETIRED_SUPER_PROPERTIES = [
  'main_redesign',
  'experiment_storage_blocked',
  'experiment_definition_changed',
];

const RETIRED_ASSIGNMENT_KEY = 'moadong_experiments';

export const cleanupMainRedesignExperiment = () => {
  RETIRED_SUPER_PROPERTIES.forEach((property) => mixpanel.unregister(property));

  try {
    localStorage.removeItem(RETIRED_ASSIGNMENT_KEY);
  } catch {
    // 저장소 접근이 막힌 방문에는 지울 배정도 없다
  }
};
