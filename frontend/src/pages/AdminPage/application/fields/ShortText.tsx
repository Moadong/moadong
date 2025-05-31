import QuestionTitle from '@/pages/AdminPage/application/components/QuestionTitle/QuestionTitle';
import QuestionDescription from '@/pages/AdminPage/application/components/QuestionDescription/QuestionDescription';
import InputField from '@/components/common/InputField/InputField';
import APPLICATION_FORM from '@/constants/APPLICATION_FORM';
import { TextProps } from '@/types/application';

const ShortText = ({
  id,
  title,
  description,
  required,
  answer,
  mode,
  onAnswerChange,
  onTitleChange,
  onDescriptionChange,
}: TextProps) => {
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
        onChange={(e) => onAnswerChange?.(e.target.value)}
        placeholder={APPLICATION_FORM.SHORT_TEXT.placeholder}
        disabled={mode === 'builder'}
      />
    </div>
  );
};

export default ShortText;
