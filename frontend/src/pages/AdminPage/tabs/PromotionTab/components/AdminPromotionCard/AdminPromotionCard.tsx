import MoreButtonIcon from '@/assets/images/icons/ellipsis_icon.svg?react';
import PromotionCardView from '@/components/promotion/PromotionCardView/PromotionCardView';
import AdminMoreMenu from '@/pages/AdminPage/components/AdminMoreMenu/AdminMoreMenu';
import { PromotionArticle } from '@/types/promotion';
import * as Styled from './AdminPromotionCard.styles';

interface AdminPromotionCardProps {
  article: PromotionArticle;
  isMenuOpen: boolean;
  /** 열린 메뉴에만 붙여 바깥 클릭 감지에 쓴다 */
  menuRef: React.RefObject<HTMLDivElement | null>;
  onMenuToggle: (e: React.MouseEvent, articleId: string) => void;
  onEdit: (articleId: string) => void;
  onDelete: (article: PromotionArticle) => void;
}

const AdminPromotionCard = ({
  article,
  isMenuOpen,
  menuRef,
  onMenuToggle,
  onEdit,
  onDelete,
}: AdminPromotionCardProps) => {
  return (
    <Styled.Wrapper>
      <PromotionCardView article={article} />

      <Styled.CardOverlayButton
        type='button'
        aria-label={`${article.title} 수정`}
        onClick={() => onEdit(article.id)}
      />

      {/* 오버레이 버튼보다 뒤에 둬야 클릭이 메뉴로 간다 */}
      <Styled.MenuContainer ref={isMenuOpen ? menuRef : null}>
        <Styled.MoreButton
          type='button'
          aria-label={`${article.title} 관리 메뉴`}
          aria-expanded={isMenuOpen}
          onClick={(e) => onMenuToggle(e, article.id)}
        >
          <MoreButtonIcon />
        </Styled.MoreButton>

        {isMenuOpen && (
          <AdminMoreMenu
            onEdit={() => onEdit(article.id)}
            onDelete={() => onDelete(article)}
          />
        )}
      </Styled.MenuContainer>
    </Styled.Wrapper>
  );
};

export default AdminPromotionCard;
