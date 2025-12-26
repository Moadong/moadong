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
  const questionInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleAddFAQ = () => {
    const newFAQ: FAQ = {
      id: `faq-${Date.now()}-${Math.random()}`,
      question: '',
      answer: '',
    };
    onChange([...faqs, newFAQ]);
    setShouldFocusLast(true);
  };

  const handleRemoveFAQ = (id: string) => {
    onChange(faqs.filter((faq) => faq.id !== id));
  };

  const handleUpdateQuestion = (id: string, value: string) => {
    const updatedFAQs = faqs.map((faq) =>
      faq.id === id ? { ...faq, question: value } : faq,
    );
    onChange(updatedFAQs);
  };

  const handleUpdateAnswer = (id: string, value: string) => {
    const updatedFAQs = faqs.map((faq) =>
      faq.id === id ? { ...faq, answer: value } : faq,
    );
    onChange(updatedFAQs);
  };

  useEffect(() => {
    if (shouldFocusLast && faqs.length > 0) {
      const lastFAQ = faqs[faqs.length - 1];
      const inputRef = questionInputRefs.current[lastFAQ.id];
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
            <Styled.FAQItem key={faq.id}>
              <Styled.FAQHeader>
                <Styled.FAQNumber>Q{index + 1}</Styled.FAQNumber>
                <Styled.RemoveButton onClick={() => handleRemoveFAQ(faq.id)}>
                  <img src={deleteButton} alt='삭제' />
                </Styled.RemoveButton>
              </Styled.FAQHeader>

              <Styled.QuestionInput
                ref={(element) => {
                  questionInputRefs.current[faq.id] = element;
                }}
                placeholder='질문을 입력하세요'
                value={faq.question}
                onChange={(event) =>
                  handleUpdateQuestion(faq.id, event.target.value)
                }
                maxLength={100}
              />

              <Styled.AnswerTextArea
                placeholder='답변을 입력하세요'
                value={faq.answer}
                onChange={(event) =>
                  handleUpdateAnswer(faq.id, event.target.value)
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
