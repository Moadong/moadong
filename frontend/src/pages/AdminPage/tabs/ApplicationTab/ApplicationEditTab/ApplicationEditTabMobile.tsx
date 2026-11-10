import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reorder } from 'framer-motion';
import ConfirmModal from '@/components/common/ConfirmModal/ConfirmModal';
import FixedBottomButtonArea from '@/components/common/FixedBottomButtonArea/FixedBottomButtonArea';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import {
  APPLICATION_FORM,
  NAME_QUESTION_ID,
} from '@/constants/applicationForm';
import LongPressReorderItem from '@/pages/AdminPage/components/LongPressReorderItem/LongPressReorderItem';
import QuestionAnswerer from '@/pages/ApplicationFormPage/components/QuestionAnswerer/QuestionAnswerer';
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

const FORM_TITLE_MAX_LENGTH = 50;

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

  const confirmDelete = () => {
    if (pendingDeleteId !== undefined) removeQuestion(pendingDeleteId);
    setPendingDeleteId(undefined);
  };

  const renderInfoTab = () => (
    <Styled.FieldList>
      <Styled.Field>
        <Styled.FieldHeader>
          <span>지원서 제목</span>
          <span>
            {formData.title.length}/{FORM_TITLE_MAX_LENGTH}
          </span>
        </Styled.FieldHeader>
        <Styled.TextInput
          aria-label='지원서 제목'
          value={formData.title}
          maxLength={FORM_TITLE_MAX_LENGTH}
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
                  setPendingDeleteId(question.id);
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
            {formData.title.length}/{FORM_TITLE_MAX_LENGTH}
          </span>
        </Styled.FieldHeader>
        <Styled.TextInput
          aria-label='지원서 제목'
          value={formData.title}
          maxLength={FORM_TITLE_MAX_LENGTH}
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
        <Styled.Content>
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
        onClose={() => setPendingDeleteId(undefined)}
        title='질문을 삭제할까요?'
        description='삭제된 질문은 복구할 수 없습니다.'
        actions={[
          {
            label: '취소',
            variant: 'secondary',
            onClick: () => setPendingDeleteId(undefined),
          },
          { label: '삭제', variant: 'primary', onClick: confirmDelete },
        ]}
      />
    </>
  );
};

export default ApplicationEditTabMobile;
