import * as Styled from './TitleInput.styles';

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TitleInput = ({
  value,
  onChange,
  placeholder = '제목',
}: TitleInputProps) => (
  <Styled.Container>
    <Styled.Input
      type='text'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={100}
    />
    {value && (
      <Styled.ClearButton
        type='button'
        aria-label='제목 지우기'
        onClick={() => onChange('')}
      >
        <svg width='8' height='8' viewBox='0 0 8 8' aria-hidden='true'>
          <path
            d='M1 1L7 7M7 1L1 7'
            stroke='currentColor'
            strokeWidth='1.6'
            strokeLinecap='round'
          />
        </svg>
      </Styled.ClearButton>
    )}
  </Styled.Container>
);

export default TitleInput;
