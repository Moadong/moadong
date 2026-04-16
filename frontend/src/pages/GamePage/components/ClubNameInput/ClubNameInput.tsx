import { useRef, useState } from 'react';
import { getClubList } from '@/apis/club';
import * as S from './ClubNameInput.styles';

interface ClubNameInputProps {
  onStart: (clubName: string) => void;
}

const ClubNameInput = ({ onStart }: ClubNameInputProps) => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setValue(v);
    setError('');

    clearTimeout(debounceRef.current);

    if (!v.trim()) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const { clubs } = await getClubList(v.trim());
        setSuggestions(clubs.map((c) => c.name));
      } catch {
        setSuggestions([]);
      }
    }, 300);
  };

  const handleSelect = (name: string) => {
    setValue(name);
    setSuggestions([]);
    setError('');
  };

  const handleSubmit = async () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setIsValidating(true);
    try {
      const { clubs } = await getClubList(trimmed);
      const exact = clubs.find((c) => c.name === trimmed);
      if (!exact) {
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
    if (e.key === 'Enter') handleSubmit();
  };

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
          />
          <S.StartButton
            onClick={handleSubmit}
            disabled={!value.trim() || isValidating}
          >
            {isValidating ? '확인 중...' : '시작'}
          </S.StartButton>
        </S.InputRow>

        {suggestions.length > 0 && (
          <S.Dropdown>
            {suggestions.map((name) => (
              <S.DropdownItem key={name} onClick={() => handleSelect(name)}>
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
