import { useEffect, useState } from 'react';
import ShortText from '@/pages/AdminPage/application/fields/ShortText';
import dropdown_icon from '@/assets/images/icons/drop_button_icon.svg';
import Choice from '@/pages/AdminPage/application/fields/Choice';
import * as Styled from './QuestionBuilder.styles';

type QuestionType =
  | 'CHOICE'
  | 'MULTI_CHOICE'
  | 'SHORT_TEXT'
  | 'LONG_TEXT'
  | 'PHONE_NUMBER'
  | 'EMAIL'
  | 'NAME';

interface QuestionBuilderProps {
  id: number;
  title: string;
  description: string;
  items?: { value: string }[];
  type: QuestionType;
  required: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onItemsChange?: (newItems: { value: string }[]) => void;
  onTypeChange?: (type: QuestionType) => void;
  onRequiredChange?: (required: boolean) => void;
}

const QuestionBuilder = ({
  id,
  title,
  description,
  required,
  items,
  type,
  onTitleChange,
  onItemsChange,
  onDescriptionChange,
  onTypeChange,
  onRequiredChange,
}: QuestionBuilderProps) => {
  const [selectionType, setSelectionType] = useState<'single' | 'multi'>(
    type === 'MULTI_CHOICE' ? 'multi' : 'single',
  );
  const [questionType, setQuestionType] = useState<QuestionType>(type);

  useEffect(() => {
    if (type === 'MULTI_CHOICE') {
      setSelectionType('multi');
    } else if (type === 'CHOICE') {
      setSelectionType('single');
    }
  }, [type]);

  const renderFieldByQuestionType = () => {
    switch (questionType) {
      case 'SHORT_TEXT':
      case 'NAME':
      case 'EMAIL':
      case 'PHONE_NUMBER':
        return (
          <ShortText
            id={id}
            title={title}
            required={required}
            description={description}
            mode='builder'
            onTitleChange={onTitleChange}
            onDescriptionChange={onDescriptionChange}
          />
        );
      // Todo case 'LONG_TEXT': 와 같은 다른 케이스도 여기서 렌더링 가능
      case 'CHOICE':
      case 'MULTI_CHOICE':
        return (
          <Choice
            id={id}
            title={title}
            required={required}
            description={description}
            mode='builder'
            items={items}
            onTitleChange={onTitleChange}
            onDescriptionChange={onDescriptionChange}
            onItemsChange={onItemsChange}
            isMulti={questionType === 'MULTI_CHOICE'}
          />
        );
      default:
        return null;
    }
  };

  const renderSelectionToggle = () => {
    if (questionType !== 'CHOICE' && questionType !== 'MULTI_CHOICE')
      return null;

    return (
      <Styled.SelectionToggleWrapper>
        <Styled.SelectionToggleButton
          active={selectionType === 'single'}
          onClick={() => {
            setSelectionType('single');
            setQuestionType('CHOICE');
            onTypeChange?.('CHOICE');
          }}
        >
          단일선택
        </Styled.SelectionToggleButton>
        <Styled.SelectionToggleButton
          active={selectionType === 'multi'}
          onClick={() => {
            setSelectionType('multi');
            setQuestionType('MULTI_CHOICE');
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
          onClick={() => onRequiredChange?.(!required)}
        >
          답변 필수
          <Styled.RequiredToggleCircle active={required} />
        </Styled.RequiredToggleButton>
        <Styled.DropDownWrapper>
          <Styled.DropdownIcon
            src={dropdown_icon}
            alt={'질문 타입 선택하기'}
          ></Styled.DropdownIcon>
          <Styled.Dropdown
            value={questionType}
            onChange={(e) => {
              const selectedType = e.target.value as QuestionType;
              setQuestionType(selectedType);
              onTypeChange?.(selectedType);
            }}
          >
            <option value='CHOICE'>객관식</option>
            <option value='SHORT_TEXT'>단답형</option>
          </Styled.Dropdown>
        </Styled.DropDownWrapper>
        {renderSelectionToggle()}
      </Styled.QuestionMenu>
      {renderFieldByQuestionType()}
    </Styled.QuestionWrapper>
  );
};

export default QuestionBuilder;
