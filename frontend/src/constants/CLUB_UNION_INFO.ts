import PresidentAvatar from '@/assets/images/icons/category_button/category_all_button_icon.svg';
import ReligionAvatar from '@/assets/images/icons/category_button/category_religion_button_icon.svg';
import HobbyAvatar from '@/assets/images/icons/category_button/category_hobby_button_icon.svg';
import StudyAvatar from '@/assets/images/icons/category_button/category_study_button_icon.svg';
import VolunteerAvatar from '@/assets/images/icons/category_button/category_volunteer_button_icon.svg';
import PerformanceAvatar from '@/assets/images/icons/category_button/category_performance_button_icon.svg';
import SportAvatar from '@/assets/images/icons/category_button/category_sport_button_icon.svg';

export interface ClubUnionMember {
  id: number;
  name: string;
  role: string;
  description: string;
  imageSrc: string;
  contact?: string;
}

const MEMBER_AVATARS = {
  PRESIDENT: PresidentAvatar,
  VICE_PRESIDENT: PresidentAvatar,
  SECRETARY: PresidentAvatar,
  PROMOTION: PresidentAvatar,
  RELIGION: ReligionAvatar,
  HOBBY: HobbyAvatar,
  STUDY: StudyAvatar,
  VOLUNTEER: VolunteerAvatar,
  PERFORMANCE: PerformanceAvatar,
  SPORT: SportAvatar,
};

export const CLUB_UNION_MEMBERS: ClubUnionMember[] = [
  {
    id: 1,
    name: '이정은',
    role: '회장',
    description: '부경대학교의 중앙동아리, 온 총동아리연합회가 책임지겠습니다.',
    imageSrc: MEMBER_AVATARS.PRESIDENT,
    contact: '010-1234-5678',
  },
  {
    id: 2,
    name: '김태연',
    role: '부회장',
    description:
      '여러분의 동아리 생활이 풍요로워질 수 있도록 힘을 보태겠습니다.',
    imageSrc: MEMBER_AVATARS.VICE_PRESIDENT,
  },
  {
    id: 3,
    name: '최지현',
    role: '사무국장',
    description: '동아리를 위해 노력하는 온 총동연에게 많은 관심 부탁드립니다.',
    imageSrc: MEMBER_AVATARS.SECRETARY,
  },
  {
    id: 4,
    name: '이주은',
    role: '홍보국장',
    description: '총동연의 가치를 알리고 소통을 이끄는 홍보국장입니다!',
    imageSrc: MEMBER_AVATARS.PROMOTION,
  },
  {
    id: 5,
    name: '김도하',
    role: '종교분과장',
    description: '믿고 따르는 든든한 총동연을 위해 노력하겠습니다.',
    imageSrc: MEMBER_AVATARS.RELIGION,
  },
  {
    id: 6,
    name: '이정원',
    role: '취미교양분과장',
    description: '2025년 동아리들의 활동이 잘 이루어지도록 열심히 하겠습니다.',
    imageSrc: MEMBER_AVATARS.HOBBY,
  },
  {
    id: 7,
    name: '성기일',
    role: '학술분과장',
    description: '공부도 동아리도 포기 못 하는 학술분과장입니다!',
    imageSrc: MEMBER_AVATARS.STUDY,
  },
  {
    id: 8,
    name: '김현진',
    role: '봉사분과장',
    description: '대학 생활의 꽃, 봉사동아리 많은 관심 부탁드립니다!',
    imageSrc: MEMBER_AVATARS.VOLUNTEER,
  },
  {
    id: 9,
    name: '박지윤',
    role: '공연1분과장',
    description:
      '더 나은 동아리 생활을 만들기 위해 책임감을 가지고 임하겠습니다!',
    imageSrc: MEMBER_AVATARS.PERFORMANCE,
  },
  {
    id: 10,
    name: '고보민',
    role: '공연2분과장',
    description:
      '공연2분과의 원활한 운영과 멋진 무대를 위해 최선을 다하겠습니다!',
    imageSrc: MEMBER_AVATARS.PERFORMANCE,
  },
  {
    id: 11,
    name: '이금정',
    role: '운동1분과장',
    description:
      '열정 가득한 운동1분과! 부경대 학우 여러분의 활기찬 동아리 활동을 위해 최선을 다하겠습니다!',
    imageSrc: MEMBER_AVATARS.SPORT,
  },
  {
    id: 12,
    name: '이상민',
    role: '운동2분과장',
    description:
      '재미와 건강 두 마리 토끼를 잡을 수 있는 운동2분과에서 여러분을 만났으면 좋겠습니다!',
    imageSrc: MEMBER_AVATARS.SPORT,
  },
];
