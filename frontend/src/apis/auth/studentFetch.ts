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

/** 서버가 sub로 받아주는 형식. 다른 값은 400이라 보내봐야 새 신원이 된다 */
const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * 토큰이 담고 있는 신원(sub)을 서명 검증 없이 읽는다.
 * 우체통 신원은 토큰 안에만 있어서, 서버가 토큰을 거부해도(서명 키 교체) 여기서 꺼낸 sub로
 * 같은 신원을 다시 발급받을 수 있다. 값의 진위는 어차피 서버가 판단한다.
 */
const getTokenSubject = (token: string) => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return undefined;

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const { sub } = JSON.parse(
      atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')),
    );

    return typeof sub === 'string' && UUID_V4.test(sub) ? sub : undefined;
  } catch {
    return undefined;
  }
};

/**
 * 우체통은 로그인 없이 쓰지만 '내가 보낸 편지'를 구분해야 해서 익명 학생 토큰을 쓴다.
 * 토큰에 만료가 없으므로 관리자용 secureFetch와 달리 refresh 흐름이 없다.
 *
 * sub를 함께 보내면 서버가 그 신원으로 다시 발급한다. 안 보내면 새 신원이라 편지함이 비어 보인다.
 */
const issueStudentToken = async (sub?: string) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/auth/student`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sub }),
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
const issueStudentTokenOnce = (sub?: string) => {
  // 합쳐진 발급은 먼저 시작한 쪽의 sub를 따른다. 동시에 401을 받는 요청들은
  // 같은 토큰을 쓰고 있었으므로 sub도 같다.
  issuing ??= issueStudentToken(sub).finally(() => {
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
  // 거부된 토큰의 sub로 재발급해 신원을 잇는다. 이게 없으면 서명 키를 한 번 교체할 때
  // 전 사용자가 같은 날 편지함을 잃는다.
  const reissuedToken =
    !wasInjected && storedToken && storedToken !== token
      ? storedToken
      : await issueStudentTokenOnce(getTokenSubject(token));

  return fetchWithTimeout(
    input,
    withAuthorization(init, reissuedToken),
    timeoutMs,
  );
};
