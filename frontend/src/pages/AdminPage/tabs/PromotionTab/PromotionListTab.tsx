import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { getServerErrorMessage } from '@/apis/utils/getServerErrorMessage';
import Plus from '@/assets/images/icons/Plus.svg';
import Spinner from '@/components/common/Spinner/Spinner';
import Toast from '@/components/common/Toast/Toast';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import { ADMIN_EVENT, PAGE_VIEW } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import {
  useDeletePromotionArticle,
  useGetPromotionArticles,
} from '@/hooks/Queries/usePromotion';
import useDevice from '@/hooks/useDevice';
import { ContentSection } from '@/pages/AdminPage/components/ContentSection/ContentSection';
import { colors } from '@/styles/theme/colors';
import { ClubDetail } from '@/types/club';
import { PromotionArticle } from '@/types/promotion';
import { formatKSTDateTimeFull } from '@/utils/formatKSTDateTime';
import {
  isClubApproved,
  PROMOTION_LIST_PATH,
  PROMOTION_NOT_APPROVED_MESSAGE,
} from './constants';
import * as Styled from './PromotionListTab.styles';

const formatPeriod = (article: PromotionArticle) =>
  `${formatKSTDateTimeFull(article.eventStartDate)} ~ ${formatKSTDateTimeFull(article.eventEndDate)}`;

const PromotionListTab = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const trackEvent = useMixpanelTrack();
  const { isMobile, isTablet } = useDevice();
  const isCompact = isMobile || isTablet;
  const clubDetail = useOutletContext<ClubDetail>();
  const isApproved = isClubApproved(clubDetail.state);

  useTrackPageView(PAGE_VIEW.ADMIN_PROMOTION_LIST_PAGE);

  const {
    data: articles,
    isLoading,
    isError,
    error,
  } = useGetPromotionArticles();
  const { mutate: deleteArticle, isPending: isDeleting } =
    useDeletePromotionArticle();

  // 작성·수정 화면에서 저장 후 넘어오면서 건넨 문구를 첫 렌더에 띄우고,
  // 뒤로가기로 돌아왔을 때 다시 뜨지 않도록 history state는 비운다
  const incomingToast = (location.state as { toastMessage?: string } | null)
    ?.toastMessage;
  const [toastMessage, setToastMessage] = useState<string | null>(
    incomingToast ?? null,
  );
  useEffect(() => {
    if (!incomingToast) return;
    navigate(location.pathname, { replace: true, state: null });
  }, [incomingToast, location.pathname, navigate]);

  const myArticles = (articles ?? []).filter(
    (article) => article.clubId === clubDetail.id,
  );

  const handleCreate = () => {
    trackEvent(ADMIN_EVENT.PROMOTION_CREATE_BUTTON_CLICKED);
    navigate(`${PROMOTION_LIST_PATH}/new`);
  };

  const handleEdit = (articleId: string) =>
    navigate(`${PROMOTION_LIST_PATH}/${articleId}/edit`);

  const handleDelete = (article: PromotionArticle) => {
    trackEvent(ADMIN_EVENT.PROMOTION_DELETE_BUTTON_CLICKED);
    if (
      !window.confirm(
        `'${article.title}' 게시글을 삭제하시겠습니까?\n삭제된 게시글은 홍보게시판에서 사라집니다.`,
      )
    ) {
      return;
    }
    deleteArticle(article.id, {
      onSuccess: () => setToastMessage('홍보 게시글이 삭제되었습니다.'),
      onError: (deleteError) =>
        setToastMessage(
          getServerErrorMessage(
            deleteError,
            '홍보 게시글 삭제에 실패했습니다.',
          ),
        ),
    });
  };

  const renderBody = () => {
    if (isLoading) return <Spinner />;
    if (isError) return <div>오류가 발생했습니다: {error.message}</div>;

    if (myArticles.length === 0) {
      return (
        <Styled.EmptyState>
          <Styled.EmptyTitle>
            아직 작성한 홍보 게시글이 없어요
          </Styled.EmptyTitle>
          <Styled.EmptyDescription>
            {isApproved
              ? '행사·공연·전시 소식을 올려 학우들에게 알려보세요.'
              : PROMOTION_NOT_APPROVED_MESSAGE}
          </Styled.EmptyDescription>
        </Styled.EmptyState>
      );
    }

    return (
      <Styled.CardList>
        {myArticles.map((article) => (
          <Styled.Card key={article.id}>
            <Styled.Thumbnail
              type='button'
              aria-label={`${article.title} 수정`}
              onClick={() => handleEdit(article.id)}
            >
              {article.images[0] ? (
                <img src={article.images[0]} alt='' />
              ) : (
                <Styled.ThumbnailPlaceholder>
                  이미지 없음
                </Styled.ThumbnailPlaceholder>
              )}
            </Styled.Thumbnail>

            <Styled.CardBody>
              <Styled.CardTitle>{article.title}</Styled.CardTitle>
              <Styled.CardMeta>{article.location}</Styled.CardMeta>
              <Styled.CardMeta>{formatPeriod(article)}</Styled.CardMeta>
            </Styled.CardBody>

            <Styled.CardActions>
              <Styled.ActionButton
                type='button'
                onClick={() => handleEdit(article.id)}
              >
                수정
              </Styled.ActionButton>
              <Styled.ActionButton
                type='button'
                $danger
                disabled={isDeleting}
                onClick={() => handleDelete(article)}
              >
                삭제
              </Styled.ActionButton>
            </Styled.CardActions>
          </Styled.Card>
        ))}
      </Styled.CardList>
    );
  };

  const createButton = isApproved && (
    <Styled.AddButton type='button' onClick={handleCreate}>
      새 게시글 작성 <Styled.PlusIcon src={Plus} alt='' />
    </Styled.AddButton>
  );

  return (
    <Styled.Container>
      {isCompact ? (
        <>
          <WebviewTopBar
            title='홍보 게시글 관리'
            onBack={() => navigate('/admin')}
          />
          <Styled.CompactBody>
            {!isApproved && myArticles.length > 0 && (
              <Styled.Notice role='status'>
                {PROMOTION_NOT_APPROVED_MESSAGE}
              </Styled.Notice>
            )}
            <Styled.CompactHeader>{createButton}</Styled.CompactHeader>
            {renderBody()}
          </Styled.CompactBody>
        </>
      ) : (
        <ContentSection>
          <ContentSection.Header title='내 홍보 게시글' action={createButton} />
          <ContentSection.Body>
            {!isApproved && myArticles.length > 0 && (
              <Styled.Notice role='status'>
                {PROMOTION_NOT_APPROVED_MESSAGE}
              </Styled.Notice>
            )}
            {renderBody()}
          </ContentSection.Body>
        </ContentSection>
      )}

      <Toast
        isOpen={toastMessage !== null}
        onClose={() => setToastMessage(null)}
        message={toastMessage ?? ''}
        backgroundColor={colors.primary[900]}
      />
    </Styled.Container>
  );
};

export default PromotionListTab;
