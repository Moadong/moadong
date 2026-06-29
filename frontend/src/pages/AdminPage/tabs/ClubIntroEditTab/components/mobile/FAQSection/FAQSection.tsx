import addIcon from '@/assets/images/icons/add_icon.svg';
import closeCircleIcon from '@/assets/images/icons/close_circle_icon.svg';
import useAutoGrow from '@/hooks/useAutoGrow';
import { FAQ } from '@/types/club';
import * as Styled from './FAQSection.styles';

const QUESTION_MAX_LENGTH = 100;
const ANSWER_MAX_LENGTH = 300;

interface FAQItemEditorProps {
  faq: FAQ;
  index: number;
  onChange: (index: number, field: keyof FAQ, value: string) => void;
  onDelete: (index: number) => void;
}

const FAQItemEditor = ({
  faq,
  index,
  onChange,
  onDelete,
}: FAQItemEditorProps) => {
  const answerRef = useAutoGrow(faq.answer);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= ANSWER_MAX_LENGTH) {
      onChange(index, 'answer', e.target.value);
    }
  };

  return (
    <Styled.FAQCard>
      <Styled.QuestionRow>
        <Styled.QuestionContent>
          <Styled.FAQNumber>Q{index + 1}</Styled.FAQNumber>
          <Styled.QuestionInput
            value={faq.question}
            onChange={(e) => onChange(index, 'question', e.target.value)}
            placeholder='질문을 입력해주세요'
            maxLength={QUESTION_MAX_LENGTH}
          />
        </Styled.QuestionContent>
        <Styled.DeleteButton onClick={() => onDelete(index)} type='button'>
          <img src={closeCircleIcon} alt='삭제' />
        </Styled.DeleteButton>
      </Styled.QuestionRow>
      <Styled.AnswerCard>
        <Styled.AnswerTextarea
          ref={answerRef}
          value={faq.answer}
          onChange={handleAnswerChange}
          placeholder='답변을 입력해주세요'
          rows={1}
        />
        {faq.answer.length > 0 && (
          <Styled.CharCount>
            {faq.answer.length}/{ANSWER_MAX_LENGTH}
          </Styled.CharCount>
        )}
      </Styled.AnswerCard>
    </Styled.FAQCard>
  );
};

interface FAQSectionProps {
  faqs: FAQ[];
  onChange: (faqs: FAQ[]) => void;
}

const FAQSection = ({ faqs, onChange }: FAQSectionProps) => {
  const handleFieldChange = (
    index: number,
    field: keyof FAQ,
    value: string,
  ) => {
    onChange(
      faqs.map((faq, i) => (i === index ? { ...faq, [field]: value } : faq)),
    );
  };

  const handleDelete = (index: number) => {
    onChange(faqs.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    onChange([...faqs, { question: '', answer: '' }]);
  };

  return (
    <Styled.Wrapper>
      <Styled.Header>
        <Styled.Label>자주 묻는 질문(FAQ)</Styled.Label>
      </Styled.Header>
      {faqs.length === 0 ? (
        <Styled.EmptyCard>
          <Styled.EmptyDescription>
            지원자들의 자주 묻는 질문에 답변해보세요
          </Styled.EmptyDescription>
          <Styled.AddButton onClick={handleAdd} type='button'>
            <img src={addIcon} alt='' />
            FAQ 추가
          </Styled.AddButton>
        </Styled.EmptyCard>
      ) : (
        <>
          {faqs.map((faq, index) => (
            <FAQItemEditor
              key={index}
              faq={faq}
              index={index}
              onChange={handleFieldChange}
              onDelete={handleDelete}
            />
          ))}
          <Styled.AddButton onClick={handleAdd} type='button'>
            <img src={addIcon} alt='' />
            FAQ 추가
          </Styled.AddButton>
        </>
      )}
    </Styled.Wrapper>
  );
};

export default FAQSection;
