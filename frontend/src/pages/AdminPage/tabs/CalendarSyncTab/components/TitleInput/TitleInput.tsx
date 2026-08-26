import * as Styled from './TitleInput.styles';

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** 지우기 버튼을 눌렀을 때. 직접 지운 경우와 구분해야 할 때만 넘긴다 */
  onClear?: () => void;
}

const TitleInput = ({
  value,
  onChange,
  placeholder = '제목',
  onClear,
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
        onClick={() => {
          onClear?.();
          onChange('');
        }}
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
