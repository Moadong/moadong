import { MouseEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useDevice from '@/hooks/useDevice';
import { isPopupHidden, PopupConfig } from '@/utils/popupUtils';
import * as Styled from './Popup.styles';

interface PopupProps {
  configs: PopupConfig[];
}

const Popup = ({ configs }: PopupProps) => {
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();
  const { isMobile } = useDevice();
  const [activeConfig, setActiveConfig] = useState<PopupConfig | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const eligible = configs.find((config) => {
      if (config.mobileOnly && !isMobile) return false;
      return !isPopupHidden(config);
    });
    setActiveConfig(eligible ?? null);
  }, [configs, isMobile]);

  useEffect(() => {
    if (!activeConfig) return;
    setImageLoaded(false);
    const img = new Image();
    img.src = activeConfig.image;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(true);
  }, [activeConfig]);

  useEffect(() => {
    if (!imageLoaded || !activeConfig) return;
    setIsOpen(true);
    trackEvent(USER_EVENT.MAIN_POPUP_VIEWED, { popupType: activeConfig.id });
  }, [imageLoaded, activeConfig, trackEvent]);

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
    if (!activeConfig) return;
    trackEvent(USER_EVENT.MAIN_POPUP_CLOSED, {
      popupType: activeConfig.id,
      action,
    });
    sessionStorage.setItem(activeConfig.sessionKey, 'true');
    setIsOpen(false);
  };

  const handleDontShowAgain = () => {
    if (!activeConfig) return;
    trackEvent(USER_EVENT.MAIN_POPUP_CLOSED, {
      popupType: activeConfig.id,
      action: 'dont_show_again',
    });
    localStorage.setItem(activeConfig.storageKey, Date.now().toString());
    setIsOpen(false);
  };

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose('backdrop_click');
  };

  if (!isOpen || !activeConfig) return null;

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
          <Styled.ImageWrapper
            onClick={() => {
              activeConfig.onImageClick?.(trackEvent);
              if (activeConfig.to) navigate(activeConfig.to);
            }}
          >
            <Styled.PopupImage
              src={activeConfig.image}
              alt={activeConfig.imageAlt}
            />
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
