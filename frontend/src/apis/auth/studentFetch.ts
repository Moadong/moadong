import { handleResponse } from '@/apis/utils/apiHelpers';
import { fetchWithTimeout } from '@/apis/utils/fetchWithTimeout';
import API_BASE_URL from '@/constants/api';
import { STORAGE_KEYS } from '@/constants/storageKeys';

declare global {
  interface Window {
    /** 앱 웹뷰가 injectedJavaScriptBeforeContentLoaded로 넣어주는 학생 토큰 */
    __MOADONG_STUDENT_TOKEN__?: string;
  }
}

/**
 * 우체통은 로그인 없이 쓰지만 '내가 보낸 편지'를 구분해야 해서 익명 학생 토큰을 쓴다.
 * 토큰에 만료가 없으므로 관리자용 secureFetch와 달리 refresh 흐름이 없다.
 */
const issueStudentToken = async () => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/auth/student`, {
    method: 'POST',
  });
  const data = await handleResponse<{ accessToken: string }>(
    response,
    '학생 토큰 발급에 실패했습니다.',
  );

  if (!data?.accessToken) {
    throw new Error('학생 토큰 발급 응답에 accessToken이 없습니다.');
  }

  localStorage.setItem(STORAGE_KEYS.STUDENT_ACCESS_TOKEN, data.accessToken);

  return data.accessToken;
};

let issuing: Promise<string> | null = null;

/**
 * 발급을 한 번으로 합친다.
 * 목록 화면처럼 요청이 동시에 나가면 각자 발급받게 되는데, 발급마다 새 UUID라
 * 학생 신원이 갈리고 마지막에 저장된 것만 남는다. 그러면 먼저 보낸 편지가 조회되지 않는다.
 */
const issueStudentTokenOnce = () => {
  issuing ??= issueStudentToken().finally(() => {
    issuing = null;
  });

  return issuing;
};

/**
 * 서버가 거부한 주입 토큰. 앱이 새 토큰을 넣어주면 값이 달라져 다시 후보가 된다.
 * 기록해 두지 않으면 요청마다 같은 토큰으로 401을 받고 매번 새로 발급하게 되는데,
 * 발급마다 신원이 갈려서 방금 보낸 편지가 다음 조회에서 안 보인다.
 */
let rejectedInjectedToken: string | undefined;

/**
 * 앱 웹뷰가 주입해 주는 토큰을 가장 먼저 쓴다.
 * 웹이 따로 발급하면 앱과 신원이 갈려 답장 푸시가 대상을 못 찾는다.
 * 앱이 안 넣어주는 환경(브라우저, 구버전 앱)에서는 undefined라 기존 흐름 그대로다.
 */
const getStudentToken = async () => {
  const injectedToken = window.__MOADONG_STUDENT_TOKEN__;

  return (
    (injectedToken === rejectedInjectedToken ? undefined : injectedToken) ??
    localStorage.getItem(STORAGE_KEYS.STUDENT_ACCESS_TOKEN) ??
    (await issueStudentTokenOnce())
  );
};

const withAuthorization = (init: RequestInit | undefined, token: string) => ({
  ...init,
  headers: {
    ...(init?.headers || {}),
    Authorization: `Bearer ${token}`,
  },
});

export const studentFetch = async (
  input: RequestInfo,
  init?: RequestInit,
  timeoutMs?: number,
): Promise<Response> => {
  const token = await getStudentToken();

  const response = await fetchWithTimeout(
    input,
    withAuthorization(init, token),
    timeoutMs,
  );

  // 만료는 없지만 저장된 토큰이 무효할 수 있다(환경 변경, 서명 키 교체).
  // 한 번만 재발급해 재시도한다. 안 그러면 localStorage를 비우기 전까지 계속 실패한다.
  if (response.status !== 401) return response;

  // 다른 요청이 이미 재발급을 끝냈으면 그 토큰을 쓴다.
  // 401이 순차로 오면 issueStudentTokenOnce가 각각 새로 발급해 신원이 갈린다.
  //
  // 단 주입 토큰이 거부된 경우는 제외한다. 저장분은 앱과 무관한 옛 토큰이라 재시도해도
  // 같이 실패한다. 이때는 앱과 신원을 맞출 방법이 없어 자체 발급으로 폴백한다.
  const wasInjected = token === window.__MOADONG_STUDENT_TOKEN__;
  if (wasInjected) rejectedInjectedToken = token;

  const storedToken = localStorage.getItem(STORAGE_KEYS.STUDENT_ACCESS_TOKEN);
  const reissuedToken =
    !wasInjected && storedToken && storedToken !== token
      ? storedToken
      : await issueStudentTokenOnce();

  return fetchWithTimeout(
    input,
    withAuthorization(init, reissuedToken),
    timeoutMs,
  );
};
