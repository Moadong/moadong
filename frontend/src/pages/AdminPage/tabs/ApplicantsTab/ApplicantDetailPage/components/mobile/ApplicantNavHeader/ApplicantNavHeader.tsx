import { useRef, useState } from 'react';
import * as Styled from './ApplicantNavHeader.styles';

export interface ApplicantNavItem {
  id: string;
  name: string;
}

interface ApplicantNavHeaderProps {
  applicants: ApplicantNavItem[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (id: string) => void;
}

const LIST_MAX_HEIGHT = 146;
const ITEM_HEIGHT = 40;
const THUMB_HEIGHT = 60;

const ApplicantNavHeader = ({
  applicants,
  currentIndex,
  onPrev,
  onNext,
  onSelect,
}: ApplicantNavHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [thumbOffset, setThumbOffset] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const current = applicants[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < applicants.length - 1;
  const hasScroll = applicants.length * ITEM_HEIGHT > LIST_MAX_HEIGHT;

  const handleSelect = (id: string) => {
    onSelect(id);
    setIsOpen(false);
  };

  const handleScroll = () => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    const maxScroll = scrollHeight - clientHeight;
    const maxOffset = LIST_MAX_HEIGHT - THUMB_HEIGHT;
    setThumbOffset(maxScroll > 0 ? (scrollTop / maxScroll) * maxOffset : 0);
  };

  return (
    <Styled.Container>
      <Styled.NavButton
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        disabled={!hasPrev}
        aria-label='이전 지원자'
      >
        <Styled.PrevIcon $disabled={!hasPrev} />
      </Styled.NavButton>

      <Styled.Center onClick={() => setIsOpen((prev) => !prev)}>
        <Styled.ApplicantName>{current?.name ?? '-'}</Styled.ApplicantName>
        <Styled.ChevronIcon $isOpen={isOpen} />
      </Styled.Center>

      <Styled.NavButton
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        disabled={!hasNext}
        aria-label='다음 지원자'
      >
        <Styled.NextIcon $disabled={!hasNext} />
      </Styled.NavButton>

      {isOpen && (
        <Styled.Dropdown $hasScroll={hasScroll}>
          <Styled.DropdownList
            ref={listRef}
            $hasScroll={hasScroll}
            $maxHeight={LIST_MAX_HEIGHT}
            onScroll={handleScroll}
          >
            {applicants.map((applicant, index) => (
              <Styled.DropdownItem
                key={applicant.id}
                $isSelected={index === currentIndex}
                onClick={() => handleSelect(applicant.id)}
              >
                {applicant.name}
              </Styled.DropdownItem>
            ))}
          </Styled.DropdownList>
          {hasScroll && (
            <Styled.ScrollbarTrack $height={LIST_MAX_HEIGHT}>
              <Styled.ScrollbarThumb $offset={thumbOffset} />
            </Styled.ScrollbarTrack>
          )}
        </Styled.Dropdown>
      )}
    </Styled.Container>
  );
};

export default ApplicantNavHeader;
