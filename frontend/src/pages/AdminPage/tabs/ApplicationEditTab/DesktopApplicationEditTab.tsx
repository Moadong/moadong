import React from 'react';
import * as Styled from './ApplicationEditTab.styles';
import { PageContainer } from '@/styles/PageContainer.styles';
import CustomTextArea from '@/components/common/CustomTextArea/CustomTextArea';
import QuestionBuilder from '@/pages/AdminPage/components/QuestionBuilder/QuestionBuilder';
import { QuestionDivider } from './ApplicationEditTab.styles';
import { APPLICATION_FORM } from '@/constants/APPLICATION_FORM';
import { ApplicationFormData, QuestionType } from '@/types/application';

interface ApplicationEditTabProps {
  formData: ApplicationFormData;
  handleFormTitleChange: (value: string) => void;
  handleFormDescriptionChange: (value: string) => void;
  handleTitleChange: (id: number) => (value: string) => void;
  handleDescriptionChange: (id: number) => (value: string) => void;
  handleItemsChange: (id: number) => (items: { value: string }[]) => void;
  handleTypeChange: (id: number) => (newType: QuestionType) => void;
  handleRequiredChange: (id: number) => (value: boolean) => void;
  removeQuestion: (id: number) => void;
  addQuestion: () => void;
  handleSubmit: () => void;
}

const DesktopApplicationEditTab = ({
  formData,
  handleFormTitleChange,
  handleFormDescriptionChange,
  handleTitleChange,
  handleDescriptionChange,
  handleItemsChange,
  handleTypeChange,
  handleRequiredChange,
  removeQuestion,
  addQuestion,
  handleSubmit,
}: ApplicationEditTabProps) => {
  return (
    <PageContainer>
      <Styled.FormTitle
        type='text'
        value={formData.title}
        onChange={(e) => handleFormTitleChange(e.target.value)}
        placeholder='지원서 제목을 입력하세요'
      ></Styled.FormTitle>
      <CustomTextArea
        label='지원서 설명'
        value={formData.description}
        onChange={(e) => handleFormDescriptionChange(e.target.value)}
        placeholder={APPLICATION_FORM.APPLICATION_DESCRIPTION.placeholder}
        maxLength={APPLICATION_FORM.APPLICATION_DESCRIPTION.maxLength}
        showMaxChar
        width='100%'
      />
      <Styled.QuestionContainer>
        {formData.questions.map((question, index) => (
          <QuestionBuilder
            key={question.id}
            id={index + 1}
            title={question.title}
            description={question.description}
            options={question.options}
            items={question.items}
            type={question.type}
            readOnly={index === 0} //인덱스 0번은 이름을 위한 고정 부분이므로 수정 불가
            onTitleChange={handleTitleChange(question.id)}
            onDescriptionChange={handleDescriptionChange(question.id)}
            onItemsChange={handleItemsChange(question.id)}
            onTypeChange={handleTypeChange(question.id)}
            onRequiredChange={handleRequiredChange(question.id)}
            onRemoveQuestion={() => removeQuestion(question.id)}
          />
        ))}
      </Styled.QuestionContainer>
      <QuestionDivider />
      <Styled.AddQuestionButton onClick={addQuestion}>
        질문 추가 +
      </Styled.AddQuestionButton>
      <Styled.ButtonWrapper>
        <Styled.submitButton onClick={handleSubmit}>
          저장하기
        </Styled.submitButton>
      </Styled.ButtonWrapper>
    </PageContainer>
  );
};

export default DesktopApplicationEditTab;
