import { PromotionArticle } from '@/types/promotion';
import * as Styled from './PromotionInfoSection.styles';
import { formatKSTDateTimeFull } from '@/utils/formatKSTDateTime';

interface Props {
  article: PromotionArticle;
}

const PromotionInfoSection = ({ article }: Props) => {
  return (
    <Styled.Container>
      <Styled.SectionTitle>상세정보</Styled.SectionTitle>

      <Styled.Card>
        <Styled.Item>
          <Styled.Label>📅 일시</Styled.Label>
          <Styled.Value>
            {formatKSTDateTimeFull(article.eventStartDate)} -{' '}
            {formatKSTDateTimeFull(article.eventEndDate)}
          </Styled.Value>
        </Styled.Item>

        {article.location && (
          <Styled.Item>
            <Styled.Label>📍 장소</Styled.Label>
            <Styled.Value>{article.location}</Styled.Value>
          </Styled.Item>
        )}

        <Styled.Item>
          <Styled.Label>🎉 프로그램 안내</Styled.Label>
          <Styled.Value>
            {article.description.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </Styled.Value>
        </Styled.Item>
      </Styled.Card>
    </Styled.Container>
  );
};

export default PromotionInfoSection;
