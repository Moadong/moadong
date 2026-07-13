import addIcon from '@/assets/images/icons/add_icon.svg';
import closeCircleIcon from '@/assets/images/icons/close_circle_icon.svg';
import { FAQ_ANSWER_MAX, FAQ_QUESTION_MAX } from '@/constants/adminFieldLimits';
import {
  FAQ_ANSWER_PLACEHOLDER,
  FAQ_QUESTION_PLACEHOLDER,
} from '@/constants/adminFieldPlaceholders';
import useAutoGrow from '@/hooks/useAutoGrow';
import AddItemButton from '@/pages/AdminPage/components/AddItemButton/AddItemButton';
import { FAQ } from '@/types/club';
import * as Styled from './FAQSection.styles';

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
    if (e.target.value.length <= FAQ_ANSWER_MAX) {
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
            placeholder={FAQ_QUESTION_PLACEHOLDER}
            maxLength={FAQ_QUESTION_MAX}
          />
        </Styled.QuestionContent>
        <Styled.DeleteButton onClick={() => onDelete(index)} type='button'>
          <img src={closeCircleIcon} alt='삭제' />
        </Styled.DeleteButton>
      </Styled.QuestionRow>
      <Styled.AnswerWrapper>
        <Styled.AnswerCard>
          <Styled.AnswerTextarea
            ref={answerRef}
            value={faq.answer}
            onChange={handleAnswerChange}
            placeholder={FAQ_ANSWER_PLACEHOLDER}
            rows={1}
          />
        </Styled.AnswerCard>
        <Styled.CharCount>
          질문: {faq.question.length}/{FAQ_QUESTION_MAX} | 답변:{' '}
          {faq.answer.length}/{FAQ_ANSWER_MAX}
        </Styled.CharCount>
      </Styled.AnswerWrapper>
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
          <AddItemButton onClick={handleAdd} type='button'>
            <img src={addIcon} alt='' />
            FAQ 추가
          </AddItemButton>
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
          <AddItemButton onClick={handleAdd} type='button'>
            <img src={addIcon} alt='' />
            FAQ 추가
          </AddItemButton>
        </>
      )}
    </Styled.Wrapper>
  );
};

export default FAQSection;
