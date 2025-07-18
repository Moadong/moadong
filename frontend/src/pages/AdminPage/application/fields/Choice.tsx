import * as Styled from './Choice.styles';
import QuestionTitle from '@/pages/AdminPage/application/components/QuestionTitle/QuestionTitle';
import QuestionDescription from '@/pages/AdminPage/application/components/QuestionDescription/QuestionDescription';
import InputField from '@/components/common/InputField/InputField';
import { APPLICATION_FORM } from '@/constants/APPLICATION_FORM';
import { ChoiceProps } from '@/types/application';

const MIN_ITEMS = 2;
const MAX_ITEMS = 6;

const Choice = ({
  id,
  title,
  description,
  required,
  mode,
  onTitleChange,
  onDescriptionChange,
  items = [],
  isMulti,
  onItemsChange,
  answer = [],
  onAnswerChange,
}: ChoiceProps) => {
  // — 아이템 텍스트 변경(빌더 모드 전용)
  const handleItemChange = (index: number, newValue: string) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, value: newValue } : item,
    );
    onItemsChange?.(updated);
  };

  // — 아이템 추가(빌더 모드 전용)
  const handleAddItem = () => {
    if (items.length >= MAX_ITEMS) return;
    onItemsChange?.([...items, { value: '' }]);
  };

  // — 아이템 삭제(빌더 모드 전용)
  const handleDeleteItem = (index: number) => {
    if (items.length <= MIN_ITEMS) return;
    const updated = items.filter((_, i) => i !== index);
    onItemsChange?.(updated);
  };

  const handleSelect = (idx: number) => {
    if (mode !== 'answer') return;
    const value = items[idx].value;
    if (!value) return;

    if (isMulti) {
      if (Array.isArray(answer)) {
        if (answer.includes(value)) {
          onAnswerChange?.(answer.filter((v) => v !== value));
        } else {
          onAnswerChange?.([...answer, value]);
        }
      }
      // 다중 선택: 이미 포함되어 있으면 제거, 아니면 추가
    } else {
      // 단일 선택: 클릭된 값만 넘김
      onAnswerChange?.(value);
    }
  };

  return (
    <div>
      <QuestionTitle
        id={id}
        title={title}
        required={required}
        mode={mode}
        onTitleChange={onTitleChange}
      />
      <QuestionDescription
        description={description}
        mode={mode}
        onDescriptionChange={onDescriptionChange}
      />

      {items.map((item, index) => {
        // ▶ selected 대신, answer.includes(item.value)로 판별
        const isSelected = mode === 'answer' && answer.includes(item.value);

        return (
          <Styled.ItemWrapper
            key={index}
            onClick={() => handleSelect(index)}
            data-selected={isSelected ? 'true' : undefined}
          >
            <InputField
              value={item.value}
              onChange={(e) => handleItemChange(index, e.target.value)}
              placeholder={APPLICATION_FORM.CHOICE.placeholder}
              readOnly={mode === 'answer'}
              showClearButton={false}
              bgColor={isSelected ? '#FFE4DA' : '#F5F5F5'}
              textColor={
                mode === 'answer'
                  ? isSelected
                    ? 'rgba(0,0,0,0.8)'
                    : 'rgba(0,0,0,0.3)'
                  : undefined
              }
              borderColor={isSelected ? '#FF5414' : undefined}
            />

            {mode === 'builder' && items.length > MIN_ITEMS && (
              <Styled.DeleteButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteItem(index);
                }}
              >
                삭제
              </Styled.DeleteButton>
            )}
          </Styled.ItemWrapper>
        );
      })}

      {mode === 'builder' && items.length < MAX_ITEMS && (
        <Styled.AddItemButton onClick={handleAddItem}>
          + 추가항목
        </Styled.AddItemButton>
      )}
    </div>
  );
};

export default Choice;
