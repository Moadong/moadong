import styled from 'styled-components';
import { useEffect, useState } from 'react';
import ShortText from '@/pages/AdminPage/application/fields/ShortText';
import dropdown_icon from '@/assets/images/icons/drop_button_icon.svg';
import Choice from '@/pages/AdminPage/application/fields/Choice';

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
  options?: { value: string }[];
  type: QuestionType;
  required: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onItemsChange?: (newItems: { value: string }[]) => void;
  onTypeChange?: (type: QuestionType) => void;
}

const QuestionMenu = styled.div`
  display: flex;
  width: 140px;
  flex-direction: column;
  gap: 4px;
`;

const RequiredToggleButton = styled.div`
  display: flex;
  border: none;
  padding: 12px 16px;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.375rem;
  background: #f5f5f5;
  cursor: pointer;
  margin: 0;

  color: #787878;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const RequiredToggleCircle = styled.span<{ active?: boolean }>`
  position: relative;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid ${(props) => (props.active ? '#ff5000' : '#ccc')};
  background-color: ${(props) => (props.active ? '#ff5000' : 'white')};

  ${({ active }) =>
    active &&
    `
    background-color: #fff;
    &::after {
      content: '';
      width: 10px;
      height: 10px;
      background-color: #ff5000;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  `}
`;

const DropDownWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Dropdown = styled.select`
  display: flex;
  width: 100%;
  border: none;
  padding: 12px 16px;
  border-radius: 0.375rem;
  background: #f5f5f5;
  color: #787878;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 600;
  cursor: pointer;
  appearance: none;
`;

const DropdownIcon = styled.img`
  position: absolute;
  top: 50%;
  right: 19px;
  transform: translateY(-50%);
  pointer-events: none;
`;

const SelectionToggleWrapper = styled.div`
  display: flex;
  background-color: #f7f7f7;
  border-radius: 0.375rem;
  padding: 2px;
`;

const SelectionToggleButton = styled.button<{ active: boolean }>`
  border: none;
  background-color: ${(props) => (props.active ? '#ddd' : 'transparent')};
  color: #787878;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: -0.42px;
  white-space: nowrap;
`;

const QuestionWrapper = styled.div`
  display: flex;
  gap: 36px;
`;

const QuestionBuilder = ({
  id,
  title,
  description,
  required,
  options,
  type,
  onTitleChange,
  onItemsChange,
  onDescriptionChange,
  onTypeChange,
}: QuestionBuilderProps) => {
  const [isRequired, setIsRequired] = useState(required);
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
            required={isRequired}
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
            required={isRequired}
            description={description}
            mode='builder'
            items={options}
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
      <SelectionToggleWrapper>
        <SelectionToggleButton
          active={selectionType === 'single'}
          onClick={() => {
            setSelectionType('single');
            setQuestionType('CHOICE');
            onTypeChange?.('CHOICE');
          }}
        >
          단일선택
        </SelectionToggleButton>
        <SelectionToggleButton
          active={selectionType === 'multi'}
          onClick={() => {
            setSelectionType('multi');
            setQuestionType('MULTI_CHOICE');
            onTypeChange?.('MULTI_CHOICE');
          }}
        >
          다중선택
        </SelectionToggleButton>
      </SelectionToggleWrapper>
    );
  };

  return (
    <QuestionWrapper>
      <QuestionMenu>
        <RequiredToggleButton onClick={() => setIsRequired(!isRequired)}>
          답변 필수
          <RequiredToggleCircle active={isRequired} />
        </RequiredToggleButton>
        <DropDownWrapper>
          <DropdownIcon
            src={dropdown_icon}
            alt={'질문 타입 선택하기'}
          ></DropdownIcon>
          <Dropdown
            value={questionType}
            onChange={(e) => {
              const selectedType = e.target.value as QuestionType;
              setQuestionType(selectedType);
              onTypeChange?.(selectedType); // 상위 상태도 업데이트
            }}
          >
            <option value='CHOICE'>객관식</option>
            <option value='SHORT_TEXT'>단답형</option>
          </Dropdown>
        </DropDownWrapper>
        {renderSelectionToggle()}
      </QuestionMenu>
      {renderFieldByQuestionType()}
    </QuestionWrapper>
  );
};

export default QuestionBuilder;
