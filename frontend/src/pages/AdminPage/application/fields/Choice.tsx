import * as Styled from './Choice.styles';
import QuestionTitle from '@/pages/AdminPage/application/components/QuestionTitle/QuestionTitle';
import QuestionDescription from '@/pages/AdminPage/application/components/QuestionDescription/QuestionDescription';
import InputField from '@/components/common/InputField/InputField';
import APPLICATION_FORM from '@/constants/APPLICATION_FORM';
import { ChoiceProps } from '@/types/application';

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
