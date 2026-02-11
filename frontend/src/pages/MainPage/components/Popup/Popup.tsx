import { MouseEvent, useEffect, useState } from 'react';
import AppDownloadImage from '@/assets/images/popup/app-download.svg';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useDevice from '@/hooks/useDevice';
import { detectPlatform, getAppStoreLink } from '@/utils/appStoreLink';
import * as Styled from './Popup.styles';

export const POPUP_STORAGE_KEY = 'mainpage_popup_hidden_date';
export const POPUP_SESSION_KEY = 'mainpage_popup_closed';
export const DAYS_TO_HIDE = 7;

export const isPopupHidden = (): boolean => {
  if (sessionStorage.getItem(POPUP_SESSION_KEY)) return true;

  const hiddenDate = localStorage.getItem(POPUP_STORAGE_KEY);
  if (!hiddenDate) return false;

  const daysSinceHidden =
    (Date.now() - parseInt(hiddenDate)) / (1000 * 60 * 60 * 24);
  return daysSinceHidden < DAYS_TO_HIDE;
};

const Popup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { isMobile } = useDevice();
  const trackEvent = useMixpanelTrack();

  useEffect(() => {
    const img = new Image();
    img.src = AppDownloadImage;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(true);
  }, []);

  useEffect(() => {
    if (!imageLoaded) return;

    const isHidden = isPopupHidden();

    if (isMobile && !isHidden && imageLoaded) {
      setIsOpen(true);
      trackEvent(USER_EVENT.MAIN_POPUP_VIEWED, {
        popupType: 'app_download',
      });
    } else {
      trackEvent(USER_EVENT.MAIN_POPUP_NOT_SHOWN, {
        popupType: 'app_download',
      });
    }
  }, [isMobile, trackEvent, imageLoaded]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = (
    action: 'close_button' | 'backdrop_click' = 'close_button',
  ) => {
    trackEvent(USER_EVENT.MAIN_POPUP_CLOSED, {
      popupType: 'app_download',
      action: action,
    });
    sessionStorage.setItem(POPUP_SESSION_KEY, 'true');
    setIsOpen(false);
  };

  const handleDontShowAgain = () => {
    trackEvent(USER_EVENT.MAIN_POPUP_CLOSED, {
      popupType: 'app_download',
      action: 'dont_show_again',
    });
    localStorage.setItem(POPUP_STORAGE_KEY, Date.now().toString());
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
      handleClose('backdrop_click');
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
            <Styled.Button onClick={() => handleClose()}>닫기</Styled.Button>
          </Styled.ButtonGroup>
        </Styled.Container>
      </Styled.ModalContainer>
    </Styled.Overlay>
  );
};

export default Popup;
