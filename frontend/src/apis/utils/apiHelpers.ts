export const handleResponse = async <T = unknown>(
  response: Response,
  customErrorMessage?: string,
): Promise<T | undefined> => {
  if (!response.ok) {
    if (customErrorMessage) {
      throw new Error(customErrorMessage);
    }

    let message = response.statusText;
    try {
      const errorData = await response.json();
      if (errorData?.message) {
        message = errorData.message;
      }
    } catch {
      // JSON 파싱 실패시 statusText 사용
    }
    throw new Error(message);
  }

  const contentType = response.headers.get('content-type');
  const contentLength = response.headers.get('content-length');

  if (contentLength === '0' || !contentType?.includes('application/json')) {
    return undefined;
  }
  const text = await response.text();
  if (!text) {
    return undefined;
  }

  try {
    const result = JSON.parse(text);
    // wrapped 형식({ data: {...} })인 경우 data를 unwrap
    // 단, data가 null/undefined가 아닌 유효한 값일 때만
    if (
      result &&
      typeof result === 'object' &&
      'data' in result &&
      result.data !== null &&
      result.data !== undefined
    ) {
      return result.data as T;
    }
    return result as T;
  } catch {
    return undefined;
  }
};

export const withErrorHandling = async <T>(
  apiCall: () => Promise<T>,
  errorMessage: string,
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error) {
    console.error(errorMessage, error);
    throw error;
  }
};
