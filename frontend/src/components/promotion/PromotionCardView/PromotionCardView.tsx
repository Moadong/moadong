import { getDDay } from '@/pages/PromotionPage/utils/getDday';
import { PromotionArticle } from '@/types/promotion';
import CardMeta from './CardMeta/CardMeta';
import DdayBadge from './DdayBadge/DdayBadge';
import * as Styled from './PromotionCardView.styles';

interface PromotionCardViewProps {
  article: PromotionArticle;
}

/**
 * 홍보 카드의 표시만 담당한다. 클릭·트래킹 같은 동작은 감싸는 쪽이 붙인다.
 * 사용자 목록과 관리자 목록이 같은 뷰를 써야 관리자가 실제 노출 결과를 그대로 본다.
 */
const PromotionCardView = ({ article }: PromotionCardViewProps) => {
  const dday = getDDay(article.eventStartDate, article.eventEndDate);

  return (
    <Styled.Container>
      <Styled.ImageWrapper>
        <Styled.Image $imageUrl={article.images?.[0]} />
        <Styled.DdayWrapper>
          <DdayBadge dday={dday} />
        </Styled.DdayWrapper>
      </Styled.ImageWrapper>

      <Styled.Content>
        <CardMeta
          title={article.title}
          location={article.location}
          startDate={article.eventStartDate}
          endDate={article.eventEndDate}
        />
      </Styled.Content>
    </Styled.Container>
  );
};

export default PromotionCardView;
