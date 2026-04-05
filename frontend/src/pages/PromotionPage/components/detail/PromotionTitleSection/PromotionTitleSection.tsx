import { PromotionArticle } from '@/types/promotion';
import ClubTag from '../../list/PromotionCard/ClubTag/ClubTag';
import * as Styled from './PromotionTitleSection.styles';

interface Props {
  article: PromotionArticle;
}

const PromotionTitleSection = ({ article }: Props) => {
  return (
    <Styled.Container>
      <Styled.TagWrapper>
        <ClubTag clubName={article.clubName} />
      </Styled.TagWrapper>

      <Styled.Title>{article.title}</Styled.Title>
      <Styled.Divider />
    </Styled.Container>
  );
};

export default PromotionTitleSection;
