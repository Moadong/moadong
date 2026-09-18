import { useEffect, useState } from 'react';
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import Button from '@/components/common/Button/Button';
import FixedBottomButtonArea from '@/components/common/FixedBottomButtonArea/FixedBottomButtonArea';
import Spinner from '@/components/common/Spinner/Spinner';
import Toast from '@/components/common/Toast/Toast';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import MapLocationPicker from '@/components/map/MapLocationPicker/MapLocationPicker';
import {
  PROMOTION_DESCRIPTION_MAX,
  PROMOTION_LOCATION_MAX,
  PROMOTION_TITLE_MAX,
} from '@/constants/adminFieldLimits';
import { ADMIN_EVENT, PAGE_VIEW } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { useGetPromotionArticles } from '@/hooks/Queries/usePromotion';
import useDevice from '@/hooks/useDevice';
import ClearableTextArea from '@/pages/AdminPage/components/ClearableTextArea/ClearableTextArea';
import { ContentSection } from '@/pages/AdminPage/components/ContentSection/ContentSection';
import InfoSection from '@/pages/AdminPage/components/InfoSection/InfoSection';
import DateTimeRangePicker from '@/pages/AdminPage/tabs/RecruitEditTab/components/DateTimeRangePicker/DateTimeRangePicker';
import { colors } from '@/styles/theme/colors';
import { ClubDetail } from '@/types/club';
import PromotionImageField from './components/PromotionImageField/PromotionImageField';
import {
  isClubApproved,
  PROMOTION_LIST_PATH,
  PROMOTION_NOT_APPROVED_MESSAGE,
} from './constants';
import { usePromotionForm } from './hooks/usePromotionForm';
import * as Styled from './PromotionEditTab.styles';
import {
  BUILDING_OPTIONS,
  buildPastLocationOptions,
  findBuildingByCoordinates,
  fromDateTimeLocalValue,
  toDateTimeLocalValue,
} from './utils/promotionForm';

/** 위치를 고르기 전에도 지도를 보여주기 위한 기준 좌표 */
const DEFAULT_MAP_CENTER = BUILDING_OPTIONS[0].coordinates;

const PromotionEditTab = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const trackEvent = useMixpanelTrack();
  const { isMobile, isTablet } = useDevice();
  const isCompact = isMobile || isTablet;
  const clubDetail = useOutletContext<ClubDetail>();
  const isApproved = isClubApproved(clubDetail.state);

  useTrackPageView(PAGE_VIEW.ADMIN_PROMOTION_EDIT_PAGE);

  const {
    data: articles,
    isLoading,
    isError,
    error,
  } = useGetPromotionArticles();
  const article = articleId
    ? articles?.find(
        (item) => item.id === articleId && item.clubId === clubDetail.id,
      )
    : undefined;

  const form = usePromotionForm({ clubId: clubDetail.id, article });
  const { values, setField } = form;
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 작성 중 일부 이미지 업로드가 실패하면 수정 화면으로 replace하며 문구를 함께 넘긴다.
  // 여기서 읽지 않으면 "이미지가 안 올라갔다"는 사실이 사용자에게 전혀 안 보인다.
  // /new → /:id/edit은 같은 컴포넌트라 다시 마운트되지 않을 수 있어 렌더 중에 받는다.
  const incomingToast = (location.state as { toastMessage?: string } | null)
    ?.toastMessage;
  const [consumedToast, setConsumedToast] = useState<string | null>(null);
  if (incomingToast && incomingToast !== consumedToast) {
    setConsumedToast(incomingToast);
    setToastMessage(incomingToast);
  }
  useEffect(() => {
    if (!incomingToast) return;
    navigate(location.pathname, { replace: true, state: null });
  }, [incomingToast, location.pathname, navigate]);

  const isEdit = Boolean(articleId);
  const isFormDisabled = !isApproved || form.isSaving;
  // 지도로 찍은 좌표는 정적 건물 목록에 없다. 전에 쓴 장소를 다시 고를 수 있게
  // 이미 받아 둔 글 목록에서 뽑아 붙인다. 추가 요청은 없다.
  const pastLocationOptions = buildPastLocationOptions(
    articles ?? [],
    clubDetail.id,
  );
  const locationOptions = [...BUILDING_OPTIONS, ...pastLocationOptions];

  // 이 select는 지도를 저장된 위치로 옮기는 이동 컨트롤이다. 최종 좌표는 지도에서
  // 정하므로 지도로 맞춘 좌표가 목록과 안 맞으면 그냥 선택 없음으로 돌아간다.
  const selectedBuilding = findBuildingByCoordinates(
    values.coordinates,
    locationOptions,
  );
  const buildingSelectValue = selectedBuilding?.value ?? '';

  const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = locationOptions.find((o) => o.value === e.target.value);
    if (!option) return;
    setField('coordinates', option.coordinates);
    if (!values.location.trim()) setField('location', option.label);
  };

  const handleStartChange = (date: Date | null) => {
    setField('eventStart', date);
    if (date && values.eventEnd && date > values.eventEnd)
      setField('eventEnd', date);
  };

  const handleEndChange = (date: Date | null) => {
    setField('eventEnd', date);
    if (date && values.eventStart && date < values.eventStart)
      setField('eventStart', date);
  };

  const goToList = (message?: string) =>
    navigate(PROMOTION_LIST_PATH, {
      state: message ? { toastMessage: message } : undefined,
    });

  const handleSave = async () => {
    trackEvent(ADMIN_EVENT.PROMOTION_SAVE_BUTTON_CLICKED, { mode: form.mode });
    const result = await form.save();

    if (result.status === 'error') {
      setToastMessage(result.message);
      return;
    }
    if (result.status === 'partial') {
      const message = `글은 저장됐지만 이미지 ${result.failedCount}장 업로드에 실패했어요. 실패한 이미지는 그대로 있으니 다시 저장해주세요.`;
      if (isEdit) {
        setToastMessage(message);
      } else {
        navigate(`${PROMOTION_LIST_PATH}/${result.articleId}/edit`, {
          replace: true,
          state: { toastMessage: message },
        });
      }
      return;
    }
    goToList(
      isEdit
        ? '홍보 게시글이 수정되었습니다.'
        : '홍보 게시글이 등록되었습니다.',
    );
  };

  const title = isEdit ? '홍보 게시글 수정' : '홍보 게시글 작성';

  if (isEdit && isLoading) return <Spinner />;

  // 목록 조회 자체가 실패한 것과 글이 없는 것을 구분한다. 실패를 "삭제됨"으로 보여주면 사용자가 잘못된 판단을 한다.
  // 단, 편집 중 백그라운드 재조회(refetchInterval·포커스)가 실패하면 isError여도 캐시된 article이 남으므로
  // 쓸 데이터가 없을 때만 오류 화면으로 바꾼다. 안 그러면 편집 중인 폼이 통째로 사라진다.
  if (isEdit && isError && !article) {
    return (
      <Styled.Container>
        {isCompact && <WebviewTopBar title={title} onBack={() => goToList()} />}
        <Styled.EmptyState>
          <Styled.EmptyTitle>게시글을 불러오지 못했어요</Styled.EmptyTitle>
          <Styled.EmptyDescription>{error.message}</Styled.EmptyDescription>
          <Button onClick={() => goToList()}>목록으로</Button>
        </Styled.EmptyState>
      </Styled.Container>
    );
  }

  if (isEdit && !article) {
    return (
      <Styled.Container>
        {isCompact && <WebviewTopBar title={title} onBack={() => goToList()} />}
        <Styled.EmptyState>
          <Styled.EmptyTitle>게시글을 찾을 수 없어요</Styled.EmptyTitle>
          <Styled.EmptyDescription>
            삭제됐거나 우리 동아리의 글이 아니에요.
          </Styled.EmptyDescription>
          <Button onClick={() => goToList()}>목록으로</Button>
        </Styled.EmptyState>
      </Styled.Container>
    );
  }

  const fields = (
    <>
      {!isApproved && (
        <Styled.Notice role='status'>
          {PROMOTION_NOT_APPROVED_MESSAGE}
        </Styled.Notice>
      )}

      <InfoSection
        label='제목'
        maxLength={PROMOTION_TITLE_MAX}
        currentLength={values.title.length}
      >
        <ClearableTextArea
          size='large'
          value={values.title}
          onChange={(value) => setField('title', value)}
          placeholder='행사 제목을 입력해주세요'
          maxLength={PROMOTION_TITLE_MAX}
          disabled={isFormDisabled}
        />
      </InfoSection>

      <div>
        <Styled.Label htmlFor='promotion-building'>지도 위치</Styled.Label>
        <Styled.SelectWrapper>
          <Styled.Select
            id='promotion-building'
            value={buildingSelectValue}
            onChange={handleBuildingChange}
            disabled={isFormDisabled}
          >
            <option value='' disabled>
              저장된 위치로 이동
            </option>
            {BUILDING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
            {pastLocationOptions.length > 0 && (
              <optgroup label='이전에 쓴 장소'>
                {pastLocationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            )}
          </Styled.Select>
          <Styled.SelectChevron />
        </Styled.SelectWrapper>
        <Styled.HelperText>
          목록에서 고르면 그 위치로 지도가 이동해요. 이어서 지도를 끌어 조정할
          수 있어요.
        </Styled.HelperText>
        <Styled.MapPreview>
          <MapLocationPicker
            value={values.coordinates}
            fallbackCenter={DEFAULT_MAP_CENTER}
            disabled={isFormDisabled}
            onChange={(coordinates) => setField('coordinates', coordinates)}
          />
        </Styled.MapPreview>
        <Styled.MapStatus
          role='status'
          $isConfirmed={Boolean(values.coordinates)}
        >
          {!values.coordinates
            ? '지도를 움직여 가운데 핀을 행사 위치에 맞춰주세요.'
            : selectedBuilding
              ? `${selectedBuilding.label} 위치로 지정됐어요.`
              : '지도에서 지정한 위치예요.'}
        </Styled.MapStatus>
      </div>

      <InfoSection
        label='행사 장소'
        maxLength={PROMOTION_LOCATION_MAX}
        currentLength={values.location.length}
      >
        <ClearableTextArea
          size='large'
          value={values.location}
          onChange={(value) => setField('location', value)}
          placeholder='예) 한솔관(E16) A동 208호'
          maxLength={PROMOTION_LOCATION_MAX}
          disabled={isFormDisabled}
        />
      </InfoSection>

      <div>
        <Styled.Label as='p'>행사 기간</Styled.Label>
        {isCompact ? (
          <Styled.DateTimeRow>
            <Styled.DateTimeInput
              type='datetime-local'
              aria-label='행사 시작 일시'
              value={toDateTimeLocalValue(values.eventStart)}
              onChange={(e) =>
                handleStartChange(fromDateTimeLocalValue(e.target.value))
              }
              disabled={isFormDisabled}
            />
            <Styled.DateTimeInput
              type='datetime-local'
              aria-label='행사 종료 일시'
              value={toDateTimeLocalValue(values.eventEnd)}
              onChange={(e) =>
                handleEndChange(fromDateTimeLocalValue(e.target.value))
              }
              disabled={isFormDisabled}
            />
          </Styled.DateTimeRow>
        ) : (
          <DateTimeRangePicker
            recruitmentStart={values.eventStart}
            recruitmentEnd={values.eventEnd}
            onChangeRecruitmentStart={handleStartChange}
            onChangeRecruitmentEnd={handleEndChange}
            disabled={isFormDisabled}
          />
        )}
      </div>

      <InfoSection
        label='행사 설명'
        maxLength={PROMOTION_DESCRIPTION_MAX}
        currentLength={values.description.length}
      >
        <ClearableTextArea
          value={values.description}
          onChange={(value) => setField('description', value)}
          placeholder='행사 내용, 참여 방법, 준비물 등을 적어주세요'
          maxLength={PROMOTION_DESCRIPTION_MAX}
          disabled={isFormDisabled}
        />
      </InfoSection>

      <PromotionImageField
        images={values.images}
        columns={isCompact ? 3 : 4}
        disabled={isFormDisabled}
        onAddFiles={form.addFiles}
        onRemove={form.removeImage}
        onReorder={form.reorderImages}
        onReject={setToastMessage}
      />
    </>
  );

  const saveLabel = form.isSaving ? '저장 중…' : '저장하기';

  return (
    <Styled.Container>
      {isCompact ? (
        <>
          <WebviewTopBar title={title} onBack={() => goToList()} />
          <Styled.CompactBody>
            <div>
              <Styled.PageTitle>행사 정보를 입력해주세요</Styled.PageTitle>
              <Styled.PageSubtitle>
                동아리 행사를 홍보하는 곳이에요
              </Styled.PageSubtitle>
            </div>
            {fields}
          </Styled.CompactBody>
          {isApproved && (
            <FixedBottomButtonArea
              onClick={handleSave}
              disabled={form.isSaving}
            >
              {saveLabel}
            </FixedBottomButtonArea>
          )}
        </>
      ) : (
        <ContentSection>
          <ContentSection.Header
            title={title}
            action={
              <Styled.HeaderActions>
                <Styled.CancelButton type='button' onClick={() => goToList()}>
                  취소
                </Styled.CancelButton>
                {isApproved && (
                  <Button
                    width='135px'
                    animated
                    onClick={handleSave}
                    disabled={form.isSaving}
                  >
                    {saveLabel}
                  </Button>
                )}
              </Styled.HeaderActions>
            }
          />
          <ContentSection.Body>{fields}</ContentSection.Body>
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

export default PromotionEditTab;
