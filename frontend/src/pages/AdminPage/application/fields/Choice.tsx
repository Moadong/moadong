import * as Styled from './Choice.styles';
import QuestionTitle from '@/pages/AdminPage/application/components/QuestionTitle/QuestionTitle';
import QuestionDescription from '@/pages/AdminPage/application/components/QuestionDescription/QuestionDescription';
import InputField from '@/components/common/InputField/InputField';
import { APPLICATION_FORM } from '@/constants/APPLICATION_FORM';
import { ChoiceProps } from '@/types/application';
import { useState } from 'react';

const MIN_ITEMS = 2;
const MAX_ITEMS = 6;

// todo inputField clear 버튼 빼기
// todo 입력 필드안에 항목 삭제 아이콘 추가
// todo mode : answer일때 다중, 단일 조건에 따라 선택 가능하도록 UI 및 기능 추가 필요
// todo isMulti나 질문 타입을 props로 받아서 단일 / 다중 판단 하면 될듯

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
}: ChoiceProps) => {
  const [selected, setSelected] = useState<number[]>([]);

  const handleItemChange = (index: number, newValue: string) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, value: newValue } : item,
    );
    onItemsChange?.(updated);
  };

  const handleAddItem = () => {
    if (items.length >= MAX_ITEMS) return;
    onItemsChange?.([...items, { value: '' }]);
  };

  const handleDeleteItem = (index: number) => {
    if (items.length <= MIN_ITEMS) return;
    const updated = items.filter((_, i) => i !== index);
    onItemsChange?.(updated);
  };

  const handleSelect = (index: number) => {
    if (mode !== 'answer') return;
    if (isMulti) {
      setSelected((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index],
      );
    } else {
      setSelected([index]);
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
      {items.map((item, index) => (
        <Styled.ItemWrapper
          key={index}
          onClick={() => handleSelect(index)}
          data-selected={
            mode === 'answer' && selected.includes(index) ? 'true' : undefined
          }
        >
          <InputField
            value={item.value}
            onChange={(e) => handleItemChange(index, e.target.value)}
            placeholder={APPLICATION_FORM.CHOICE.placeholder}
            disabled={false}
            readOnly={mode === 'answer'}
            showClearButton={false}
            bgColor={
              mode === 'answer' && selected.includes(index)
                ? '#FFE4DA'
                : undefined
            }
            textColor={
              mode === 'answer'
                ? selected.includes(index)
                  ? 'rgba(0,0,0,0.8)'
                  : 'rgba(0,0,0,0.3)'
                : undefined
            }
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
      ))}

      {mode === 'builder' && items.length < MAX_ITEMS && (
        <Styled.AddItemButton onClick={handleAddItem}>
          + 추가항목
        </Styled.AddItemButton>
      )}
    </div>
  );
};

export default Choice;
