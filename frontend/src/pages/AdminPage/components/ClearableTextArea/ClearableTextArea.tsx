import { useState } from 'react';
import ClearButtonIcon from '@/assets/images/icons/dark_clear_button_icon.svg?react';
import useAutoGrow from '@/hooks/useAutoGrow';
import * as Styled from './ClearableTextArea.styles';

interface ClearableTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  size?: 'default' | 'large';
}

const ClearableTextArea = ({
  value,
  onChange,
  onClear,
  placeholder,
  maxLength,
  rows = 1,
  size = 'default',
}: ClearableTextAreaProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useAutoGrow(value);

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    onChange('');
    onClear?.();
    textareaRef.current?.focus();
  };

  return (
    <Styled.Row>
      <Styled.Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        $size={size}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {isFocused && value.length > 0 && (
        <Styled.ClearButton
          type='button'
          onMouseDown={handleClear}
          aria-label='지우기'
        >
          <ClearButtonIcon />
        </Styled.ClearButton>
      )}
    </Styled.Row>
  );
};

export default ClearableTextArea;
