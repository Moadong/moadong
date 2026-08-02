import { Question } from '@/types/application';
import * as Styled from './AnswerCard.styles';

const CHOICE_TYPES = ['CHOICE', 'MULTI_CHOICE'] as const;
type ChoiceType = (typeof CHOICE_TYPES)[number];

const isChoiceType = (type: string): type is ChoiceType =>
  (CHOICE_TYPES as readonly string[]).includes(type);

interface AnswerCardProps {
  index: number;
  question: Question;
  answers: string[];
}

const AnswerCard = ({ index, question, answers }: AnswerCardProps) => {
  const hasAnswer = answers.length > 0 && answers.some((a) => a.trim() !== '');
  const answerText = answers[0] ?? '';

  return (
    <Styled.Card>
      <Styled.Header>
        <Styled.QuestionMeta>
          <Styled.QuestionIndex>Q{index}</Styled.QuestionIndex>
          {question.options.required && <Styled.Required>*</Styled.Required>}
        </Styled.QuestionMeta>
        <Styled.QuestionTitle>{question.title}</Styled.QuestionTitle>
        {question.description && (
          <Styled.QuestionDescription>
            {question.description}
          </Styled.QuestionDescription>
        )}
      </Styled.Header>

      <Styled.AnswerSection>
        {isChoiceType(question.type) ? (
          <Styled.ChoiceList>
            {question.items.map(({ value }) => {
              const isSelected = answers.includes(value);
              return (
                <Styled.ChoiceItem key={value} $isSelected={isSelected}>
                  <Styled.ChoiceIndicator
                    $isSelected={isSelected}
                    $isMulti={question.type === 'MULTI_CHOICE'}
                  />
                  <Styled.ChoiceLabel $isSelected={isSelected}>
                    {value}
                  </Styled.ChoiceLabel>
                </Styled.ChoiceItem>
              );
            })}
          </Styled.ChoiceList>
        ) : (
          <Styled.TextAnswer $isEmpty={!hasAnswer}>
            {hasAnswer ? answerText : '답변 없음'}
          </Styled.TextAnswer>
        )}
      </Styled.AnswerSection>
    </Styled.Card>
  );
};

export default AnswerCard;
