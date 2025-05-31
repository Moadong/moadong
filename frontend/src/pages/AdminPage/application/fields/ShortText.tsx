import QuestionTitle from '@/pages/AdminPage/application/components/QuestionTitle/QuestionTitle';
import QuestionDescription from '@/pages/AdminPage/application/components/QuestionDescription/QuestionDescription';
import InputField from '@/components/common/InputField/InputField';
import APPLICATION_FORM from '@/constants/APPLICATION_FORM';

interface ShortTextProps {
  id: number;
  title: string;
  description: string;
  required: boolean;
  mode: 'builder' | 'answer';
  answer?: string;
  onChange?: (value: string) => void;
  onTitleChange?: (value: string) => void;
  onDescriptionChange?: (value: string) => void;
}

const ShortText = ({
  id,
  title,
  description,
  required,
  answer,
  mode,
  onChange,
  onTitleChange,
  onDescriptionChange,
}: ShortTextProps) => {
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
      <InputField
        value={answer}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={APPLICATION_FORM.SHORT_TEXT.placeholder}
        disabled={mode === 'builder'}
      />
    </div>
  );
};

export default ShortText;
