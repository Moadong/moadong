import { useLayoutEffect, useRef, useState } from 'react';
import FieldClearButtonIcon from '@/assets/images/icons/field_clear_button_icon.svg?react';
import EditField from '../EditField/EditField';
import * as Styled from './TextField.styles';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

const TextField = ({ label, value, onChange, onClear }: TextFieldProps) => {
  const [isActive, setIsActive] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, lineHeight * 2)}px`;
  }, [value]);

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault(); // blur 방지
    onClear();
    textareaRef.current?.focus();
  };

  return (
    <EditField label={label} isActive={isActive}>
      <Styled.ContentRow>
        <Styled.Input
          ref={textareaRef}
          value={value}
          placeholder={label}
          rows={1}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
        />
        {isActive && (
          <Styled.ClearButton
            type='button'
            onMouseDown={handleClear}
            aria-label='지우기'
          >
            <FieldClearButtonIcon />
          </Styled.ClearButton>
        )}
      </Styled.ContentRow>
    </EditField>
  );
};

export default TextField;
