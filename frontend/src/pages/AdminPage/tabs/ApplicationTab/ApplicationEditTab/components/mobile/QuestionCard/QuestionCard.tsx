import { useState } from 'react';
import ChevronDownIcon from '@/assets/images/icons/chevron_down_dark.svg?react';
import clearIcon from '@/assets/images/icons/dark_clear_button_icon.svg';
import DeleteIcon from '@/assets/images/icons/delete_question_gray.svg?react';
import { CustomDropDown } from '@/components/common/CustomDropDown/CustomDropDown';
import {
  APPLICATION_FORM,
  DROPDOWN_OPTIONS,
  QUESTION_LABEL_MAP,
} from '@/constants/applicationForm';
import { Question, QuestionType } from '@/types/application';
import * as Styled from './QuestionCard.styles';

const { minItems: MIN_ITEMS, maxItems: MAX_ITEMS } = APPLICATION_FORM.CHOICE;

interface QuestionCardProps {
  /** 화면에 보이는 질문 번호. 질문 id가 아니라 현재 순서 */
  number: number;
  question: Question;
  focused: boolean;
  /** 이름 질문처럼 수정·삭제할 수 없는 질문 */
  readOnly: boolean;
  onFocus: () => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onItemsChange: (items: { value: string }[]) => void;
  onTypeChange: (type: QuestionType) => void;
  onRequiredChange: (required: boolean) => void;
  onRemove: () => void;
}

const QuestionCard = ({
  number,
  question,
  focused,
  readOnly,
  onFocus,
  onTitleChange,
  onDescriptionChange,
  onItemsChange,
  onTypeChange,
  onRequiredChange,
  onRemove,
}: QuestionCardProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [focusedItemIndex, setFocusedItemIndex] = useState<number>();

  if (!(question.type in QUESTION_LABEL_MAP)) return null;

  const isChoice =
    question.type === 'CHOICE' || question.type === 'MULTI_CHOICE';
  const isMulti = question.type === 'MULTI_CHOICE';
  const selectedType = isMulti ? 'CHOICE' : question.type;
  const selectedLabel = QUESTION_LABEL_MAP[question.type];
  const items = question.items ?? [];

  const handleItemChange = (index: number, value: string) =>
    onItemsChange(
      items.map((item, i) => (i === index ? { ...item, value } : item)),
    );

  const renderAnswerArea = () => {
    if (isChoice) {
      return (
        <Styled.ItemList>
          {items.map((item, index) => (
            <Styled.ItemRow
              key={index}
              // 포커스가 입력창과 X 버튼 사이를 오가는 동안에는 X를 유지해 키보드로도 누를 수 있게 한다
              onFocus={() => setFocusedItemIndex(index)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                  setFocusedItemIndex(undefined);
                }
              }}
            >
              <Styled.ItemInputWrapper>
                <Styled.ItemInput
                  aria-label={`선택지 ${index + 1}`}
                  value={item.value}
                  maxLength={APPLICATION_FORM.CHOICE.maxLength}
                  placeholder={APPLICATION_FORM.CHOICE.placeholder}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                />
                {focusedItemIndex === index &&
                  (item.value.length > 0 || items.length > MIN_ITEMS) && (
                    <Styled.ItemClearButton
                      type='button'
                      aria-label={item.value ? '선택지 지우기' : '선택지 삭제'}
                      // 마우스로 누를 때 입력창 포커스가 빠져 버튼이 사라지지 않게 한다
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        // 글자가 있으면 지우고, 비어 있으면 항목을 없앤다(최소 항목 수는 유지)
                        if (item.value) handleItemChange(index, '');
                        else onItemsChange(items.filter((_, i) => i !== index));
                      }}
                    >
                      <img src={clearIcon} alt='' aria-hidden='true' />
                    </Styled.ItemClearButton>
                  )}
              </Styled.ItemInputWrapper>
            </Styled.ItemRow>
          ))}
          {items.length < MAX_ITEMS && (
            <Styled.AddItemButton
              type='button'
              onClick={() => onItemsChange([...items, { value: '' }])}
            >
              + 추가항목
            </Styled.AddItemButton>
          )}
        </Styled.ItemList>
      );
    }
    const limit =
      question.type === 'LONG_TEXT'
        ? APPLICATION_FORM.LONG_TEXT
        : APPLICATION_FORM.SHORT_TEXT;
    return (
      <Styled.AnswerPlaceholder>{limit.placeholder}</Styled.AnswerPlaceholder>
    );
  };

  return (
    <Styled.Card $focused={focused} onFocusCapture={onFocus}>
      <Styled.Body $locked={readOnly}>
        <Styled.DropdownWrapper>
          <CustomDropDown
            selected={selectedType}
            options={DROPDOWN_OPTIONS}
            onSelect={(value) => {
              // 복수선택인 객관식에서 "객관식"을 다시 골라도 복수선택이 풀리지 않게 한다
              if (value !== selectedType) onTypeChange(value as QuestionType);
            }}
            open={isDropdownOpen}
            onToggle={(isOpen) => setIsDropdownOpen(!isOpen)}
          >
            <CustomDropDown.Trigger>
              <Styled.TypeTrigger
                type='button'
                disabled={readOnly}
                $open={isDropdownOpen}
              >
                <span>{selectedLabel}</span>
                <ChevronDownIcon aria-hidden='true' />
              </Styled.TypeTrigger>
            </CustomDropDown.Trigger>
            <CustomDropDown.Menu>
              {DROPDOWN_OPTIONS.map(({ label, value }) => (
                <CustomDropDown.Item key={value} value={value}>
                  {label}
                </CustomDropDown.Item>
              ))}
            </CustomDropDown.Menu>
          </CustomDropDown>
        </Styled.DropdownWrapper>
        <Styled.MetaRow>
          <Styled.ToggleGroup>
            <Styled.ToggleButton
              type='button'
              disabled={readOnly}
              aria-pressed={question.options?.required}
              onClick={() => onRequiredChange(!question.options?.required)}
            >
              답변필수
              <Styled.CheckCircle
                $checked={!!question.options?.required}
                aria-hidden='true'
              >
                ✓
              </Styled.CheckCircle>
            </Styled.ToggleButton>
            {isChoice && (
              <Styled.ToggleButton
                type='button'
                disabled={readOnly}
                aria-pressed={isMulti}
                onClick={() =>
                  onTypeChange(isMulti ? 'CHOICE' : 'MULTI_CHOICE')
                }
              >
                복수선택
                <Styled.CheckCircle $checked={isMulti} aria-hidden='true'>
                  ✓
                </Styled.CheckCircle>
              </Styled.ToggleButton>
            )}
          </Styled.ToggleGroup>
          {!readOnly && (
            <Styled.DeleteButton
              type='button'
              aria-label={`질문 ${number} 삭제`}
              onClick={onRemove}
            >
              <DeleteIcon aria-hidden='true' />
              삭제
            </Styled.DeleteButton>
          )}
        </Styled.MetaRow>
        <Styled.QuestionHead>
          <Styled.QuestionNumber>{number}.</Styled.QuestionNumber>
          <Styled.TitleInput
            aria-label={`질문 ${number} 제목`}
            value={question.title}
            maxLength={APPLICATION_FORM.QUESTION_TITLE.maxLength}
            placeholder={APPLICATION_FORM.QUESTION_TITLE.placeholder}
            readOnly={readOnly}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </Styled.QuestionHead>
        <Styled.DescriptionInput
          aria-label={`질문 ${number} 설명`}
          value={question.description}
          maxLength={APPLICATION_FORM.QUESTION_DESCRIPTION.maxLength}
          placeholder={APPLICATION_FORM.QUESTION_DESCRIPTION.placeholder}
          readOnly={readOnly}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
        {renderAnswerArea()}
      </Styled.Body>
    </Styled.Card>
  );
};

export default QuestionCard;
