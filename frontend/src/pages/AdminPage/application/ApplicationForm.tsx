// 지원하기 : 지원서 입력 컴포넌트
// 특정 지원서를 사용자들이 입력할 수 있는 지원서 작성 부분
// Todo 추후 특정 지원서를 받아서 answer 모드로 렌더링
import { useState } from 'react';
import ShortText from '@/pages/AdminPage/application/fields/ShortText';
import Choice from '@/pages/AdminPage/application/fields/Choice';

interface QuestionData {
  title: string;
  description: string;
  items?: { value: string }[];
}

interface AnswerData {
  [id: number]: string;
}

const ApplicationForm = () => {
  const [questions] = useState<Record<number, QuestionData>>({
    1: {
      title: '이름을 입력해주세요',
      description: '본명을 입력해 주세요',
    },
    2: {
      title: '자기소개를 해주세요',
      description: '300자 이내로 입력해주세요',
    },
    3: {
      title: '지원 분야를 선택해주세요',
      description: '중복 선택은 불가능합니다',
      items: [
        { value: '프론트엔드' },
        { value: '백엔드' },
        { value: '디자인' },
      ],
    },
    4: {
      title: '희망하는 활동 시간을 선택해주세요',
      description: '가장 편한 시간을 골라주세요',
      items: [],
    },
    5: {
      title: '이전에 프로젝트 경험이 있나요?',
      description: '간단하게 작성해주세요',
      items: [{ value: 'React' }],
    },
    6: {
      title: '사용 가능한 기술 스택을 선택해주세요',
      description: '복수 선택 가능',
      items: [
        { value: 'React' },
        { value: 'Node.js' },
        { value: 'Python' },
        { value: 'Figma' },
      ],
    },
  });

  const [answers, setAnswers] = useState<AnswerData>({});

  const handleAnswerChange = (id: number) => (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return <></>;
};

export default ApplicationForm;
