import { useState } from 'react';

export const usePhotoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const open = (i: number) => {
    setIndex(i);
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  return { isOpen, index, open, close, setIndex };
};
