import React, { useRef, useState } from 'react';
import searchButtonIcon from '@/assets/images/icons/search_button_icon.svg';
import * as Styled from '@/components/common/SearchField/SearchField.styles';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  ariaLabel?: string;
  autoBlur?: boolean;
}

const SearchField = ({
  value,
  onChange,
  onSubmit,
  placeholder = '검색어를 입력하세요',
  ariaLabel = '검색 입력창',
  autoBlur = true,
}: SearchFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
    if (autoBlur) inputRef.current?.blur();
  };

  return (
    <Styled.SearchBoxContainer $isFocused={isFocused} onSubmit={handleSubmit}>
      <Styled.SearchInputStyles
        ref={inputRef}
        type='text'
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-label={ariaLabel}
      />
      <Styled.SearchButton
        type='submit'
        $isFocused={isFocused}
        aria-label='검색'
      >
        <img src={searchButtonIcon} alt='Search Button' />
      </Styled.SearchButton>
    </Styled.SearchBoxContainer>
  );
};

export default SearchField;
