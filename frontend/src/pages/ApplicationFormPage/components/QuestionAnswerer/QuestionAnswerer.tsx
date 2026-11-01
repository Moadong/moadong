import Choice from '@/components/application/questionTypes/Choice';
import LongText from '@/components/application/questionTypes/LongText';
import ShortText from '@/components/application/questionTypes/ShortText';
import { Question } from '@/types/application';

interface QuestionAnswererProps {
  question: Question;
  /** 화면에 보이는 질문 번호. 질문 id는 순서와 무관하므로 번호로 쓰지 않는다 */
  number: number;
  selectedAnswers: string[];
  onChange: (id: number, value: string | string[]) => void;
}

const QuestionAnswerer = ({
  question,
  number,
  selectedAnswers,
  onChange,
}: QuestionAnswererProps) => {
  const baseProps = {
    id: number,
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
