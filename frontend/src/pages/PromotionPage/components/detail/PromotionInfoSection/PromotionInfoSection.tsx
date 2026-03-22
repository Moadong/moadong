import { PromotionArticle } from '@/types/promotion';
import * as Styled from './PromotionInfoSection.styles';

interface Props {
  article: PromotionArticle;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const PromotionInfoSection = ({ article }: Props) => {
  return (
    <Styled.Container>
      <Styled.SectionTitle>상세정보</Styled.SectionTitle>

      <Styled.Card>
        <Styled.Item>
          <Styled.Label>📅 일시</Styled.Label>
          <Styled.Value>
            {formatDate(article.eventStartDate)} -{' '}
            {formatDate(article.eventEndDate)}
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
