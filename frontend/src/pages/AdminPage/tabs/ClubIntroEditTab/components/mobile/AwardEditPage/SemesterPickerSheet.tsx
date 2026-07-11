import { useEffect, useRef, useState } from 'react';
import { Award, SemesterTermType } from '@/types/club';
import { generateSemesterOptions, SemesterOption } from '@/utils/awardHelpers';
import { getSemesterTerm } from '@/utils/semester';
import * as Styled from './SemesterPickerSheet.styles';

const ITEM_HEIGHT = 50;

const getDefaultIndex = (options: SemesterOption[]): number => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentTerm = getSemesterTerm(now.getMonth());

  const idx = options.findIndex(
    (opt) => opt.year === currentYear && opt.semesterTerm === currentTerm,
  );
  return idx >= 0 ? idx : Math.floor(options.length / 2);
};

interface SemesterPickerSheetProps {
  existingAwards: Award[];
  onAdd: (year: number, semesterTerm: SemesterTermType) => void;
  onClose: () => void;
}

const SemesterPickerSheet = ({
  existingAwards,
  onAdd,
  onClose,
}: SemesterPickerSheetProps) => {
  const options = generateSemesterOptions(existingAwards);

  const [selectedIndex, setSelectedIndex] = useState(() =>
    getDefaultIndex(options),
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (scrollRef.current && !isInitialized.current) {
      scrollRef.current.scrollTop = selectedIndex * ITEM_HEIGHT;
      isInitialized.current = true;
    }
  }, [selectedIndex]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const index = Math.round(scrollRef.current.scrollTop / ITEM_HEIGHT);
    setSelectedIndex(Math.max(0, Math.min(index, options.length - 1)));
  };

  const handleAdd = () => {
    const selected = options[selectedIndex];
    if (selected) {
      onAdd(selected.year, selected.semesterTerm);
    }
  };

  if (options.length === 0) return null;

  return (
    <Styled.Overlay onClick={onClose}>
      <Styled.Sheet onClick={(e) => e.stopPropagation()}>
        <Styled.SheetTitle>학기를 선택해주세요</Styled.SheetTitle>

        <Styled.PickerWrapper>
          <Styled.SelectedHighlight />
          <Styled.ScrollContainer ref={scrollRef} onScroll={handleScroll}>
            <Styled.ScrollSpacer />
            {options.map((opt, i) => (
              <Styled.PickerItem
                key={`${opt.year}-${opt.semesterTerm}`}
                $isSelected={i === selectedIndex}
                $distance={Math.abs(i - selectedIndex)}
              >
                {opt.label}
              </Styled.PickerItem>
            ))}
            <Styled.ScrollSpacer />
          </Styled.ScrollContainer>
        </Styled.PickerWrapper>

        <Styled.ConfirmButton onClick={handleAdd}>
          추가하기
        </Styled.ConfirmButton>
      </Styled.Sheet>
    </Styled.Overlay>
  );
};

export default SemesterPickerSheet;
