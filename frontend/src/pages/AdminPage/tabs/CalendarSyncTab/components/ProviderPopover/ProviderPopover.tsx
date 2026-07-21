import { ReactNode, useEffect, useRef, useState } from 'react';
import * as Styled from './ProviderPopover.styles';

interface ProviderPopoverProps {
  label: string;
  connected: boolean;
  icon: ReactNode;
  children: ReactNode;
  onDisconnect?: () => void;
}

const ProviderPopover = ({
  label,
  connected,
  icon,
  children,
  onDisconnect,
}: ProviderPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen]);

  return (
    <Styled.Root ref={rootRef}>
      <Styled.IconButton
        type='button'
        $connected={connected}
        aria-label={label}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {icon}
        <Styled.StatusDot $connected={connected} />
      </Styled.IconButton>
      {connected && onDisconnect && (
        <Styled.DisconnectBadge
          type='button'
          aria-label={`${label} 연동 해제`}
          onClick={(e) => {
            e.stopPropagation();
            onDisconnect();
          }}
        >
          <svg width='7' height='7' viewBox='0 0 8 8' aria-hidden='true'>
            <path
              d='M1 1L7 7M7 1L1 7'
              stroke='currentColor'
              strokeWidth='1.8'
              strokeLinecap='round'
            />
          </svg>
        </Styled.DisconnectBadge>
      )}
      {isOpen && <Styled.Panel>{children}</Styled.Panel>}
    </Styled.Root>
  );
};

export default ProviderPopover;
