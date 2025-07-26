import { useCallback, useEffect, useState } from 'react';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';

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
    trackEvent('Mobile Menubar delete Button Clicked');
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
