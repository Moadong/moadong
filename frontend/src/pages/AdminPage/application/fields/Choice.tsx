import styled from 'styled-components';
import QuestionTitle from '@/pages/AdminPage/application/components/QuestionTitle/QuestionTitle';
import QuestionDescription from '@/pages/AdminPage/application/components/QuestionDescription/QuestionDescription';
import InputField from '@/components/common/InputField/InputField';
import APPLICATION_FORM from '@/constants/APPLICATION_FORM';

interface ChoiceProps {
  id: number;
  title: string;
  description: string;
  required: boolean;
  mode: 'builder' | 'answer';
  onTitleChange?: (value: string) => void;
  onDescriptionChange?: (value: string) => void;
  items?: { value: string }[];
  answer?: string;
  isMulti?: boolean;
  onItemsChange?: (newItems: { value: string }[]) => void;
}

const AddItemButton = styled.button`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 0.875rem;
  font-weight: 500;
  background: white;
  color: #555;
  margin-top: 8px;
  cursor: pointer;
`;

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const DeleteButton = styled.button`
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #ffecec;
  color: #e33;
  border: 1px solid #f99;
  cursor: pointer;
`;

const MIN_ITEMS = 2;
const MAX_ITEMS = 6;

//todo isMulti나 질문 타입을 props로 받아서 다중 선택이 가능하도록 기능 추가 필요
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
  const filledItems =
    items.length >= MIN_ITEMS
      ? items
      : [
          ...items,
          ...Array.from({ length: MIN_ITEMS - items.length }, () => ({
            value: '',
          })),
        ];

  const handleItemChange = (index: number, newValue: string) => {
    const updated = [...items];
    updated[index].value = newValue;
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

  return (
    <div>
      <QuestionTitle
        id={id}
        title={title}
        required={required}
        mode={mode}
        onChange={onTitleChange}
      />
      <QuestionDescription
        description={description}
        mode={mode}
        onChange={onDescriptionChange}
      />
      {filledItems.map((item, index) => (
        <ItemWrapper key={index}>
          <InputField
            value={item.value}
            onChange={(e) => handleItemChange(index, e.target.value)}
            placeholder={APPLICATION_FORM.CHOICE.placeholder}
            disabled={mode === 'answer'}
          />
          {mode === 'builder' && items.length > MIN_ITEMS && (
            <DeleteButton onClick={() => handleDeleteItem(index)}>
              삭제
            </DeleteButton>
          )}
        </ItemWrapper>
      ))}

      {mode === 'builder' && items.length < MAX_ITEMS && (
        <AddItemButton onClick={handleAddItem}>+ 추가항목</AddItemButton>
      )}
    </div>
  );
};

export default Choice;
