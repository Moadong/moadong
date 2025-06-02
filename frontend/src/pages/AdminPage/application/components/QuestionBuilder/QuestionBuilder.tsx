import { useEffect, useState } from 'react';
import ShortText from '@/pages/AdminPage/application/fields/ShortText';
import Choice from '@/pages/AdminPage/application/fields/Choice';
import LongText from '@/pages/AdminPage/application/fields/LongText';
import { QuestionType } from '@/types/application';
import { QuestionBuilderProps } from '@/types/application';
import { QUESTION_LABEL_MAP } from '@/constants/APPLICATION_FORM';
import { DROPDOWN_OPTIONS } from '@/constants/APPLICATION_FORM';
import * as Styled from './QuestionBuilder.styles';
import CustomDropdown from '@/components/common/CustomDropDown/CustomDropDown';

const QuestionBuilder = ({
  id,
  title,
  description,
  options,
  items,
  type,
  onTitleChange,
  onItemsChange,
  onDescriptionChange,
  onTypeChange,
  onRequiredChange,
  onRemoveQuestion,
}: QuestionBuilderProps) => {
  if (!(type in QUESTION_LABEL_MAP)) {
    return null;
  }

  const [selectionType, setSelectionType] = useState<'single' | 'multi'>(
    type === 'MULTI_CHOICE' ? 'multi' : 'single',
  );

  useEffect(() => {
    if (type === 'MULTI_CHOICE') {
      setSelectionType('multi');
    } else if (type === 'CHOICE') {
      setSelectionType('single');
    }
  }, [type]);

  const renderFieldByQuestionType = () => {
    switch (type) {
      case 'SHORT_TEXT':
      case 'NAME':
      case 'EMAIL':
      case 'PHONE_NUMBER':
        return (
          <ShortText
            id={id}
            title={title}
            required={options?.required}
            description={description}
            mode='builder'
            onTitleChange={onTitleChange}
            onDescriptionChange={onDescriptionChange}
          />
        );
      case 'LONG_TEXT':
        return (
          <LongText
            id={id}
            title={title}
            required={options?.required}
            description={description}
            mode='builder'
            onTitleChange={onTitleChange}
            onDescriptionChange={onDescriptionChange}
          />
        );
      case 'CHOICE':
      case 'MULTI_CHOICE':
        return (
          <Choice
            id={id}
            title={title}
            required={options?.required}
            description={description}
            mode='builder'
            items={items}
            onTitleChange={onTitleChange}
            onDescriptionChange={onDescriptionChange}
            onItemsChange={onItemsChange}
            isMulti={type === 'MULTI_CHOICE'}
          />
        );
      default:
        return null;
    }
  };

  const renderSelectionToggle = () => {
    if (type !== 'CHOICE' && type !== 'MULTI_CHOICE') return null;

    return (
      <Styled.SelectionToggleWrapper>
        <Styled.SelectionToggleButton
          active={selectionType === 'single'}
          onClick={() => {
            setSelectionType('single');
            onTypeChange?.('CHOICE');
          }}
        >
          단일선택
        </Styled.SelectionToggleButton>
        <Styled.SelectionToggleButton
          active={selectionType === 'multi'}
          onClick={() => {
            setSelectionType('multi');
            onTypeChange?.('MULTI_CHOICE');
          }}
        >
          다중선택
        </Styled.SelectionToggleButton>
      </Styled.SelectionToggleWrapper>
    );
  };

  return (
    <Styled.QuestionWrapper>
      <Styled.QuestionMenu>
        <Styled.RequiredToggleButton
          onClick={() => onRequiredChange?.(!options?.required)}
        >
          답변 필수
          <Styled.RequiredToggleCircle active={options?.required} />
        </Styled.RequiredToggleButton>
        <CustomDropdown
          selected={type === 'MULTI_CHOICE' ? 'CHOICE' : type}
          options={DROPDOWN_OPTIONS}
          onSelect={(value) => {
            onTypeChange?.(value as QuestionType);
          }}
        />
        {renderSelectionToggle()}
        <button onClick={() => onRemoveQuestion()}>삭제</button>
      </Styled.QuestionMenu>
      <Styled.QuestionFieldContainer>
        {renderFieldByQuestionType()}
      </Styled.QuestionFieldContainer>
    </Styled.QuestionWrapper>
  );
};

export default QuestionBuilder;
