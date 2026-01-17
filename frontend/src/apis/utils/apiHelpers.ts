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
  const result = await response.json();
  return result.data;
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
