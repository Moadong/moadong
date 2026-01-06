import { MouseEvent, useEffect, useState } from 'react';
import AppDownloadImage from '@/assets/images/popup/app-download.svg';
import { USER_EVENT } from '@/constants/eventName';
import useDevice from '@/hooks/useDevice';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import { detectPlatform, getAppStoreLink } from '@/utils/appStoreLink';
import * as Styled from './Popup.styles';

const POPUP_STORAGE_KEY = 'mainpage_popup_hidden';

const Popup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useDevice();
  const trackEvent = useMixpanelTrack();

  useEffect(() => {
    const isHidden = localStorage.getItem(POPUP_STORAGE_KEY);

    if (isMobile && !isHidden) {
      setIsOpen(true);
      trackEvent(USER_EVENT.MAIN_POPUP_VIEWED, {
        popupType: 'app_download',
      });
    }
  }, [isMobile, trackEvent]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    trackEvent(USER_EVENT.MAIN_POPUP_CLOSED, {
      popupType: 'app_download',
      action: 'close_button',
    });
    setIsOpen(false);
  };

  const handleDontShowAgain = () => {
    trackEvent(USER_EVENT.MAIN_POPUP_CLOSED, {
      popupType: 'app_download',
      action: 'dont_show_again',
    });
    localStorage.setItem(POPUP_STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  const handleDownload = () => {
    const storeLink = getAppStoreLink();
    trackEvent(USER_EVENT.APP_DOWNLOAD_POPUP_CLICKED, {
      popupType: 'app_download',
      platform: detectPlatform(),
    });
    window.open(storeLink, '_blank');
  };

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      trackEvent(USER_EVENT.MAIN_POPUP_CLOSED, {
        popupType: 'app_download',
        action: 'backdrop_click',
      });
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Styled.Overlay
      isOpen={isOpen}
      onClick={handleBackdropClick}
      aria-modal='true'
    >
      <Styled.ModalContainer
        isOpen={isOpen}
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <Styled.Container>
          <Styled.ImageWrapper onClick={handleDownload}>
            <Styled.PopupImage src={AppDownloadImage} alt='모아동 앱 출시' />
          </Styled.ImageWrapper>

          <Styled.ButtonGroup>
            <Styled.Button onClick={handleDontShowAgain}>
              다시 보지 않기
            </Styled.Button>
            <Styled.Button onClick={handleClose}>닫기</Styled.Button>
          </Styled.ButtonGroup>
        </Styled.Container>
      </Styled.ModalContainer>
    </Styled.Overlay>
  );
};

export default Popup;
