import { useState } from 'react';
import * as S from './ClubNameInput.styles';

interface ClubNameInputProps {
  onStart: (clubName: string) => void;
}

const ClubNameInput = ({ onStart }: ClubNameInputProps) => {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed) onStart(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <S.Wrapper>
      <S.Title>동아리명을 입력해주세요</S.Title>
      <S.InputRow>
        <S.Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='예) 모아동 개발팀'
          maxLength={30}
          autoFocus
        />
        <S.StartButton onClick={handleSubmit} disabled={!value.trim()}>
          시작
        </S.StartButton>
      </S.InputRow>
    </S.Wrapper>
  );
};

export default ClubNameInput;
