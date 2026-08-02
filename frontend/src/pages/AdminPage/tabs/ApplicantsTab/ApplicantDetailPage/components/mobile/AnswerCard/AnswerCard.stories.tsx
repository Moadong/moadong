import type { Meta, StoryObj } from '@storybook/react';
import AnswerCard from './AnswerCard';

const meta = {
  title:
    'Pages/AdminPage/tabs/ApplicantsTab/ApplicantDetailPage/components/mobile/AnswerCard',
  component: AnswerCard,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 375, padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AnswerCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ShortText: Story = {
  args: {
    index: 1,
    question: {
      id: 1,
      title: '이름을 입력해주세요',
      description: '',
      type: 'NAME',
      options: { required: true },
      items: [],
    },
    answers: ['홍길동'],
  },
};

export const LongText: Story = {
  args: {
    index: 2,
    question: {
      id: 2,
      title: '지원 동기를 작성해주세요',
      description: '최대 1000자 이내로 작성해주세요',
      type: 'LONG_TEXT',
      options: { required: true },
      items: [],
    },
    answers: [
      '저는 오랫동안 이 동아리에 관심을 가지고 있었으며, 다양한 프로젝트 경험을 통해 팀워크와 협업 능력을 키워왔습니다. 이 동아리에서 제 역량을 더욱 발전시키고 싶습니다.',
    ],
  },
};

export const EmptyAnswer: Story = {
  args: {
    index: 3,
    question: {
      id: 3,
      title: '추가로 하고 싶은 말이 있나요?',
      description: '',
      type: 'SHORT_TEXT',
      options: { required: false },
      items: [],
    },
    answers: [],
  },
};

export const SingleChoice: Story = {
  args: {
    index: 4,
    question: {
      id: 4,
      title: '활동 가능한 요일을 선택해주세요',
      description: '',
      type: 'CHOICE',
      options: { required: true },
      items: [
        { value: '월요일' },
        { value: '화요일' },
        { value: '수요일' },
        { value: '목요일' },
        { value: '금요일' },
      ],
    },
    answers: ['수요일'],
  },
};

export const MultiChoice: Story = {
  args: {
    index: 5,
    question: {
      id: 5,
      title: '관심 있는 활동 분야를 모두 선택해주세요',
      description: '복수 선택 가능합니다',
      type: 'MULTI_CHOICE',
      options: { required: true },
      items: [
        { value: '기획' },
        { value: '디자인' },
        { value: '개발' },
        { value: '마케팅' },
      ],
    },
    answers: ['기획', '개발'],
  },
};

export const AllCards: Story = {
  args: {
    index: 1,
    question: {
      id: 1,
      title: '이름',
      description: '',
      type: 'NAME',
      options: { required: true },
      items: [],
    },
    answers: ['홍길동'],
  },
  render: () => (
    <>
      <AnswerCard
        index={1}
        question={{
          id: 1,
          title: '이름을 입력해주세요',
          description: '',
          type: 'NAME',
          options: { required: true },
          items: [],
        }}
        answers={['홍길동']}
      />
      <AnswerCard
        index={2}
        question={{
          id: 2,
          title: '지원 동기를 작성해주세요',
          description: '최대 1000자 이내로 작성해주세요',
          type: 'LONG_TEXT',
          options: { required: true },
          items: [],
        }}
        answers={['저는 이 동아리에 오랫동안 관심을 가지고 있었습니다.']}
      />
      <AnswerCard
        index={3}
        question={{
          id: 3,
          title: '활동 가능한 요일을 선택해주세요',
          description: '',
          type: 'CHOICE',
          options: { required: true },
          items: [
            { value: '월요일' },
            { value: '수요일' },
            { value: '금요일' },
          ],
        }}
        answers={['수요일']}
      />
      <AnswerCard
        index={4}
        question={{
          id: 4,
          title: '관심 분야를 선택해주세요',
          description: '복수 선택 가능합니다',
          type: 'MULTI_CHOICE',
          options: { required: false },
          items: [
            { value: '기획' },
            { value: '디자인' },
            { value: '개발' },
            { value: '마케팅' },
          ],
        }}
        answers={['기획', '개발']}
      />
    </>
  ),
};
