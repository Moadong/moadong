import React, { useState } from 'react';
import ShareModal from '../ShareModal/ShareModal';

interface ShareButtonProps {
  url: string;
  title: string;
  text?: string;
  buttonText?: string;
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ 
  url, 
  title, 
  text, 
  buttonText = '공유하기',
  className = ''
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  
  const isWebShareSupported = typeof navigator !== 'undefined' && 'share' in navigator;

  const handleShare = async (): Promise<void> => {
    if (isWebShareSupported) {
      try {
        await navigator.share({ title, text, url });
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('공유 실패:', error.message);
          setShowModal(true);
        }
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button 
        onClick={handleShare}
        className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${className}`}
      >
        {buttonText}
      </button>
      
      <ShareModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        shareData={{ url, title, text }}
      />
    </>
  );
};


export default ShareButton;
