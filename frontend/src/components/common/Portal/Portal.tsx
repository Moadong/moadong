import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  rootId?: string;
}

const Portal = ({ children, rootId = 'modal-root' }: PortalProps) => {
  const root = document.getElementById(rootId);
  if (!root) return null;
  return createPortal(children, root);
};

export default Portal;
