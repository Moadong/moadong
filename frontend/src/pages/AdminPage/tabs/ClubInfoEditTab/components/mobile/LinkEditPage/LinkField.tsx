import { useRef, useState } from 'react';
import ClearButtonIcon from '@/assets/images/icons/dark_clear_button_icon.svg?react';
import { colors } from '@/styles/theme/colors';
import EditField from '../EditField/EditField';
import * as Styled from './LinkField.styles';

interface LinkFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  error?: string;
}

const LinkField = ({
  label,
  placeholder,
  value,
  onChange,
  onClear,
  error,
}: LinkFieldProps) => {
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    onClear();
    inputRef.current?.focus();
  };

  return (
    <div>
      <EditField label={label} labelColor={colors.gray[800]}>
        <Styled.ContentRow>
          <Styled.Input
            ref={inputRef}
            type='url'
            value={value}
            placeholder={placeholder}
            $hasValue={value.length > 0}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
          />
          {isActive && value.length > 0 && (
            <Styled.ClearButton
              type='button'
              onMouseDown={handleClear}
              aria-label='지우기'
            >
              <ClearButtonIcon />
            </Styled.ClearButton>
          )}
        </Styled.ContentRow>
      </EditField>
      {error && <Styled.ErrorMessage>{error}</Styled.ErrorMessage>}
    </div>
  );
};

export default LinkField;
