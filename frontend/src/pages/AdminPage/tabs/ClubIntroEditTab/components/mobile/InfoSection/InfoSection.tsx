import * as Styled from './InfoSection.styles';

interface InfoSectionProps {
  label: string;
  maxLength: number;
  currentLength: number;
  children: React.ReactNode;
}

const InfoSection = ({
  label,
  maxLength,
  currentLength,
  children,
}: InfoSectionProps) => (
  <Styled.Wrapper>
    <Styled.Header>
      <Styled.Label>{label}</Styled.Label>
      <Styled.Counter>
        {currentLength}/{maxLength}
      </Styled.Counter>
    </Styled.Header>
    <Styled.Card>{children}</Styled.Card>
  </Styled.Wrapper>
);

export default InfoSection;
