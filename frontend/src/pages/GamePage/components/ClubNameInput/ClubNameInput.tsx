import { useEffect, useId, useRef, useState } from 'react';
import {
  useClubSuggestions,
  useValidateClubName,
} from '@/hooks/Queries/useClub';
import * as S from './ClubNameInput.styles';

interface ClubNameInputProps {
  onStart: (clubName: string) => void;
}

const ClubNameInput = ({ onStart }: ClubNameInputProps) => {
  const validateClubName = useValidateClubName();
  const [value, setValue] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const listboxId = useId();
  const justSelectedRef = useRef(false);

  useEffect(() => {
    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      return;
    }
    const trimmed = value.trim();
    const timer = setTimeout(() => setDebouncedKeyword(trimmed), 300);
    return () => clearTimeout(timer);
  }, [value]);

  const { data: suggestions = [] } = useClubSuggestions(debouncedKeyword);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions]);

  const isOpen = suggestions.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setError('');
  };

  const handleSelect = (name: string) => {
    justSelectedRef.current = true;
    setValue(name);
    setDebouncedKeyword('');
    setHighlightedIndex(-1);
    setError('');
  };

  const handleSubmit = async () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setIsValidating(true);
    try {
      const isValid = await validateClubName(trimmed);
      if (!isValid) {
        setError('존재하지 않는 동아리입니다.');
        return;
      }
      onStart(trimmed);
    } catch {
      setError('동아리 확인 중 오류가 발생했습니다.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        isOpen ? Math.min(prev + 1, suggestions.length - 1) : prev,
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && isOpen) {
        e.preventDefault();
        handleSelect(suggestions[highlightedIndex]);
      } else {
        handleSubmit();
      }
    } else if (e.key === 'Escape') {
      setDebouncedKeyword('');
      setHighlightedIndex(-1);
    }
  };

  const activeDescendant =
    highlightedIndex >= 0
      ? `${listboxId}-option-${highlightedIndex}`
      : undefined;

  return (
    <S.Wrapper>
      <S.Title>동아리명을 입력해주세요</S.Title>
      <S.InputContainer>
        <S.InputRow>
          <S.Input
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder='예) RCY'
            maxLength={30}
            autoFocus
            $hasError={!!error}
            role='combobox'
            aria-autocomplete='list'
            aria-expanded={isOpen}
            aria-controls={listboxId}
            aria-activedescendant={activeDescendant}
          />
          <S.StartButton
            onClick={handleSubmit}
            disabled={!value.trim() || isValidating}
          >
            {isValidating ? '확인 중...' : '시작'}
          </S.StartButton>
        </S.InputRow>

        {isOpen && (
          <S.Dropdown role='listbox' id={listboxId}>
            {suggestions.map((name, index) => (
              <S.DropdownItem
                key={name}
                id={`${listboxId}-option-${index}`}
                role='option'
                aria-selected={index === highlightedIndex}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(name)}
              >
                {name}
              </S.DropdownItem>
            ))}
          </S.Dropdown>
        )}
      </S.InputContainer>

      {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
    </S.Wrapper>
  );
};

export default ClubNameInput;
