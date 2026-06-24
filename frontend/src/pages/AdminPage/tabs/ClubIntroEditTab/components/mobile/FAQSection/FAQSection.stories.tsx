import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FAQ } from '@/types/club';
import FAQSection from './FAQSection';

const meta = {
  title: 'Pages/AdminPage/components/FAQSection',
  component: FAQSection,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '335px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FAQSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    faqs: [],
    onChange: () => {},
  },
  render: () => {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    return <FAQSection faqs={faqs} onChange={setFaqs} />;
  },
};

export const Filled: Story = {
  args: {
    faqs: [],
    onChange: () => {},
  },
  render: () => {
    const [faqs, setFaqs] = useState<FAQ[]>([
      {
        question: '개발 실력과 경험이 매우 부족한데 괜찮나요?',
        answer:
          '괜찮습니다. 회장인 저 또한 WAP에 들어왔을 때, 기초 지식 없이 시작했기 때문에, 처음 개발을 접하는 분들의 고민과 두려움을 충분히 이해하고 있습니다.',
      },
      {
        question: '',
        answer: '',
      },
    ]);
    return <FAQSection faqs={faqs} onChange={setFaqs} />;
  },
};
