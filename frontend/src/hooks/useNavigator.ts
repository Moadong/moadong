import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const useNavigator = () => {
  const navigate = useNavigate();

  const handleLink = useCallback(
    (url: string) => {
      const trimmedUrl = url?.trim();
      if (!trimmedUrl) return;

      const isExternalUrl = trimmedUrl.startsWith('https://');

      if (isExternalUrl) {
        window.open(trimmedUrl, '_blank', 'noopener,noreferrer');
      } else {
        navigate(trimmedUrl);
      }
    },
    [navigate],
  );

  return handleLink;
};

export default useNavigator;
