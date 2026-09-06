import { useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import Button from '@/components/common/Button/Button';
import CustomTextArea from '@/components/common/CustomTextArea/CustomTextArea';
import FixedBottomButtonArea from '@/components/common/FixedBottomButtonArea/FixedBottomButtonArea';
import InputField from '@/components/common/InputField/InputField';
import Spinner from '@/components/common/Spinner/Spinner';
import Toast from '@/components/common/Toast/Toast';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import NaverMap from '@/components/map/NaverMap/NaverMap';
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
import { ContentSection } from '@/pages/AdminPage/components/ContentSection/ContentSection';
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
  findBuildingByCoordinates,
  fromDateTimeLocalValue,
  toDateTimeLocalValue,
} from './utils/promotionForm';

const CUSTOM_BUILDING_VALUE = '__custom__';

const PromotionEditTab = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
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

  const isEdit = Boolean(articleId);
  const isFormDisabled = !isApproved || form.isSaving;
  const selectedBuilding = findBuildingByCoordinates(values.coordinates);
  // 개발자가 좌표를 직접 넣은 글은 건물 목록과 안 맞을 수 있다. 그 좌표는 유지하고 표시만 따로 한다.
  const buildingSelectValue = selectedBuilding
    ? selectedBuilding.value
    : values.coordinates
      ? CUSTOM_BUILDING_VALUE
      : '';

  const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = BUILDING_OPTIONS.find((o) => o.value === e.target.value);
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
      const message = `글은 저장됐지만 이미지 ${result.failedCount}장 업로드에 실패했어요. 다시 올려주세요.`;
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

  // 목록 조회 자체가 실패한 것과 글이 없는 것을 구분한다. 실패를 "삭제됨"으로 보여주면 사용자가 잘못된 판단을 한다
  if (isEdit && isError) {
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

      <InputField
        label='제목'
        placeholder='행사 제목을 입력해주세요'
        value={values.title}
        onChange={(e) => setField('title', e.target.value)}
        onClear={() => setField('title', '')}
        maxLength={PROMOTION_TITLE_MAX}
        disabled={isFormDisabled}
      />

      <div>
        <Styled.Label htmlFor='promotion-building'>지도 위치</Styled.Label>
        <Styled.Select
          id='promotion-building'
          value={buildingSelectValue}
          onChange={handleBuildingChange}
          disabled={isFormDisabled}
        >
          <option value='' disabled>
            건물을 선택해주세요
          </option>
          {buildingSelectValue === CUSTOM_BUILDING_VALUE && (
            <option value={CUSTOM_BUILDING_VALUE} disabled>
              직접 지정된 위치
            </option>
          )}
          {BUILDING_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Styled.Select>
        <Styled.HelperText>
          선택한 건물 위치가 홍보글 상세의 지도에 표시돼요.
        </Styled.HelperText>
        {values.coordinates && (
          <Styled.MapPreview>
            <NaverMap location={values.coordinates} />
          </Styled.MapPreview>
        )}
      </div>

      <InputField
        label='행사 장소'
        placeholder='예) 한솔관(E16) A동 208호'
        value={values.location}
        onChange={(e) => setField('location', e.target.value)}
        onClear={() => setField('location', '')}
        maxLength={PROMOTION_LOCATION_MAX}
        disabled={isFormDisabled}
      />

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

      <CustomTextArea
        variant='filled'
        label='행사 설명'
        placeholder='행사 내용, 참여 방법, 준비물 등을 적어주세요'
        value={values.description}
        onChange={(e) => setField('description', e.target.value)}
        maxLength={PROMOTION_DESCRIPTION_MAX}
        showMaxChar
        disabled={isFormDisabled}
      />

      <PromotionImageField
        existingImages={values.existingImages}
        localFiles={values.localFiles}
        disabled={isFormDisabled}
        onAddFiles={form.addLocalFiles}
        onRemoveExisting={form.removeExistingImage}
        onRemoveLocal={form.removeLocalFile}
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
          <Styled.CompactBody>{fields}</Styled.CompactBody>
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
