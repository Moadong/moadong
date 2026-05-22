import * as Styled from './ClubTag.styles';

interface ClubTagProps {
  clubName: string;
}

const ClubTag = ({ clubName }: ClubTagProps) => {
  return (
    <Styled.Container>
      <Styled.ClubText>{clubName}</Styled.ClubText>
    </Styled.Container>
  );
};

export default ClubTag;
