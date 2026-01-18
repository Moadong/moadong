import QuestionDescription from '@/components/application/QuestionDescription/QuestionDescription';
import QuestionTitle from '@/components/application/QuestionTitle/QuestionTitle';
import CustomTextArea from '@/components/common/CustomTextArea/CustomTextArea';
import { APPLICATION_FORM } from '@/constants/applicationForm';
import { TextProps } from '@/types/application';

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
