import { Question } from '@/types/application';
import ShortText from '@/components/application/questionTypes/ShortText';
import LongText from '@/components/application/questionTypes/LongText';
import Choice from '@/components/application/questionTypes/Choice';

interface QuestionAnswererProps {
  question: Question;
  selectedAnswers: string[];
  onChange: (id: number, value: string | string[]) => void;
}

const QuestionAnswerer = ({
  question,
  selectedAnswers,
  onChange,
}: QuestionAnswererProps) => {
  const baseProps = {
    id: question.id,
    title: question.title,
    description: question.description,
    required: question.options.required,
    mode: 'answer' as const,
  };

  switch (question.type) {
    case 'NAME':
    case 'EMAIL':
    case 'PHONE_NUMBER':
    case 'SHORT_TEXT':
      return (
        <ShortText
          {...baseProps}
          answer={selectedAnswers[0] ?? ''}
          onAnswerChange={(value) => onChange(question.id, value)}
        />
      );

    case 'LONG_TEXT':
      return (
        <LongText
          {...baseProps}
          answer={selectedAnswers[0] ?? ''}
          onAnswerChange={(value) => onChange(question.id, value)}
        />
      );

    case 'CHOICE':
    case 'MULTI_CHOICE':
      return (
        <Choice
          {...baseProps}
          items={question.items}
          isMulti={question.type === 'MULTI_CHOICE'}
          answer={selectedAnswers}
          onAnswerChange={(value) => onChange(question.id, value)}
        />
      );

    default:
      return <div>지원하지 않는 질문 유형입니다: {question.type}</div>;
  }
};

export default QuestionAnswerer;
