import { useState } from 'react';
import FieldClearButtonIcon from '@/assets/images/icons/field_clear_button_icon.svg?react';
import EditField from '@/pages/AdminPage/components/editFields/EditField/EditField';
import { colors } from '@/styles/theme/colors';
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

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    onClear();
  };

  return (
    <div>
      <EditField
        label={label}
        isActive={isActive}
        labelColor={colors.gray[800]}
      >
        <Styled.ContentRow>
          <Styled.Input
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
              <FieldClearButtonIcon />
            </Styled.ClearButton>
          )}
        </Styled.ContentRow>
      </EditField>
      {error && <Styled.ErrorMessage>{error}</Styled.ErrorMessage>}
    </div>
  );
};

export default LinkField;
