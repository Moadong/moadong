import { NetworkError } from '@/errors';

const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * AbortController 기반 타임아웃을 붙인 fetch 래퍼.
 * - 응답이 timeoutMs 안에 오지 않으면 요청을 중단하고 NetworkError를 던진다.
 *   (서버 워커가 죽어 응답이 멈추는 경우 무한 로딩을 방지)
 * - 네트워크 연결 자체가 실패(TypeError)한 경우도 NetworkError로 변환해
 *   에러 바운더리/Sentry가 일관되게 처리할 수 있게 한다.
 */
export const fetchWithTimeout = async (
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // 호출부가 넘긴 signal(컴포넌트 언마운트 등)을 타임아웃 signal과 병합한다.
  const externalSignal = init.signal;
  const onExternalAbort = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else {
      externalSignal.addEventListener('abort', onExternalAbort);
    }
  }

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      // 호출부의 의도된 취소는 타임아웃이 아니므로 원본 에러를 그대로 전파한다.
      if (externalSignal?.aborted) {
        throw error;
      }
      throw new NetworkError(
        '요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.',
      );
    }
    // fetch는 네트워크 연결 실패(서버 다운, 커넥션 거부 등) 시 TypeError를 던진다.
    if (error instanceof TypeError) {
      throw new NetworkError();
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
    externalSignal?.removeEventListener('abort', onExternalAbort);
  }
};
