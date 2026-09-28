export type PeaceTypeId =
  | 'carer'
  | 'embracer'
  | 'daily'
  | 'explorer'
  | 'energizer'
  | 'expresser';

export interface PeaceType {
  id: PeaceTypeId;
  name: string;
  catchphrase: string;
  /** "이런 사람이에요" 3~4문장. 성격이 아니라 행동 장면으로 쓴다 */
  description: string;
  /** 강점 키워드 3개. 화면에서 #칩으로 보여준다 */
  strengths: string[];
  /** "이럴 때 빛나요" 1~2문장 */
  shinesWhen: string;
  /** "가끔은 이런 면도" 부드러운 약점 1문장 */
  caution: string;
  /** 오늘의 작은 평화 행동 3개 */
  smallActions: string[];
  /** 이미지가 없을 때 카드 중앙에 크게 보여줄 심볼(이모지) */
  symbol: string;
  /** CategoryButtonList와 같은 한글 분과 라벨 */
  category: string;
  /** theme.colors.secondary 인덱스. clubTags.ts의 분과 매핑과 동일 */
  colorIndex: 1 | 2 | 3 | 4 | 5 | 6;
  /** 잘 맞는 평화 파트너 유형. 서로를 가리켜야 한다 */
  partner: PeaceTypeId;
  /** 파트너와 왜 잘 맞는지 한 줄 */
  partnerReason: string;
  /** "부경대 학생이라면?" 안에서 보여줄 분과 소개 2문장 */
  divisionIntro: string;
  /** 동아리 정확한 이름. 비어 있으면 결과 화면에서 태그 영역을 숨긴다 */
  recommendedClubs: string[];
}

export const PEACE_TYPE_IDS: PeaceTypeId[] = [
  'carer',
  'embracer',
  'daily',
  'explorer',
  'energizer',
  'expresser',
];

/** 동점일 때 앞에 오는 유형이 우선. 등장 빈도가 낮은 유형을 앞에 둔다 */
export const TIE_BREAK_ORDER: PeaceTypeId[] = [
  'daily',
  'embracer',
  'energizer',
  'expresser',
  'carer',
  'explorer',
];

export const PEACE_TYPES: Record<PeaceTypeId, PeaceType> = {
  carer: {
    id: 'carer',
    name: '돌봄가',
    catchphrase: '이웃을 돌보고 나누는 평화 메이커',
    description:
      '친구가 말없이 조용해지면 제일 먼저 알아채는 사람. 축제에서도 구경보다 짐 든 어르신이나 길 잃은 아이가 먼저 눈에 들어옵니다. 거창한 봉사보다 "밥은 먹었어?" 한마디로 사람을 살리는 쪽이고, 누군가 편해진 얼굴을 보는 게 하루의 보람입니다.',
    strengths: ['경청', '실천', '온기'],
    shinesWhen:
      '누군가 힘든 티를 안 내려 애쓸 때, 먼저 옆자리에 앉아 줄 때 빛납니다.',
    caution:
      '남을 챙기느라 정작 자기 컨디션은 뒤로 미루고, 거절을 잘 못 해서 지칠 때가 있습니다.',
    smallActions: [
      '가까운 사람에게 안부 한마디 건네기',
      '오늘 부스에서 만난 낯선 사람에게 먼저 인사하기',
      '나 자신에게도 "고생했어" 한마디 해 주기',
    ],
    symbol: '🤝',
    category: '봉사',
    colorIndex: 1,
    partner: 'expresser',
    partnerReason:
      '돌봄가가 받아 준 마음을 표현가가 세상에 꺼내 보입니다. 객석과 무대가 이어지는 조합.',
    divisionIntro:
      '봉사 분과에는 지역 아동 학습 지도, 유기동물 돌봄, 헌혈·환경 캠페인처럼 몸으로 움직이는 동아리가 모여 있어요. 학기 중 정기 봉사와 방학 농활·연합 봉사로 이어집니다.',
    recommendedClubs: [],
  },
  embracer: {
    id: 'embracer',
    name: '포용가',
    catchphrase: '서로 다른 믿음과 가치를 존중하는 평화 메이커',
    description:
      '단톡방에서 의견이 갈릴 때 "둘 다 일리 있네"라고 먼저 말하는 사람. 나와 다른 생각을 들으면 반박보다 "왜 그렇게 생각해?"가 먼저 나옵니다. 조용히 자리를 지키는 것 같아도, 그 사람이 있는 자리는 이상하게 싸움이 안 납니다. 평화가 거창한 게 아니라 끝까지 들어주는 태도라는 걸 몸으로 아는 유형입니다.',
    strengths: ['이해', '균형', '차분함'],
    shinesWhen:
      '팀이 갈라져 서로 말이 안 통할 때, 양쪽 말을 한 문장으로 정리해 줄 때 빛납니다.',
    caution:
      '모두를 이해하려다 정작 내 의견은 말할 타이밍을 놓치고, 결정을 미루는 편입니다.',
    smallActions: [
      '나와 다른 생각 하나 끝까지 들어보기',
      '오늘 하루 "그럴 수도 있지"를 한 번 소리 내어 말하기',
      '내 의견도 한 번은 먼저 꺼내 보기',
    ],
    symbol: '🕊️',
    category: '종교',
    colorIndex: 2,
    partner: 'explorer',
    partnerReason:
      '포용가가 열어 둔 마음에 탐구가가 새로운 세계를 채웁니다. 다름을 이해하는 두 가지 방식이 만나는 조합.',
    divisionIntro:
      '종교 분과는 특정 종교를 강요하는 곳이 아니라, 같은 가치를 나누는 사람들이 매주 모여 이야기하고 봉사하는 공동체예요. 명상·기도 모임부터 연합 행사와 나눔 활동까지 이어집니다.',
    recommendedClubs: [],
  },
  daily: {
    id: 'daily',
    name: '일상가',
    catchphrase: '소소한 취미와 일상에서 평화를 찾는 평화 메이커',
    description:
      '주말 계획이 "카페 가서 책 읽기"인데 그게 진짜로 행복한 사람. 남들이 뭘 하든 내 페이스로 좋아하는 걸 오래, 꾸준히 합니다. 뜨개질이든 보드게임이든 사진이든, 취미를 나누다 보면 어느새 주변에 사람이 모여 있습니다. 평화란 특별한 날이 아니라 별일 없는 하루라는 걸 아는 유형입니다.',
    strengths: ['꾸준함', '여유', '취향'],
    shinesWhen:
      '모두가 바쁘다고 할 때, "잠깐 쉬었다 가자"며 분위기를 풀어 줄 때 빛납니다.',
    caution:
      '익숙한 것에 머물다 새 사람·새 자리를 놓치고, 시작이 조금 느린 편입니다.',
    smallActions: [
      '오늘 좋아하는 것 하나에 10분 쓰기',
      '내 취미를 한 사람에게 소개해 보기',
      '축제에서 안 가 본 부스 하나 들러 보기',
    ],
    symbol: '☕',
    category: '취미교양',
    colorIndex: 3,
    partner: 'energizer',
    partnerReason:
      '일상가의 페이스에 활력가가 시동을 걸고, 활력가의 과열을 일상가가 식혀 줍니다. 서로의 속도를 맞춰 주는 조합.',
    divisionIntro:
      '취미교양 분과에는 사진, 보드게임, 요리, 독서, 손뜨개처럼 좋아하는 걸 같이 하는 동아리가 가장 많아요. 부담 없는 정기 모임과 전시·소모임으로 이어집니다.',
    recommendedClubs: [],
  },
  explorer: {
    id: 'explorer',
    name: '탐구가',
    catchphrase: '배우고 이해하며 시야를 넓히는 평화 메이커',
    description:
      '축제 부스마다 "이건 왜 이렇게 해요?"라고 물어보는 사람. 궁금한 게 생기면 그 자리에서 검색하고, 검색하다 다른 게 더 궁금해집니다. 다른 나라 문화나 낯선 분야 이야기를 들으면 눈이 커지고, 알게 된 걸 남에게 설명하는 걸 좋아합니다. 오해 대부분은 몰라서 생긴다고 믿기에, 배우는 것 자체가 평화의 방법입니다.',
    strengths: ['호기심', '분석', '설명'],
    shinesWhen:
      '다들 감으로 말할 때, 근거 하나를 찾아와 논의를 정리해 줄 때 빛납니다.',
    caution:
      '생각이 많아 행동이 늦어지고, 설명하다 보면 상대가 이미 지쳐 있을 때가 있습니다.',
    smallActions: [
      '다른 나라 문화 한 가지 찾아보기',
      '오늘 새로 알게 된 것 한 가지를 누군가에게 말해 주기',
      '궁금했지만 미뤄 둔 질문 하나 던져 보기',
    ],
    symbol: '🔭',
    category: '학술',
    colorIndex: 4,
    partner: 'embracer',
    partnerReason:
      '탐구가가 찾아온 사실을 포용가가 사람의 언어로 풀어 줍니다. 아는 것과 품는 것이 만나는 조합.',
    divisionIntro:
      '학술 분과에는 개발·창업 프로젝트, 어학·토론, 경제·시사 스터디, 과학 탐구 동아리가 모여 있어요. 스터디와 세미나가 기본이고 공모전·프로젝트 결과물로 이어집니다.',
    recommendedClubs: [],
  },
  energizer: {
    id: 'energizer',
    name: '활력가',
    catchphrase: '함께 몸을 움직이며 에너지를 나누는 평화 메이커',
    description:
      '"나가서 뭐라도 하자"가 입버릇인 사람. 가만히 앉아 있으면 오히려 피곤하고, 땀 흘리고 나면 고민이 반은 사라집니다. 처음 보는 사람과도 공 하나만 있으면 금방 친해지고, 팀이 지면 제일 아쉬워하면서도 제일 먼저 "다음엔 이기자"고 말합니다. 몸이 먼저 움직이면 마음도 풀린다는 걸 아는 유형입니다.',
    strengths: ['추진력', '긍정', '팀워크'],
    shinesWhen:
      '다들 지쳐 앉아 있을 때, 먼저 일어나 "가자!"라고 외칠 때 빛납니다.',
    caution:
      '속도가 빨라 느린 사람을 두고 갈 때가 있고, 쉬는 것도 계획해야 한다는 걸 자주 잊습니다.',
    smallActions: [
      '오늘 10분 몸을 움직여보기',
      '오늘 만난 사람과 하이파이브 한 번 하기',
      '느리게 가는 사람 옆에서 한 번 같이 걸어 보기',
    ],
    symbol: '⚡',
    category: '운동',
    colorIndex: 5,
    partner: 'daily',
    partnerReason:
      '활력가가 끌고 가면 일상가가 쉬는 법을 알려 줍니다. 달리기와 쉼표가 번갈아 오는 조합.',
    divisionIntro:
      '운동 분과에는 축구, 농구, 배드민턴, 클라이밍, 러닝처럼 함께 땀 흘리는 동아리가 모여 있어요. 주간 정기 운동과 교내·연합 대회로 이어집니다.',
    recommendedClubs: [],
  },
  expresser: {
    id: 'expresser',
    name: '표현가',
    catchphrase: '예술과 공연으로 마음을 전하는 평화 메이커',
    description:
      '좋았던 공연을 친구에게 설명하다 결국 직접 흉내를 내고 마는 사람. 마음에 남은 장면은 글이든 그림이든 노래든 어떤 형태로든 밖으로 내보내야 직성이 풀립니다. 말로 다 못 하는 감정을 무대와 작품으로 대신 전하고, 그 순간 객석에서 누군가의 표정이 바뀌는 걸 가장 큰 보람으로 느낍니다.',
    strengths: ['감수성', '전달력', '몰입'],
    shinesWhen:
      '분위기가 가라앉은 자리에서 첫 박수를 치거나, 모두가 망설일 때 먼저 무대에 오를 때 빛납니다.',
    caution:
      '반응이 없으면 금방 시무룩해지고, 완성도가 마음에 안 들면 보여 주기를 미룹니다.',
    smallActions: [
      '평화 메시지를 그림이나 글로 남기기',
      '오늘 들은 노래 한 곡을 누군가에게 보내기',
      '축제에서 본 공연 팀에게 박수 한 번 더 보내기',
    ],
    symbol: '🎭',
    category: '공연',
    colorIndex: 6,
    partner: 'carer',
    partnerReason:
      '표현가가 마음을 꺼내 놓으면 돌봄가가 그 마음을 받아 줄 사람에게 전합니다. 무대와 객석이 이어지는 조합.',
    divisionIntro:
      '공연 분과에는 밴드, 연극, 댄스, 합창, 국악처럼 무대에서 함께 만드는 동아리가 모여 있어요. 학기마다 정기 공연을 올리고 대동제 무대에도 섭니다.',
    recommendedClubs: [],
  },
};

export const isPeaceTypeId = (value: string | null): value is PeaceTypeId =>
  value !== null && (PEACE_TYPE_IDS as string[]).includes(value);
