import useDevice from '@/hooks/useDevice';
import isInAppWebView from '@/utils/isInAppWebView';
import { requestShare } from '@/utils/webviewBridge';

interface SharePayload {
  title: string;
  text: string;
  url: string;
}

const isRNWebView = isInAppWebView();

const useShare = () => {
  const { isMobile } = useDevice();

  const handleShare = async ({ title, text, url }: SharePayload) => {
    if (isRNWebView) {
      const isSent = requestShare({ title, text, url });
      if (isSent) return;
    }

    const shareData = { text };

    if (isMobile && navigator.share && !isRNWebView) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        try {
          await navigator.clipboard.writeText(text);
          alert('링크가 복사되었습니다.');
        } catch {
          alert('공유하기에 실패했습니다.');
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        alert('링크가 복사되었습니다.');
      } catch {
        alert('공유하기에 실패했습니다.');
      }
    }
  };

  return { handleShare };
};

export default useShare;
