import { handleResponse } from '@/apis/utils/apiHelpers';
import { fetchWithTimeout } from '@/apis/utils/fetchWithTimeout';
import API_BASE_URL from '@/constants/api';
import { STORAGE_KEYS } from '@/constants/storageKeys';

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
 * 우체통은 소셜 로그인 필수. 익명 토큰은 구버전 앱·브라우저 호환 폴백.
 * 토큰에 만료가 없으므로(익명 토큰 한정) 관리자용 secureFetch와 달리 refresh 흐름이 없다.
 *
 * sub를 함께 보내면 서버가 그 신원으로 다시 발급한다. 안 보내면 새 신원이라 편지함이 비어 보인다.
 * 서버가 sub를 소문자로 정규화하므로 보낸 값을 신원으로 기억하면 안 된다. 토큰만 저장하고
 * 신원이 필요하면 그때 토큰에서 다시 읽는다.
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
 * 소셜 로그인 토큰을 우선 사용한다. 없으면 익명 학생 토큰으로 폴백한다(구버전 앱·브라우저 호환).
 */
const getStudentToken = async () => {
  return (
    localStorage.getItem(STORAGE_KEYS.STUDENT_LOGIN_ACCESS_TOKEN) ??
    localStorage.getItem(STORAGE_KEYS.STUDENT_ACCESS_TOKEN) ??
    (await issueStudentTokenOnce())
  );
};

/**
 * 호출자가 headers를 Headers 인스턴스나 [key, value] 배열로 줄 수도 있다.
 * 객체 전개로는 그 두 형식이 통째로 사라지므로 Headers로 정규화한 뒤 Authorization만 얹는다.
 */
const withAuthorization = (init: RequestInit | undefined, token: string) => {
  const headers = new Headers(init?.headers);
  headers.set('Authorization', `Bearer ${token}`);

  return { ...init, headers };
};

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

  if (response.status !== 401) return response;

  // OAuth 토큰이 만료된 경우 — 제거하고 재로그인을 유도한다.
  // studentFetch는 refresh 흐름이 없어서 만료된 채로 두면 요청마다 401이 반복된다.
  const oauthToken = localStorage.getItem(
    STORAGE_KEYS.STUDENT_LOGIN_ACCESS_TOKEN,
  );
  if (token === oauthToken) {
    localStorage.removeItem(STORAGE_KEYS.STUDENT_LOGIN_ACCESS_TOKEN);
    throw new Error('STUDENT_OAUTH_EXPIRED');
  }

  // 저장된 익명 토큰이 무효할 수 있다(서명 키 교체 등).
  // 한 번만 재발급해 재시도한다. 안 그러면 localStorage를 비우기 전까지 계속 실패한다.
  //
  // 다른 요청이 이미 재발급을 끝냈으면 그 토큰을 쓴다.
  // 401이 순차로 오면 issueStudentTokenOnce가 각각 새로 발급해 신원이 갈린다.
  const storedToken = localStorage.getItem(STORAGE_KEYS.STUDENT_ACCESS_TOKEN);
  // 거부된 토큰의 sub로 재발급해 신원을 잇는다. 이게 없으면 서명 키를 한 번 교체할 때
  // 전 사용자가 같은 날 편지함을 잃는다.
  const reissuedToken =
    storedToken && storedToken !== token
      ? storedToken
      : await issueStudentTokenOnce(getTokenSubject(token));

  return fetchWithTimeout(
    input,
    withAuthorization(init, reissuedToken),
    timeoutMs,
  );
};
