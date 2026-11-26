// 팀 공유용 미리보기에서 개발 서버 데이터 대신 쓰는 실제 서버 스냅샷 (부경다이버·UCDC). 전화번호는 가렸고, 모집 기간은 접속한 날 기준으로 만든다
import { ClubDetail } from '@/types/club';

type ClubSnapshot = Pick<
  ClubDetail,
  | 'logo'
  | 'cover'
  | 'feeds'
  | 'introduction'
  | 'tags'
  | 'category'
  | 'division'
  | 'description'
  | 'recruitmentTarget'
  | 'socialLinks'
  | 'lastModifiedDate'
>;

export const clubShowcaseSnapshot: Record<string, ClubSnapshot> = {
  '67e54ae51cfd27718dd40be9': {
    logo: 'https://cdn.moadong.com/67e54ae51cfd27718dd40be9/logo/N5qEBmK0Xn.webp',
    cover:
      'https://cdn.moadong.com/67e54ae51cfd27718dd40be9/cover/F81yQ4zOl8.webp',
    feeds: [
      'https://cdn.moadong.com/67e54ae51cfd27718dd40be9/feed/ZT9Ipol8wR.webp',
      'https://cdn.moadong.com/67e54ae51cfd27718dd40be9/feed/ZDiLr08OZn.webp',
      'https://cdn.moadong.com/67e54ae51cfd27718dd40be9/feed/CBcvN8VmwV.webp',
      'https://cdn.moadong.com/67e54ae51cfd27718dd40be9/feed/Ngss6np1eW.webp',
      'https://cdn.moadong.com/67e54ae51cfd27718dd40be9/feed/sXSc62mZFm.webp',
      'https://cdn.moadong.com/67e54ae51cfd27718dd40be9/feed/bjYHWYh8f2.webp',
      'https://cdn.moadong.com/67e54ae51cfd27718dd40be9/feed/YKCqkpD1py.webp',
      'https://cdn.moadong.com/67e54ae51cfd27718dd40be9/feed/gVNcggRU4a.webp',
      'https://cdn.moadong.com/67e54ae51cfd27718dd40be9/feed/ATfSY9boRe.webp',
      'https://cdn.moadong.com/67e54ae51cfd27718dd40be9/feed/Pi8dmUwC38.webp',
      'https://cdn.moadong.com/67e54ae51cfd27718dd40be9/feed/NdeV9qRVMn.webp',
      'https://cdn.moadong.com/67e54ae51cfd27718dd40be9/feed/PM5I5FUajl.webp',
    ],
    introduction: '스쿠버다이빙을 통해 바다를 탐험합니다',
    tags: ['스킨스쿠버', '바다'],
    category: '운동',
    division: '중동',
    description: {
      introDescription:
        '부경대학교 스킨스쿠버 동아리 부경다이버는 신비로운 바닷속을 탐험하는 활동을 중심으로, 스쿠버 자격증 취득을 목표로 합니다.',
      activityDescription:
        '이론 및 실기를 통해 PADI 오픈 워터 자격증을 발급받는 프로그램을 진행합니다.\n자격증 취득 이후에는 나이트다이빙, 제주도 하계원정, 해외원정 등의 활동을 진행합니다.',
      awards: [],
      idealCandidate: {
        tags: [],
        content:
          '학교생활을 하면서 다양한 사람들과 새로운 활동을 해보고 싶은 사람,\n해양생물을 직접 보고 싶은 사람,\n물 속의 고요를 좋아하는 사람,\n색다른 경험과 낭만을 추구하는 사람,\n바다를 사랑하는 사람..!!\n\n남녀노소 문은 열려 있습니다, 망설이지 말고 지원하세요!\n\n신청방법: 네이버폼으로 서류 접수 후, 면접\n※ 면접은 동소한(3/5) 때 일괄 시행 예정, 안될 시 따로 일정 조율\n\n더 궁금한 점이 있다면 언제나 연락 해주세요😊\n• 회장 : 010-****-****\n• 부회장 : 010-****-****',
      },
      benefits: '',
      faqs: [
        {
          question: '동아리에서 어떤 활동을 하나요?',
          answer:
            '부경다이버는 이름 그대로 스킨과 스쿠버로 바닷속의 신비한 생물들 또 환경들을 탐험해 볼 수 있는 동아리입니다! 작년은 MT와 여름 원정으로 제주도 다녀왔습니다!\n이번 년도도 여름은 제주도에 갈 계획이며 겨울에는 보홀, 세부같은 해외 원정도 갈 계획입니다👍',
        },
        {
          question: '수영을 못 해도 잘할 수 있나요?',
          answer:
            '스쿠버를 할 때는 물 위에 뜰 수 있는 슈트를 입기 때문에 수영을 못 해도 잘할 수 있습니다 또한 물이 무서운 사람도 극복할 수 있습니다!! (걱정 No🙅‍♂️! 항상 안전하게 다이빙하여 42년 무!사!고!)\n',
        },
        {
          question: '안경 벗으면 눈이 많이 나쁜 사람도 가능한가요?',
          answer:
            '다이빙의 가능 여부는 시력과 무관하다고 생각하며, 렌즈를 끼고 할 수도 있으니 걱정하지 않으셔도 됩니다!',
        },
        {
          question: '동아리 가입 하려면 학번이나 나이 제한이 있나요?',
          answer:
            '제한 없으니 바다를 사랑하신다면 자유롭게 지원 부탁 드립니다!\n',
        },
        {
          question: '비용은 얼마인가요?',
          answer:
            '가입비는 4만원, 회비는 학기 당 4만원입니다! (자격증이 없다면, 자격증 취득 비용인 50만원은 별도이며 2~3회에 걸쳐 분납도 가능합니다)',
        },
        {
          question: '스쿠버 장비는 사야 하나요?',
          answer:
            '장비는 동아리에 모두 구비되어 있어요!!\n열정만 챙겨오면 충분합니다~☺️',
        },
        {
          question: '훈련은 언제, 몇 번씩 하나요?',
          answer:
            '훈련은 평일 2회, 주말 1회로 진행됩니다!(바다는 날씨 영향을 받기에 변동이 있을 수 있어요~)\n보통 오전 중에 진행되며, 훈련은 참여 신청으로 일정을 조율하기에 횟수는 정해져 있지는 않습니다!',
        },
        {
          question: '자격증은 어떻게 따는건가요?',
          answer:
            '6년차 PADI 강사와 함께 1학기 동안 동아리 활동을 하면서 필기 시험과 훈련을 통해 스쿠버 자격증을 취득할 수 있습니다!!',
        },
        {
          question: '홍보 영상',
          answer:
            'https://www.youtube.com/watch?v=c9zP8SflWP0 (제주도 원정)\nhttps://www.instagram.com/p/CzA505nv3cc (부산시 지원 홍보 영상)',
        },
      ],
    },
    recruitmentTarget: '부경대학교 재학생',
    socialLinks: {
      instagram: 'https://www.instagram.com/pknu_diver/',
      youtube: '',
      x: '',
    },
    lastModifiedDate: '2026.01.27 06:59',
  },
  '6873bd299033815c4391192e': {
    logo: 'https://cdn.moadong.com/6873bd299033815c4391192e/logo/kchyo7RbVV.webp',
    cover: '',
    feeds: [
      'https://cdn.moadong.com/6873bd299033815c4391192e/feed/EohDzOn8p2.webp',
      'https://cdn.moadong.com/6873bd299033815c4391192e/feed/UCt8PCiKg7.webp',
      'https://cdn.moadong.com/6873bd299033815c4391192e/feed/J1Ywm7IsmM.webp',
      'https://cdn.moadong.com/6873bd299033815c4391192e/feed/0XKhv6vFeK.webp',
      'https://cdn.moadong.com/6873bd299033815c4391192e/feed/RUIRIMN4QU.webp',
      'https://cdn.moadong.com/6873bd299033815c4391192e/feed/Wp5EUBAuSL.webp',
      'https://cdn.moadong.com/6873bd299033815c4391192e/feed/XAbLeOTMJr.webp',
      'https://cdn.moadong.com/6873bd299033815c4391192e/feed/0mx1uuhUQF.webp',
    ],
    introduction: '부경대학교 중앙 스트릿 댄스 동아리',
    tags: ['댄스', ''],
    category: '공연',
    division: '중동',
    description: {
      introDescription:
        "부경대학교 중앙 '스트릿 댄스 동아리 UCDC'는 (부경대•부산대•경성대•동의대) 부산 내 4개 대학 연합 댄스 동아리 입니다. ♥ \nKpop 댄스와 다양한 스트릿 댄스를 전문으로 다루며, 열정 있는 1, 2학년 학생들을 위한 공간입니다.",
      activityDescription:
        'Breaking, Hip-hop, Waacking, Locking 등의 다양한 댄스 장르를 배우고 연습합니다 ! \n그 외에도 \n- 4개 대학 연합 합동 공연 및 워크샵\n- 관객과 소통하는 버스킹 및 외부 공연 참가\n- 교내 축제 및 행사, 정기 발표회\n- MT, 신입생 환영회, 체전 등 친목 도모 활동\n등등 다양한 활동 하고 있습니다 \n◡̈ \n(구체적인 활동은 유튜브, 인스타를 통해 참고해주세요 💛💛)\n\n저희 UCDC에서 같이 활동해요 ☺️\n많이 많이 지원해주세요~🔥',
      awards: [],
      idealCandidate: {
        tags: [],
        content:
          '💛 춤을 좋아하는 사람\n💛 선후배 구분 없이 다 같이 친해지고 싶은 사람\n💛 무대, 버스킹 등 한 번쯤 도전해보고 싶은 사람\n💛 좋은 추억 만들고 싶은 사람\n\n+ 이걸 보고 있는 당신 🫵(۶•̀ᴗ•́)۶//\n',
      },
      benefits: '',
      faqs: [
        {
          question: '개강 후 연습은 어떻게 진행되나요?',
          answer:
            '학기 중 정규 연습의 경우 월, 수, 금 주 3회 진행합니다 ! (요일은 변동될 수 있습니다)',
        },
        {
          question: '동아리 가입 할 때 조건이 필요하나요?',
          answer:
            '저희는 오디션이 없습니다! 네이버 폼으로 신청하시거나 동방에 직접 오셔서 신청하시면 됩니다🩷 춤에 대한 열정만 있다면! 빈손으로 오셔도 됩니다~!',
        },
        {
          question:
            '장르를 다양하게 체험하고 싶어요!! 그리고 나중에 원하는 장르 선택이 가능한가요?',
          answer:
            '여름방학 전까지의 기간이 장르 체험 기간이에요! 다양한 체험을 통해 자신과 맞는 장르를 찾고, 본인이 원하는 장르를 자유롭게 선택할 수 있습니다 ˙ᵕ˙',
        },
        {
          question: '춤 처음 춰보는데 괜찮을까요?',
          answer:
            '현재 부원들 중에도 춤을 처음 접하는 사람들이 정말 많았습니다 ! (이제는 음악만 나오면 날아다니는…)\n아이솔레이션과 기본기부터 하나하나 차근차근 배울 수 있고, 자신을 동아리에서 갈고닦을 기회가 정말 많기 때문에 열정만 데리고 오시면 됩니다 ( ᐛ ) 현재 무대도 한 번에 준비한 것이 아니라 준비기간을 길게 잡고 꾸렸습니당! 모두가 완벽하지 않기 때문에 같이 연습해요',
        },
        {
          question:
            '제가 조금 내성적인 편인데 분위기에 적응하지 못할까 봐 걱정입니다 .. 잘할 수 있을까요..?',
          answer:
            '현 부원들이 행복한 환경에서 춤출 수 있도록 모두가 노력하고 있는 동아리입니다😻\n새로 오신 분들께는 더 많은 노력과 정성을 기울이는 동아리이고, 모두가 여러분을 환영하고 있습니다!!(っ˙˘˙)っ❤️ 매주 있는 회식을 통해 선배들, 동기들과 친해질 기회가 정말!! 많으니 걱정 없이 바로 오시면 됩니다아~~🫶🙌',
        },
        {
          question: '정규 연습은 언제 진행되나요?',
          answer: '1학기에 오후 6시부터 8시까지 진행될 예정입니다.',
        },
      ],
    },
    recruitmentTarget: '춤을 좋아하는 학생',
    socialLinks: {
      instagram: 'https://www.instagram.com/pknuucdc',
      youtube: 'https://www.youtube.com/@pknuucdc',
      x: '',
    },
    lastModifiedDate: '2026.02.14 01:03',
  },
};
