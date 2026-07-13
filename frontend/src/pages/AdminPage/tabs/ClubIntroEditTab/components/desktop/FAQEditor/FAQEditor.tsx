import { useEffect, useRef, useState } from 'react';
import clearButton from '@/assets/images/icons/input_clear_button_icon.svg';
import { FAQ_ANSWER_MAX, FAQ_QUESTION_MAX } from '@/constants/adminFieldLimits';
import {
  FAQ_ANSWER_PLACEHOLDER,
  FAQ_QUESTION_PLACEHOLDER,
} from '@/constants/adminFieldPlaceholders';
import useAutoGrow from '@/hooks/useAutoGrow';
import { FAQ } from '@/types/club';
import * as Styled from './FAQEditor.styles';

interface FAQEditorProps {
  faqs: FAQ[];
  onChange: (faqs: FAQ[]) => void;
}

interface FAQItemEditorProps {
  faq: FAQ & { id: string };
  index: number;
  onRemove: (id: string) => void;
  onUpdateQuestion: (id: string, value: string) => void;
  onUpdateAnswer: (id: string, value: string) => void;
  inputRef: (el: HTMLInputElement | null) => void;
}

const FAQItemEditor = ({
  faq,
  index,
  onRemove,
  onUpdateQuestion,
  onUpdateAnswer,
  inputRef,
}: FAQItemEditorProps) => {
  const answerRef = useAutoGrow(faq.answer);

  return (
    <Styled.FAQItem>
      <Styled.FAQHeader>
        <Styled.FAQNumber>Q{index + 1}</Styled.FAQNumber>
        <Styled.RemoveButton onClick={() => onRemove(faq.id)}>
          <img src={clearButton} alt='삭제' />
        </Styled.RemoveButton>
      </Styled.FAQHeader>

      <Styled.QuestionInput
        ref={inputRef}
        placeholder={FAQ_QUESTION_PLACEHOLDER}
        value={faq.question}
        onChange={(e) => onUpdateQuestion(faq.id, e.target.value)}
        maxLength={FAQ_QUESTION_MAX}
      />

      <Styled.AnswerTextArea
        ref={answerRef}
        placeholder={FAQ_ANSWER_PLACEHOLDER}
        value={faq.answer}
        onChange={(e) => onUpdateAnswer(faq.id, e.target.value)}
        maxLength={FAQ_ANSWER_MAX}
      />

      <Styled.CharCount>
        질문: {faq.question.length}/{FAQ_QUESTION_MAX} | 답변:{' '}
        {faq.answer.length}/{FAQ_ANSWER_MAX}
      </Styled.CharCount>
    </Styled.FAQItem>
  );
};

const FAQEditor = ({ faqs, onChange }: FAQEditorProps) => {
  const [shouldFocusLast, setShouldFocusLast] = useState(false);
  const questionInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    const hasAnyMissingId = faqs.some((faq) => !faq.id);
    if (hasAnyMissingId) {
      const faqsWithIds = faqs.map((faq) => ({
        ...faq,
        id: faq.id || `faq-${Date.now()}-${Math.random()}`,
      }));
      onChange(faqsWithIds);
    }
  }, [faqs, onChange]);

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
    onChange(
      faqs.map((faq) => (faq.id === id ? { ...faq, question: value } : faq)),
    );
  };

  const handleUpdateAnswer = (id: string, value: string) => {
    onChange(
      faqs.map((faq) => (faq.id === id ? { ...faq, answer: value } : faq)),
    );
  };

  useEffect(() => {
    if (shouldFocusLast && faqs.length > 0) {
      const lastFAQ = faqs[faqs.length - 1];
      if (lastFAQ.id) {
        questionInputRefs.current[lastFAQ.id]?.focus();
      }
      setShouldFocusLast(false);
    }
  }, [faqs, shouldFocusLast]);

  return (
    <Styled.Container>
      <Styled.Label>자주 묻는 질문 (FAQ)</Styled.Label>

      <Styled.AddButton onClick={handleAddFAQ}>+ FAQ 추가</Styled.AddButton>

      {faqs.length === 0 ? (
        <Styled.EmptyState>
          FAQ를 추가하여 지원자들의 자주 묻는 질문에 답변해보세요.
        </Styled.EmptyState>
      ) : (
        <Styled.FAQList>
          {faqs
            .filter((faq): faq is FAQ & { id: string } => !!faq.id)
            .map((faq, index) => (
              <FAQItemEditor
                key={faq.id}
                faq={faq}
                index={index}
                onRemove={handleRemoveFAQ}
                onUpdateQuestion={handleUpdateQuestion}
                onUpdateAnswer={handleUpdateAnswer}
                inputRef={(el) => {
                  questionInputRefs.current[faq.id] = el;
                }}
              />
            ))}
        </Styled.FAQList>
      )}
    </Styled.Container>
  );
};

export default FAQEditor;
