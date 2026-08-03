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
      <Styled.QuestionRow>
        <Styled.QuestionIndex>{index}.</Styled.QuestionIndex>
        <Styled.QuestionTitle>{question.title}</Styled.QuestionTitle>
        {question.options.required && <Styled.Required>*</Styled.Required>}
      </Styled.QuestionRow>

      {isChoiceType(question.type) ? (
        <Styled.ChoiceList>
          {question.items.map(({ value }) => {
            const isSelected = answers.includes(value);
            return (
              <Styled.ChoiceItem key={value} $isSelected={isSelected}>
                {isSelected && <Styled.CheckIcon />}
                <Styled.ChoiceLabel>{value}</Styled.ChoiceLabel>
              </Styled.ChoiceItem>
            );
          })}
        </Styled.ChoiceList>
      ) : (
        <Styled.TextAnswerBox>
          <Styled.TextAnswer $isEmpty={!hasAnswer}>
            {hasAnswer ? answerText : '답변 없음'}
          </Styled.TextAnswer>
        </Styled.TextAnswerBox>
      )}
    </Styled.Card>
  );
};

export default AnswerCard;
