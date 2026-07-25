import QuestionDescription from '@/components/application/QuestionDescription/QuestionDescription';
import QuestionTitle from '@/components/application/QuestionTitle/QuestionTitle';
import CustomTextArea from '@/components/common/CustomTextArea/CustomTextArea';
import InputField from '@/components/common/InputField/InputField';
import { APPLICATION_FORM } from '@/constants/applicationForm';
import { TextProps } from '@/types/application';

interface ShortTextProps extends TextProps {
  /** 답변이 입력폭을 넘으면 잘리지 않고 세로로 늘어나도록 textarea로 렌더링한다. */
  multiline?: boolean;
}

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
  multiline = false,
}: ShortTextProps) => {
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
      {multiline ? (
        <CustomTextArea
          value={answer}
          onChange={(e) => onAnswerChange?.(e.target.value)}
          onClear={() => onAnswerChange?.('')}
          placeholder={APPLICATION_FORM.SHORT_TEXT.placeholder}
          disabled={mode === 'builder'}
          showMaxChar={mode === 'answer'}
          maxLength={APPLICATION_FORM.SHORT_TEXT.maxLength}
          showClearButton={mode === 'answer'}
          width={'60%'}
        />
      ) : (
        <InputField
          value={answer}
          onChange={(e) => onAnswerChange?.(e.target.value)}
          onClear={() => onAnswerChange?.('')}
          placeholder={APPLICATION_FORM.SHORT_TEXT.placeholder}
          disabled={mode === 'builder'}
          readOnly={mode === 'builder'}
          showMaxChar={mode === 'answer'}
          maxLength={APPLICATION_FORM.SHORT_TEXT.maxLength}
          showClearButton={mode === 'answer'}
          width={'60%'}
        />
      )}
    </>
  );
};

export default ShortText;
