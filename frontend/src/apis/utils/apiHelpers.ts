export const handleResponse = async (
  response: Response,
  customErrorMessage?: string,
) => {
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

  // 응답이 비어있거나 JSON이 아닌 경우 처리
  const contentType = response.headers.get('content-type');
  const contentLength = response.headers.get('content-length');
  
  // Content-Length가 0이거나 Content-Type이 JSON이 아니면 undefined 반환
  if (contentLength === '0' || !contentType?.includes('application/json')) {
    return undefined;
  }

  // 응답 본문이 있는지 확인
  const text = await response.text();
  if (!text) {
    return undefined;
  }

  try {
    const result = JSON.parse(text);
    return result.data;
  } catch {
    // JSON 파싱 실패 시 undefined 반환
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
