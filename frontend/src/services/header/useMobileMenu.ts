import { useCallback, useEffect, useState } from 'react';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import { EVENT_NAME } from '@/constants/eventName';

interface MobileMenuProp {
  handleMenuClick: () => void;
}

const useMobileMenu = ({ handleMenuClick }: MobileMenuProp) => {
  const trackEvent = useMixpanelTrack();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = () => {
    handleMenuClick();
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    trackEvent(EVENT_NAME.MOBILE_MENU_DELETE_BUTTON_CLICKED);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    if (isMenuOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isMenuOpen, closeMenu]);

  return { isMenuOpen, openMenu, closeMenu };
};

export default useMobileMenu;
