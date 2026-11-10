import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reorder, useInstantLayoutTransition } from 'framer-motion';
import QuestionAnswerer from '@/components/application/QuestionAnswerer/QuestionAnswerer';
import ConfirmModal from '@/components/common/ConfirmModal/ConfirmModal';
import FixedBottomButtonArea from '@/components/common/FixedBottomButtonArea/FixedBottomButtonArea';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import {
  APPLICATION_FORM,
  NAME_QUESTION_ID,
} from '@/constants/applicationForm';
import LongPressReorderItem from '@/pages/AdminPage/components/LongPressReorderItem/LongPressReorderItem';
import {
  ApplicationFormData,
  ApplicationFormMode,
  Question,
} from '@/types/application';
import * as Styled from './ApplicationEditTabMobile.styles';
import ApplicationTypeTab from './components/mobile/ApplicationTypeTab/ApplicationTypeTab';
import QuestionCard from './components/mobile/QuestionCard/QuestionCard';
import { useQuestionEditor } from './hooks/useQuestionEditor';

const REORDER_TOOLTIP_STORAGE_KEY =
  'moadong:applicationEdit:reorderTooltipSeen';

type EditTabKey = 'info' | 'questions' | 'preview';

const EDIT_TABS: { key: EditTabKey; label: string }[] = [
  { key: 'info', label: '기본정보' },
  { key: 'questions', label: '질문생성' },
  { key: 'preview', label: '미리보기' },
];

const hasSeenReorderTooltip = () => {
  try {
    return window.localStorage.getItem(REORDER_TOOLTIP_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

const markReorderTooltipSeen = () => {
  try {
    window.localStorage.setItem(REORDER_TOOLTIP_STORAGE_KEY, 'true');
  } catch {
    // 저장소를 못 쓰면 다음에 한 번 더 보일 뿐이다
  }
};

interface ApplicationEditTabMobileProps {
  formData: ApplicationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ApplicationFormData>>;
  applicationFormMode: ApplicationFormMode;
  setApplicationFormMode: (mode: ApplicationFormMode) => void;
  externalApplicationUrl: string;
  setExternalApplicationUrl: (url: string) => void;
  onSubmit: () => void;
}

const ApplicationEditTabMobile = ({
  formData,
  setFormData,
  applicationFormMode,
  setApplicationFormMode,
  externalApplicationUrl,
  setExternalApplicationUrl,
  onSubmit,
}: ApplicationEditTabMobileProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<EditTabKey>('info');
  const [focusedQuestionId, setFocusedQuestionId] = useState<number>();
  const [pendingDeleteId, setPendingDeleteId] = useState<number>();
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const startInstantLayout = useInstantLayoutTransition();

  const {
    addQuestion,
    handleReorder,
    removeQuestion,
    handleFormDescriptionChange,
    handleTitleChange,
    handleDescriptionChange,
    handleItemsChange,
    handleTypeChange,
    handleRequiredChange,
  } = useQuestionEditor(formData, setFormData);

  const questions = formData.questions ?? [];
  const isInternal = applicationFormMode === ApplicationFormMode.INTERNAL;

  const handleTabClick = (key: string) => {
    const tab = key as EditTabKey;
    setActiveTab(tab);
    if (tab === 'questions' && !hasSeenReorderTooltip()) {
      markReorderTooltipSeen();
      setIsTooltipOpen(true);
    }
  };

  const handleFormTitleChange = (value: string) =>
    setFormData((prev) => ({ ...prev, title: value }));

  // 삭제 확인 모달의 스크롤 잠금은 body를 position: fixed로 바꿔 window.scrollY를 0으로 만든다.
  // 이 렌더에서 질문 카드(Reorder.Item)가 레이아웃 애니메이션을 재면 페이지 좌표가 스크롤만큼
  // 바뀐 것을 이동으로 보고 카드를 미끄러뜨리므로, 모달을 여닫는 렌더는 애니메이션 없이 반영한다.
  // 삭제를 확정하면 모달이 닫히는 렌더에서 질문도 빠지므로, 남은 카드가 빈자리로 올라오는 것도 즉시 반영된다
  const setPendingDeleteInstantly = (id: number | undefined) =>
    startInstantLayout(() => setPendingDeleteId(id));

  const confirmDelete = () =>
    startInstantLayout(() => {
      if (pendingDeleteId !== undefined) removeQuestion(pendingDeleteId);
      setPendingDeleteId(undefined);
    });

  const renderInfoTab = () => (
    <Styled.FieldList>
      <Styled.Field>
        <Styled.FieldHeader>
          <span>지원서 제목</span>
          <span>
            {formData.title.length}/
            {APPLICATION_FORM.APPLICATION_TITLE.maxLength}
          </span>
        </Styled.FieldHeader>
        <Styled.TextInput
          aria-label='지원서 제목'
          value={formData.title}
          maxLength={APPLICATION_FORM.APPLICATION_TITLE.maxLength}
          placeholder='지원서 제목을 입력하세요'
          onChange={(e) => handleFormTitleChange(e.target.value)}
        />
      </Styled.Field>
      <Styled.Field>
        <Styled.FieldHeader>
          <span>지원서 설명</span>
          <span>
            {formData.description.length}/
            {APPLICATION_FORM.APPLICATION_DESCRIPTION.maxLength}
          </span>
        </Styled.FieldHeader>
        <Styled.TextArea
          aria-label='지원서 설명'
          value={formData.description}
          maxLength={APPLICATION_FORM.APPLICATION_DESCRIPTION.maxLength}
          placeholder={APPLICATION_FORM.APPLICATION_DESCRIPTION.placeholder}
          onChange={(e) => handleFormDescriptionChange(e.target.value)}
        />
      </Styled.Field>
    </Styled.FieldList>
  );

  const renderQuestionsTab = () => (
    <>
      {isTooltipOpen && (
        <Styled.Dim
          data-testid='reorder-tooltip-dim'
          onClick={() => setIsTooltipOpen(false)}
        />
      )}
      <Styled.QuestionList
        as={Reorder.Group<Question[]>}
        forwardedAs='div'
        axis='y'
        values={questions}
        onReorder={handleReorder}
      >
        {questions.map((question, index) => (
          <LongPressReorderItem key={question.id} value={question}>
            <Styled.CardSlot
              $raised={isTooltipOpen && index === 0}
              onPointerDownCapture={() => setIsTooltipOpen(false)}
            >
              {isTooltipOpen && index === 0 && (
                <Styled.Tooltip role='status'>
                  길게 눌러 순서를 변경할 수 있어요
                </Styled.Tooltip>
              )}
              <QuestionCard
                number={index + 1}
                question={question}
                focused={
                  focusedQuestionId === question.id ||
                  (isTooltipOpen && index === 0)
                }
                readOnly={question.id === NAME_QUESTION_ID}
                onFocus={() => setFocusedQuestionId(question.id)}
                onTitleChange={handleTitleChange(question.id)}
                onDescriptionChange={handleDescriptionChange(question.id)}
                onItemsChange={handleItemsChange(question.id)}
                onTypeChange={handleTypeChange(question.id)}
                onRequiredChange={handleRequiredChange(question.id)}
                onRemove={() => {
                  setIsTooltipOpen(false);
                  setPendingDeleteInstantly(question.id);
                }}
              />
            </Styled.CardSlot>
          </LongPressReorderItem>
        ))}
      </Styled.QuestionList>
      <Styled.AddQuestionButton type='button' onClick={addQuestion}>
        + 질문 추가
      </Styled.AddQuestionButton>
    </>
  );

  const renderPreviewTab = () => (
    <Styled.PreviewFieldset disabled aria-label='지원서 미리보기'>
      <Styled.PreviewTitle>{formData.title}</Styled.PreviewTitle>
      {formData.description && (
        <Styled.PreviewDescription>
          {formData.description}
        </Styled.PreviewDescription>
      )}
      {questions.map((question, index) => (
        <QuestionAnswerer
          key={question.id}
          question={question}
          number={index + 1}
          selectedAnswers={[]}
          onChange={() => {}}
        />
      ))}
    </Styled.PreviewFieldset>
  );

  const renderExternal = () => (
    <Styled.FieldList>
      <Styled.Field>
        <Styled.FieldHeader>
          <span>지원서 제목</span>
          <span>
            {formData.title.length}/
            {APPLICATION_FORM.APPLICATION_TITLE.maxLength}
          </span>
        </Styled.FieldHeader>
        <Styled.TextInput
          aria-label='지원서 제목'
          value={formData.title}
          maxLength={APPLICATION_FORM.APPLICATION_TITLE.maxLength}
          placeholder='지원서 제목을 입력하세요'
          onChange={(e) => handleFormTitleChange(e.target.value)}
        />
      </Styled.Field>
      <Styled.Field>
        <Styled.FieldHeader>
          <span>지원서 링크</span>
        </Styled.FieldHeader>
        <Styled.LinkBox>
          <Styled.LinkIcon aria-hidden='true' />
          <Styled.LinkInput
            aria-label='지원서 링크'
            value={externalApplicationUrl}
            placeholder='https://~~'
            onChange={(e) => setExternalApplicationUrl(e.target.value)}
          />
        </Styled.LinkBox>
        <Styled.Hint>
          현재 구글폼, 네이버폼, 에브리타임 링크만 제출가능합니다.
        </Styled.Hint>
      </Styled.Field>
    </Styled.FieldList>
  );

  const renderInternal = () => (
    <>
      <Styled.Tabs
        tabs={EDIT_TABS}
        activeKey={activeTab}
        onTabClick={handleTabClick}
      />
      {activeTab === 'info' && renderInfoTab()}
      {activeTab === 'questions' && renderQuestionsTab()}
      {activeTab === 'preview' && renderPreviewTab()}
    </>
  );

  return (
    <>
      <Styled.MobileContainer>
        <WebviewTopBar
          title='지원서'
          onBack={() => navigate('/admin/application-list')}
        />
        <Styled.Content
          // 순서 변경 툴팁은 딤·카드 포인터 말고도 키보드(포커스 이동, Escape)로 닫히게 한다
          onFocusCapture={() => setIsTooltipOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsTooltipOpen(false);
          }}
        >
          <ApplicationTypeTab
            activeMode={applicationFormMode}
            onChange={setApplicationFormMode}
          />
          {isInternal ? renderInternal() : renderExternal()}
        </Styled.Content>
      </Styled.MobileContainer>
      <FixedBottomButtonArea onClick={onSubmit}>저장하기</FixedBottomButtonArea>
      <ConfirmModal
        isOpen={pendingDeleteId !== undefined}
        onClose={() => setPendingDeleteInstantly(undefined)}
        title='질문을 삭제할까요?'
        description='삭제된 질문은 복구할 수 없습니다.'
        actions={[
          {
            label: '취소',
            variant: 'secondary',
            onClick: () => setPendingDeleteInstantly(undefined),
          },
          { label: '삭제', variant: 'primary', onClick: confirmDelete },
        ]}
      />
    </>
  );
};

export default ApplicationEditTabMobile;
