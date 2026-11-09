// 대상별 자주 묻는 질문을 눌러서 펼쳐 보는 섹션
import { useId, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { IntroduceFaqItem } from '@/pages/IntroducePage/constants/introduceFaq';
import * as Styled from './FaqSection.styles';

interface FaqSectionProps {
  items: IntroduceFaqItem[];
}

const FaqSection = ({ items }: FaqSectionProps) => {
  const baseId = useId();
  // 여러 질문을 함께 펼쳐 두고 비교할 수 있게 펼친 항목을 모두 기억한다
  const [openIndexes, setOpenIndexes] = useState<ReadonlySet<number>>(
    () => new Set(),
  );

  const toggle = (index: number) =>
    setOpenIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  return (
    <Styled.Section aria-labelledby={`${baseId}-title`}>
      <Styled.Title id={`${baseId}-title`}>자주 묻는 질문</Styled.Title>
      <Styled.List>
        {items.map(({ question, answer }, index) => {
          const open = openIndexes.has(index);
          const panelId = `${baseId}-panel-${index}`;
          return (
            <Styled.Item key={question}>
              <Styled.Question
                type='button'
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => toggle(index)}
              >
                {question}
                <Styled.Toggle $open={open} aria-hidden='true' />
              </Styled.Question>
              <AnimatePresence initial={false}>
                {open && (
                  <Styled.AnswerWrap
                    id={panelId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Styled.Answer>{answer}</Styled.Answer>
                  </Styled.AnswerWrap>
                )}
              </AnimatePresence>
            </Styled.Item>
          );
        })}
      </Styled.List>
    </Styled.Section>
  );
};

export default FaqSection;
