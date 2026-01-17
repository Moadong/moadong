import QuestionDescription from '@/components/application/QuestionDescription/QuestionDescription';
import QuestionTitle from '@/components/application/QuestionTitle/QuestionTitle';
import InputField from '@/components/common/InputField/InputField';
import { APPLICATION_FORM } from '@/constants/applicationForm';
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
    <>
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
        readOnly={mode === 'builder'}
        showMaxChar={mode === 'answer'}
        maxLength={APPLICATION_FORM.SHORT_TEXT.maxLength}
        showClearButton={false}
        width={'60%'}
      />
    </>
  );
};

export default ShortText;
