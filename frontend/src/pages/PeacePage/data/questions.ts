import { PeaceTypeId } from './peaceTypes';

export interface PeaceQuestion {
  id: number;
  text: string;
  options: { label: string; type: PeaceTypeId }[];
}

export const PEACE_QUESTIONS: PeaceQuestion[] = [
  {
    id: 1,
    text: '축제에 왔을 때 나는?',
    options: [
      { label: '몸을 움직이는 체험·게임에 끌린다', type: 'energizer' },
      { label: '공연·전시를 감상하는 게 좋다', type: 'expresser' },
      { label: '부스를 구경하며 새로운 걸 배운다', type: 'explorer' },
      { label: '도움이 필요한 곳에 손을 보탠다', type: 'carer' },
    ],
  },
  {
    id: 2,
    text: '쉬는 날 나는 주로?',
    options: [
      { label: '취미 활동으로 시간을 보낸다', type: 'daily' },
      { label: '운동이나 야외 활동을 한다', type: 'energizer' },
      { label: '책·강연으로 무언가를 배운다', type: 'explorer' },
      { label: '마음을 다스리거나 성찰하는 시간을 갖는다', type: 'embracer' },
    ],
  },
  {
    id: 3,
    text: "'평화'하면 떠오르는 것은?",
    options: [
      { label: '어려운 이웃을 돌보는 마음', type: 'carer' },
      { label: '서로 다른 믿음을 존중하는 태도', type: 'embracer' },
      { label: '소소한 일상의 여유', type: 'daily' },
      { label: '함께 어울려 땀 흘리는 순간', type: 'energizer' },
    ],
  },
  {
    id: 4,
    text: '더 끌리는 모임은?',
    options: [
      { label: '봉사·나눔 활동', type: 'carer' },
      { label: '노래·연주·공연', type: 'expresser' },
      { label: '스터디·독서 토론', type: 'explorer' },
      { label: '취미를 나누는 소모임', type: 'daily' },
    ],
  },
  {
    id: 5,
    text: '나를 가장 잘 설명하는 말은?',
    options: [
      { label: '따뜻하게 챙긴다', type: 'carer' },
      { label: '마음이 넓고 포용적이다', type: 'embracer' },
      { label: '호기심이 많고 배우기 좋아한다', type: 'explorer' },
      { label: '에너지가 넘친다', type: 'energizer' },
    ],
  },
  {
    id: 6,
    text: '하루를 마치며 뿌듯한 순간은?',
    options: [
      { label: '누군가에게 힘이 되어줬을 때', type: 'carer' },
      { label: '무대·작품으로 마음이 통했을 때', type: 'expresser' },
      { label: '새로운 걸 알게 됐을 때', type: 'explorer' },
      { label: '취미로 나만의 시간을 채웠을 때', type: 'daily' },
    ],
  },
  {
    id: 7,
    text: '친구들 사이에서 나는?',
    options: [
      { label: '분위기를 부드럽게 감싸는 사람', type: 'embracer' },
      { label: '함께 뛰자고 이끄는 사람', type: 'energizer' },
      { label: '분위기를 띄우고 표현하는 사람', type: 'expresser' },
      { label: '소소한 재미를 나누는 사람', type: 'daily' },
    ],
  },
  {
    id: 8,
    text: '세상을 바꾸는 힘은?',
    options: [
      { label: '서로 돌보는 마음에서', type: 'carer' },
      { label: '서로 다름을 존중하는 데서', type: 'embracer' },
      { label: '문화와 예술의 울림에서', type: 'expresser' },
      { label: '배우고 이해하는 데서', type: 'explorer' },
    ],
  },
];
