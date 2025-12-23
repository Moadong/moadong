import { useEffect, useRef, useState } from 'react';
import deleteButton from '@/assets/images/icons/delete_button_icon.svg';
import { FAQ } from '../../ClubIntroTab';
import * as Styled from './FAQEditor.styles';

interface FAQEditorProps {
  faqs: FAQ[];
  onChange: (faqs: FAQ[]) => void;
}

const FAQEditor = ({ faqs, onChange }: FAQEditorProps) => {
  const [shouldFocusLast, setShouldFocusLast] = useState(false);
  const questionInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleAddFAQ = () => {
    const newFAQ: FAQ = {
      question: '',
      answer: '',
    };
    onChange([...faqs, newFAQ]);
    setShouldFocusLast(true);
  };

  const handleRemoveFAQ = (index: number) => {
    onChange(faqs.filter((_, faqIndex) => faqIndex !== index));
  };

  const handleUpdateQuestion = (index: number, value: string) => {
    const updatedFAQs = faqs.map((faq, faqIndex) =>
      faqIndex === index ? { ...faq, question: value } : faq,
    );
    onChange(updatedFAQs);
  };

  const handleUpdateAnswer = (index: number, value: string) => {
    const updatedFAQs = faqs.map((faq, faqIndex) =>
      faqIndex === index ? { ...faq, answer: value } : faq,
    );
    onChange(updatedFAQs);
  };

  useEffect(() => {
    if (shouldFocusLast && faqs.length > 0) {
      const lastIndex = faqs.length - 1;
      const inputRef = questionInputRefs.current[lastIndex];
      if (inputRef) {
        inputRef.focus();
      }
      setShouldFocusLast(false);
    }
  }, [faqs, shouldFocusLast]);

  return (
    <Styled.Container>
      <Styled.Label>❓ 자주 묻는 질문 (FAQ)</Styled.Label>

      <Styled.AddButton onClick={handleAddFAQ}>+ FAQ 추가</Styled.AddButton>

      {faqs.length === 0 ? (
        <Styled.EmptyState>
          FAQ를 추가하여 지원자들의 자주 묻는 질문에 답변해보세요.
        </Styled.EmptyState>
      ) : (
        <Styled.FAQList>
          {faqs.map((faq, index) => (
            <Styled.FAQItem key={index}>
              <Styled.FAQHeader>
                <Styled.FAQNumber>Q{index + 1}</Styled.FAQNumber>
                <Styled.RemoveButton onClick={() => handleRemoveFAQ(index)}>
                  <img src={deleteButton} alt='삭제' />
                </Styled.RemoveButton>
              </Styled.FAQHeader>

              <Styled.QuestionInput
                ref={(element) => {
                  questionInputRefs.current[index] = element;
                }}
                placeholder='질문을 입력하세요'
                value={faq.question}
                onChange={(event) =>
                  handleUpdateQuestion(index, event.target.value)
                }
                maxLength={100}
              />

              <Styled.AnswerTextArea
                placeholder='답변을 입력하세요'
                value={faq.answer}
                onChange={(event) =>
                  handleUpdateAnswer(index, event.target.value)
                }
                maxLength={300}
              />

              <Styled.CharCount>
                질문: {faq.question.length}/100 | 답변: {faq.answer.length}/300
              </Styled.CharCount>
            </Styled.FAQItem>
          ))}
        </Styled.FAQList>
      )}
    </Styled.Container>
  );
};

export default FAQEditor;
