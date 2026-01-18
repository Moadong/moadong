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
    if (result && typeof result === 'object' && 'data' in result) {
      return (result as { data: unknown }).data;
    }
    return result;
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
