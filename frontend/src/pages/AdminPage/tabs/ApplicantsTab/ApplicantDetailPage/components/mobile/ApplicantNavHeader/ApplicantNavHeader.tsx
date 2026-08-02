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

const ITEM_HEIGHT = 44;
const VISIBLE_COUNT = 3;
const TRACK_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT;
const THUMB_HEIGHT = 48;

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
  const hasScroll = applicants.length > VISIBLE_COUNT;

  const handleSelect = (id: string) => {
    onSelect(id);
    setIsOpen(false);
  };

  const handleScroll = () => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    const maxScroll = scrollHeight - clientHeight;
    const maxOffset = TRACK_HEIGHT - THUMB_HEIGHT;
    setThumbOffset(maxScroll > 0 ? (scrollTop / maxScroll) * maxOffset : 0);
  };

  return (
    <Styled.Wrapper>
      <Styled.NavButton
        onClick={onPrev}
        disabled={!hasPrev}
        aria-label='이전 지원자'
      >
        <Styled.PrevIcon />
      </Styled.NavButton>

      <Styled.SelectorWrapper>
        <Styled.Trigger
          $isOpen={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <Styled.ApplicantName>{current?.name ?? '-'}</Styled.ApplicantName>
          <Styled.ChevronIcon $isOpen={isOpen} />
        </Styled.Trigger>

        {isOpen && (
          <Styled.Dropdown $hasScroll={hasScroll}>
            <Styled.DropdownList
              ref={listRef}
              $hasScroll={hasScroll}
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
              <Styled.ScrollbarTrack>
                <Styled.ScrollbarThumb $offset={thumbOffset} />
              </Styled.ScrollbarTrack>
            )}
          </Styled.Dropdown>
        )}
      </Styled.SelectorWrapper>

      <Styled.NavButton
        onClick={onNext}
        disabled={!hasNext}
        aria-label='다음 지원자'
      >
        <Styled.NextIcon />
      </Styled.NavButton>
    </Styled.Wrapper>
  );
};

export default ApplicantNavHeader;
