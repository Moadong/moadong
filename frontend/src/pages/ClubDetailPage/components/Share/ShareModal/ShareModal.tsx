import React from 'react';
import { createPortal } from 'react-dom';
import * as styles from './ShareModal.styles';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareData: {
    url: string;
    title: string;
    text?: string;
  };
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, shareData }) => {
  const copyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      alert('링크가 복사되었습니다');
    } catch (error) {
      console.error('복사 실패:', error);
    }
  };

  const shareToSocial = (platform: string): void => {
    const encodedUrl = encodeURIComponent(shareData.url);
    const encodedTitle = encodeURIComponent(shareData.title);
    const encodedText = encodeURIComponent(shareData.text || '');
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        navigator.clipboard.writeText(shareData.url);
        alert('링크가 복사되었습니다. 페이스북 앱에서 붙여넣기 해주세요.');
        shareUrl = `https://www.facebook.com/sharer.php?u=${encodedUrl}`;
        break;
      case 'x': 
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'instagram':
        navigator.clipboard.writeText(shareData.url);
        alert('링크가 복사되었습니다. 인스타그램 앱에서 붙여넣기 해주세요.');
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div style={styles.overlayStyle} onClick={onClose}>
      <div style={styles.modalContainerStyle} onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div style={styles.headerStyle}>
          <h3 style={styles.titleStyle}>공유하기</h3>
          <button onClick={onClose} style={styles.closeButtonStyle}>
            ✕
          </button>
        </div>
        
        {/* 공유 버튼들 */}
        <div style={styles.buttonContainerStyle}>
          <button onClick={() => shareToSocial('facebook')} style={styles.shareButtonStyle}>
            📘 Facebook에서 공유
          </button>
          
          <button onClick={() => shareToSocial('x')} style={styles.shareButtonStyle}>
            ❌ X(Twitter)에서 공유
          </button>
          
          <button onClick={() => shareToSocial('instagram')} style={styles.shareButtonStyle}>
            📷 Instagram에서 공유
          </button>
        </div>
        
        {/* 링크 복사 */}
        <div>
          <label style={styles.linkCopyContainerStyle}>
            링크 복사
          </label>
          <div style={styles.inputContainerStyle}>
            <input 
              type="text" 
              value={shareData.url} 
              readOnly 
              style={styles.inputStyle}
            />
            <button onClick={copyToClipboard} style={styles.copyButtonStyle}>
              복사
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ShareModal;
