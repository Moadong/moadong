import QuestionTitle from '@/pages/AdminPage/application/components/QuestionTitle/QuestionTitle';
import QuestionDescription from '@/pages/AdminPage/application/components/QuestionDescription/QuestionDescription';
import { APPLICATION_FORM } from '@/constants/APPLICATION_FORM';
import { TextProps } from '@/types/application';
import CustomTextArea from '@/components/common/CustomTextArea/CustomTextArea';

const LongText = ({
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
      <CustomTextArea
        value={answer}
        onChange={(e) => onAnswerChange?.(e.target.value)}
        placeholder={APPLICATION_FORM.LONG_TEXT.placeholder}
        disabled={mode === 'builder'}
        showMaxChar={mode === 'answer'}
        maxLength={APPLICATION_FORM.LONG_TEXT.maxLength}
      />
    </div>
  );
};

export default LongText;
