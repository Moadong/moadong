import { useRef, useState } from 'react';
import { ApplicationFormItem } from '@/types/application';
import * as Styled from './FormDropdownSelector.styles';

const TRACK_HEIGHT = 130;
const THUMB_HEIGHT = 60;

interface FormDropdownSelectorProps {
  forms: ApplicationFormItem[];
  selectedFormId: string;
  onSelect: (formId: string) => void;
}

const FormDropdownSelector = ({
  forms,
  selectedFormId,
  onSelect,
}: FormDropdownSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [thumbOffset, setThumbOffset] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedForm = forms.find((f) => f.id === selectedFormId);
  const isFixed = forms.length >= 3;
  const hasScroll = forms.length > 3;

  const handleSelect = (formId: string) => {
    onSelect(formId);
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
      <Styled.Trigger $isOpen={isOpen} onClick={() => setIsOpen((prev) => !prev)}>
        <Styled.TriggerLabel>{selectedForm?.title ?? '지원서 선택'}</Styled.TriggerLabel>
        <Styled.ChevronIcon />
      </Styled.Trigger>

      {isOpen && (
        <Styled.MenuCard $isFixed={isFixed} $hasScroll={hasScroll}>
          <Styled.MenuList $hasScroll={hasScroll} ref={listRef} onScroll={handleScroll}>
            {forms.map((form) => (
              <Styled.MenuItem
                key={form.id}
                $isSelected={form.id === selectedFormId}
                onClick={() => handleSelect(form.id)}
              >
                {form.title}
              </Styled.MenuItem>
            ))}
          </Styled.MenuList>
          {hasScroll && (
            <Styled.ScrollbarTrack>
              <Styled.ScrollbarThumb $offset={thumbOffset} />
            </Styled.ScrollbarTrack>
          )}
        </Styled.MenuCard>
      )}
    </Styled.Wrapper>
  );
};

export default FormDropdownSelector;
