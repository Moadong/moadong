# UN 평화축제 퀴즈 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 홈 배너에서 진입하는 `/peace` 하위 3개 화면(랜딩 → 8문항 퀴즈 → 결과 카드)을 프론트 단독으로 동작하게 추가한다.

**Architecture:** `frontend/src/pages/PeacePage/` 한 폴더에 격리한다. 질문·유형은 TS 상수, 채점은 순수 함수, 결과 유형은 URL 쿼리(`/peace/result?type=…`)로 넘긴다. 기존 코드와 닿는 곳은 `AppRoutes.tsx`의 라우트 3개와 `eventName.ts` 상수 7개뿐이다. 카드 3D 연출은 framer-motion CSS transform으로 하고 WebGL은 쓰지 않는다.

**Tech Stack:** React 19 + TypeScript, react-router-dom v7, styled-components, framer-motion ^12, Jest 29 + @testing-library/react, Storybook 10.

**Spec:** `docs/superpowers/specs/2026-09-28-peace-festival-quiz-design.md`

## Global Constraints

- 작업 디렉터리는 `frontend/`. 모든 `npm` 명령은 그 안에서 실행한다.
- 새 의존성 추가 금지. three.js·r3f·lottie·gsap 도입 금지. framer-motion은 이미 있다.
- 테스트 구간(`/peace`, `/peace/quiz`)은 네트워크 호출 0회, `localStorage`·`sessionStorage` 사용 0건.
- Mixpanel 이벤트명은 `src/constants/eventName.ts` 상수만 사용. 문자열 하드코딩 금지. CI의 `npm run audit:tracking`이 참조되지 않는 키를 잡으므로 실제로 호출하는 키만 추가한다.
- React Compiler가 켜져 있다. `memo`/`useCallback`/`useMemo`를 수동으로 넣지 않는다. nullable 프로퍼티 접근은 옵셔널 체이닝을 쓴다.
- 파일 규칙: 컴포넌트 PascalCase `.tsx`, 유틸 camelCase `.ts`, 상수 UPPER_SNAKE_CASE. 스타일은 `import * as Styled from './X.styles'`, transient prop은 `$` 접두사. 페이지 컴포넌트는 `export default`. `any` 금지.
- import 순서: 외부 → 내부(`@/`) → 타입 → 스타일. Prettier가 정렬하므로 커밋 전 `npx prettier --write <파일>`.
- 커밋 메시지는 `feat(peace): 한글 문장` 형식(기존 로그 `feat(club-detail): …`와 동일). 트레일러(Co-Authored-By 등) 금지.
- 커밋 단계는 사용자 승인이 있을 때만 실행한다. 승인 없으면 커밋 단계를 건너뛰고 변경을 작업 트리에 둔다.
- PR은 이 브랜치(`munich-v1`)로 만들지 않는다. 이슈·Jira 생성 후 `feature/#번호-peace-quiz-MOA-키` 브랜치가 필요하다. 이는 사용자 결정 사항이라 계획 범위 밖이다.
- 유형 ID는 영문 고정: `carer`(돌봄가·봉사), `embracer`(포용가·종교), `daily`(일상가·취미교양), `explorer`(탐구가·학술), `energizer`(활력가·운동), `expresser`(표현가·공연).
- 동점 우선순위: `['daily', 'embracer', 'energizer', 'expresser', 'carer', 'explorer']`.
- 카드 색은 `theme.colors.secondary[1~6]`의 `main`/`back`. 분과→인덱스는 `src/styles/clubTags.ts`와 동일(봉사 1, 종교 2, 취미교양 3, 학술 4, 운동 5, 공연 6).
- 추천 동아리 이름은 미정. `recommendedClubs: []`로 두고 빈 배열이면 태그 영역을 렌더하지 않는다.
- 카드 이미지는 미정. `cardImages.ts`의 `CARD_IMAGES`는 빈 객체로 시작하고, 없는 유형은 분과 `main` 색 단색 카드로 그린다.

## Review Focus

1. `/peace/result?type=abc`처럼 정의되지 않은 유형, 또는 쿼리 없는 진입 → `/peace`로 replace 리다이렉트되어야 한다(Task 7 테스트).
2. 1번 문항에서 "이전" 버튼 → 음수 인덱스가 아니라 `/peace`로 돌아가야 한다(Task 5 테스트).
3. 태블릿에서 선택지를 빠르게 두 번 탭해도 한 문항만 진행되어야 한다. 핸들러가 렌더 시점 `answers`로 `next`를 만들고 `setAnswers(next)`를 부르므로, 리렌더 전 중복 탭은 같은 배열을 두 번 set하는 것으로 끝난다. 이 성질은 jsdom에서 재현할 수 없어(두 번째 클릭 시점엔 버튼이 이미 교체됨) Task 8 수동 시나리오 12로 확인한다.
4. 결과 화면에서 브라우저 뒤로 가기 → 퀴즈 중간이 아니라 `/peace`로 가야 한다. 퀴즈→결과 이동은 `replace: true`(Task 5 테스트 "결과에서 뒤로 가면 랜딩으로 간다").
5. `recommendedClubs`가 비어 있으면 "추천 동아리" 제목과 칩 영역이 아예 렌더되지 않아야 한다(Task 7 테스트).

---

### Task 1: 유형·질문 데이터

**Files:**
- Create: `frontend/src/pages/PeacePage/data/peaceTypes.ts`
- Create: `frontend/src/pages/PeacePage/data/questions.ts`
- Test: `frontend/src/pages/PeacePage/data/questions.test.ts`

**Interfaces:**
- Consumes: 없음
- Produces:
  - `type PeaceTypeId = 'carer' | 'embracer' | 'daily' | 'explorer' | 'energizer' | 'expresser'`
  - `interface PeaceType { id; name; catchphrase; description; smallAction; category; colorIndex: 1|2|3|4|5|6; recommendedClubs: string[] }`
  - `const PEACE_TYPES: Record<PeaceTypeId, PeaceType>`
  - `const PEACE_TYPE_IDS: PeaceTypeId[]` (6개, 표시 순서)
  - `const TIE_BREAK_ORDER: PeaceTypeId[]`
  - `const isPeaceTypeId: (value: string | null) => value is PeaceTypeId`
  - `interface PeaceQuestion { id: number; text: string; options: { label: string; type: PeaceTypeId }[] }`
  - `const PEACE_QUESTIONS: PeaceQuestion[]` (8개)

- [ ] **Step 1: 데이터 불변식 테스트 작성**

`frontend/src/pages/PeacePage/data/questions.test.ts`:

```ts
import {
  PEACE_TYPE_IDS,
  PEACE_TYPES,
  PeaceTypeId,
  TIE_BREAK_ORDER,
  isPeaceTypeId,
} from './peaceTypes';
import { PEACE_QUESTIONS } from './questions';

describe('평화 유형 데이터', () => {
  it('유형은 6개이고 ID와 레코드 키가 일치한다', () => {
    expect(PEACE_TYPE_IDS).toHaveLength(6);
    expect(Object.keys(PEACE_TYPES).sort()).toEqual([...PEACE_TYPE_IDS].sort());
    PEACE_TYPE_IDS.forEach((id) => expect(PEACE_TYPES[id].id).toBe(id));
  });

  it('동점 우선순위는 6개 유형을 정확히 한 번씩 담는다', () => {
    expect([...TIE_BREAK_ORDER].sort()).toEqual([...PEACE_TYPE_IDS].sort());
  });

  it('분과 색 인덱스는 1~6에서 서로 겹치지 않는다', () => {
    const indexes = PEACE_TYPE_IDS.map((id) => PEACE_TYPES[id].colorIndex);
    expect([...indexes].sort()).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('isPeaceTypeId는 정의된 ID만 통과시킨다', () => {
    expect(isPeaceTypeId('carer')).toBe(true);
    expect(isPeaceTypeId('abc')).toBe(false);
    expect(isPeaceTypeId(null)).toBe(false);
  });
});

describe('평화 질문 데이터', () => {
  it('8문항이고 각 문항은 4지선다다', () => {
    expect(PEACE_QUESTIONS).toHaveLength(8);
    PEACE_QUESTIONS.forEach((q, i) => {
      expect(q.id).toBe(i + 1);
      expect(q.options).toHaveLength(4);
    });
  });

  it('유형별 선택지 등장 횟수는 기획과 같다', () => {
    const counts = {} as Record<PeaceTypeId, number>;
    PEACE_QUESTIONS.flatMap((q) => q.options).forEach((o) => {
      counts[o.type] = (counts[o.type] ?? 0) + 1;
    });
    expect(counts).toEqual({
      carer: 6,
      embracer: 5,
      daily: 5,
      explorer: 6,
      energizer: 5,
      expresser: 5,
    });
  });
});
```

- [ ] **Step 2: 실패 확인**

Run: `cd frontend && npx jest src/pages/PeacePage/data/questions.test.ts`
Expected: FAIL, `Cannot find module './peaceTypes'`

- [ ] **Step 3: peaceTypes.ts 작성**

`frontend/src/pages/PeacePage/data/peaceTypes.ts`:

```ts
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
  description: string;
  smallAction: string;
  /** CategoryButtonList와 같은 한글 분과 라벨 */
  category: string;
  /** theme.colors.secondary 인덱스. clubTags.ts의 분과 매핑과 동일 */
  colorIndex: 1 | 2 | 3 | 4 | 5 | 6;
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
    description: '주변을 살피고 먼저 손을 내미는 당신. 돌봄이 곧 평화입니다.',
    smallAction: '가까운 사람에게 안부 한마디 건네기',
    category: '봉사',
    colorIndex: 1,
    recommendedClubs: [],
  },
  embracer: {
    id: 'embracer',
    name: '포용가',
    catchphrase: '서로 다른 믿음과 가치를 존중하는 평화 메이커',
    description: '다름을 품고 존중하는 당신. 포용이 곧 평화입니다.',
    smallAction: '나와 다른 생각 하나 끝까지 들어보기',
    category: '종교',
    colorIndex: 2,
    recommendedClubs: [],
  },
  daily: {
    id: 'daily',
    name: '일상가',
    catchphrase: '소소한 취미와 일상에서 평화를 찾는 평화 메이커',
    description: '작은 즐거움으로 하루를 채우는 당신. 여유가 곧 평화입니다.',
    smallAction: '오늘 좋아하는 것 하나에 10분 쓰기',
    category: '취미교양',
    colorIndex: 3,
    recommendedClubs: [],
  },
  explorer: {
    id: 'explorer',
    name: '탐구가',
    catchphrase: '배우고 이해하며 시야를 넓히는 평화 메이커',
    description: '알고 싶어 하고 이해하려는 당신. 이해가 곧 평화입니다.',
    smallAction: '다른 나라 문화 한 가지 찾아보기',
    category: '학술',
    colorIndex: 4,
    recommendedClubs: [],
  },
  energizer: {
    id: 'energizer',
    name: '활력가',
    catchphrase: '함께 몸을 움직이며 에너지를 나누는 평화 메이커',
    description: '함께 뛰며 기운을 나누는 당신. 활력이 곧 평화입니다.',
    smallAction: '오늘 10분 몸을 움직여보기',
    category: '운동',
    colorIndex: 5,
    recommendedClubs: [],
  },
  expresser: {
    id: 'expresser',
    name: '표현가',
    catchphrase: '예술과 공연으로 마음을 전하는 평화 메이커',
    description: '느낌을 무대와 작품으로 풀어내는 당신. 표현이 곧 평화입니다.',
    smallAction: '평화 메시지를 그림이나 글로 남기기',
    category: '공연',
    colorIndex: 6,
    recommendedClubs: [],
  },
};

export const isPeaceTypeId = (value: string | null): value is PeaceTypeId =>
  value !== null && (PEACE_TYPE_IDS as string[]).includes(value);
```

- [ ] **Step 4: questions.ts 작성**

기획 페이지 문구를 옮긴다. 오탈자 세 곳은 바로잡는다(끓린다→끌린다, 손을 보태다→손을 보탠다, 때 흘리는→땀 흘리는).

`frontend/src/pages/PeacePage/data/questions.ts`:

```ts
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
```

- [ ] **Step 5: 통과 확인**

Run: `cd frontend && npx jest src/pages/PeacePage/data/questions.test.ts`
Expected: PASS (6 tests)

- [ ] **Step 6: 커밋**

```bash
cd frontend && npx prettier --write src/pages/PeacePage/data
git add frontend/src/pages/PeacePage/data
git commit -m "feat(peace): 평화 유형 6개와 질문 8문항 데이터를 추가한다"
```

---

### Task 2: 채점 함수

**Files:**
- Create: `frontend/src/pages/PeacePage/utils/calculatePeaceType.ts`
- Test: `frontend/src/pages/PeacePage/utils/calculatePeaceType.test.ts`

**Interfaces:**
- Consumes: `PEACE_QUESTIONS`, `PEACE_TYPE_IDS`, `TIE_BREAK_ORDER`, `PeaceTypeId` (Task 1)
- Produces: `calculatePeaceType(answers: number[]): PeaceTypeId`. `answers[i]`는 i번째 문항에서 고른 option 인덱스. 길이가 8이 아니면 throw.

- [ ] **Step 1: 테스트 작성**

테스트 데이터는 Task 1의 선택지 배치에 의존한다. 유형별 등장 문항은 다음과 같다.

| 유형 | 등장 문항 |
|---|---|
| carer | Q1 Q3 Q4 Q5 Q6 Q8 |
| embracer | Q2 Q3 Q5 Q7 Q8 |
| daily | Q2 Q3 Q4 Q6 Q7 |
| explorer | Q1 Q2 Q4 Q5 Q6 Q8 |
| energizer | Q1 Q2 Q3 Q5 Q7 |
| expresser | Q1 Q4 Q6 Q7 Q8 |

`frontend/src/pages/PeacePage/utils/calculatePeaceType.test.ts`:

```ts
import { PeaceTypeId } from '../data/peaceTypes';
import { PEACE_QUESTIONS } from '../data/questions';
import { calculatePeaceType } from './calculatePeaceType';

/** 문항별로 원하는 유형의 선택지 인덱스를 고른다. 없으면 테스트 데이터가 잘못된 것이므로 throw */
const choose = (plan: PeaceTypeId[]): number[] =>
  PEACE_QUESTIONS.map((q, i) => {
    const idx = q.options.findIndex((o) => o.type === plan[i]);
    if (idx < 0) throw new Error(`Q${q.id}에 ${plan[i]} 선택지가 없다`);
    return idx;
  });

describe('calculatePeaceType', () => {
  it('가장 많이 고른 유형을 반환한다', () => {
    // carer 6 (Q1 Q3 Q4 Q5 Q6 Q8) + daily 2 (Q2 Q7)
    const answers = choose([
      'carer', 'daily', 'carer', 'carer', 'carer', 'carer', 'daily', 'carer',
    ]);
    expect(calculatePeaceType(answers)).toBe('carer');
  });

  it('우선순위 마지막 유형(탐구)도 단독 최고점이면 그대로 반환한다', () => {
    // explorer 6 (Q1 Q2 Q4 Q5 Q6 Q8) + daily 2 (Q3 Q7)
    const answers = choose([
      'explorer', 'explorer', 'daily', 'explorer', 'explorer', 'explorer', 'daily', 'explorer',
    ]);
    expect(calculatePeaceType(answers)).toBe('explorer');
  });

  it('동점이면 TIE_BREAK_ORDER에서 앞선 유형을 고른다', () => {
    // energizer 4 (Q1 Q2 Q3 Q7) : carer 4 (Q4 Q5 Q6 Q8)
    // TIE_BREAK_ORDER: daily → embracer → energizer → expresser → carer → explorer
    const answers = choose([
      'energizer', 'energizer', 'energizer', 'carer', 'carer', 'carer', 'energizer', 'carer',
    ]);
    expect(calculatePeaceType(answers)).toBe('energizer');
  });

  it('답 개수가 문항 수와 다르면 throw한다', () => {
    expect(() => calculatePeaceType([0, 1, 2])).toThrow();
    expect(() => calculatePeaceType([])).toThrow();
  });
});
```

- [ ] **Step 2: 실패 확인**

Run: `cd frontend && npx jest src/pages/PeacePage/utils/calculatePeaceType.test.ts`
Expected: FAIL, `Cannot find module './calculatePeaceType'`

- [ ] **Step 3: 구현**

`frontend/src/pages/PeacePage/utils/calculatePeaceType.ts`:

```ts
import { PEACE_TYPE_IDS, PeaceTypeId, TIE_BREAK_ORDER } from '../data/peaceTypes';
import { PEACE_QUESTIONS } from '../data/questions';

/**
 * answers[i] = i번째 문항에서 고른 option 인덱스.
 * 각 답의 유형에 +1, 최고점 유형을 반환한다. 동점이면 TIE_BREAK_ORDER 앞순위.
 * 8답이 모두 있을 때만 호출하는 것이 계약이다.
 */
export const calculatePeaceType = (answers: number[]): PeaceTypeId => {
  if (answers.length !== PEACE_QUESTIONS.length) {
    throw new Error(
      `answers must have ${PEACE_QUESTIONS.length} items, got ${answers.length}`,
    );
  }

  const scores = Object.fromEntries(
    PEACE_TYPE_IDS.map((id) => [id, 0]),
  ) as Record<PeaceTypeId, number>;

  answers.forEach((optionIndex, i) => {
    const option = PEACE_QUESTIONS[i].options[optionIndex];
    scores[option.type] += 1;
  });

  const max = Math.max(...Object.values(scores));
  return TIE_BREAK_ORDER.find((id) => scores[id] === max) as PeaceTypeId;
};
```

- [ ] **Step 4: 통과 확인**

Run: `cd frontend && npx jest src/pages/PeacePage/utils/calculatePeaceType.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: 커밋**

```bash
cd frontend && npx prettier --write src/pages/PeacePage/utils
git add frontend/src/pages/PeacePage/utils
git commit -m "feat(peace): 8답을 합산해 평화 유형을 고르는 채점 함수를 추가한다"
```

---

### Task 3: 공통 레이아웃

**Files:**
- Create: `frontend/src/pages/PeacePage/components/PeaceLayout/PeaceLayout.tsx`
- Create: `frontend/src/pages/PeacePage/components/PeaceLayout/PeaceLayout.styles.ts`
- Test: `frontend/src/pages/PeacePage/components/PeaceLayout/PeaceLayout.test.tsx`

**Interfaces:**
- Consumes: `Header`, `WebviewTopBar`, `Footer`, `useDevice`, `isInAppWebView` (기존)
- Produces: `PeaceLayout({ children }: { children: ReactNode })`. 데스크톱은 `Header`(position fixed, 92px)이므로 본문에 `HEADER_HEIGHT.desktop`만큼 상단 여백을 준다. 모바일·태블릿·웹뷰는 `WebviewTopBar title='나와 맞는 평화 활동 찾기'`(일반 흐름, 여백 없음). 웹뷰가 아니면 `Footer`. 본문은 최대 폭 560px 중앙 정렬. `PEACE_PAGE_TITLE` 상수도 export한다.

- [ ] **Step 1: 테스트 작성**

`frontend/src/pages/PeacePage/components/PeaceLayout/PeaceLayout.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import PeaceLayout from './PeaceLayout';

jest.mock('mixpanel-browser', () => ({ track: jest.fn() }));
jest.mock('@/components/common/Header/Header', () => ({
  __esModule: true,
  default: () => <div>HEADER</div>,
}));
jest.mock('@/components/common/Footer/Footer', () => ({
  __esModule: true,
  default: () => <div>FOOTER</div>,
}));
jest.mock('@/components/common/WebviewTopBar/WebviewTopBar', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div>TOPBAR {title}</div>,
}));

const renderLayout = () =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <PeaceLayout>
          <p>본문</p>
        </PeaceLayout>
      </MemoryRouter>
    </ThemeProvider>,
  );

const setWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', { value: width, writable: true });
};

describe('PeaceLayout', () => {
  it('데스크톱 폭에서는 Header와 Footer를 그린다', () => {
    setWidth(1024);
    renderLayout();
    expect(screen.getByText('HEADER')).toBeInTheDocument();
    expect(screen.getByText('FOOTER')).toBeInTheDocument();
    expect(screen.getByText('본문')).toBeInTheDocument();
  });

  it('모바일 폭에서는 WebviewTopBar를 그린다', () => {
    setWidth(390);
    renderLayout();
    expect(screen.getByText('TOPBAR 나와 맞는 평화 활동 찾기')).toBeInTheDocument();
    expect(screen.queryByText('HEADER')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 실패 확인**

Run: `cd frontend && npx jest src/pages/PeacePage/components/PeaceLayout`
Expected: FAIL, `Cannot find module './PeaceLayout'`

- [ ] **Step 3: 스타일 작성**

`frontend/src/pages/PeacePage/components/PeaceLayout/PeaceLayout.styles.ts`:

```ts
import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const PageWrapper = styled.div`
  width: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.base.white};
`;

export const Main = styled.main<{ $topOffset: number }>`
  flex: 1;
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  padding: ${({ $topOffset }) => 40 + $topOffset}px 24px 64px;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  ${media.mobile} {
    padding: ${({ $topOffset }) => 24 + $topOffset}px 20px 48px;
  }
`;
```

- [ ] **Step 4: 컴포넌트 작성**

`frontend/src/pages/PeacePage/components/PeaceLayout/PeaceLayout.tsx`:

```tsx
import { ReactNode } from 'react';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import { HEADER_HEIGHT } from '@/components/common/Header/Header.styles';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import useDevice from '@/hooks/useDevice';
import isInAppWebView from '@/utils/isInAppWebView';
import * as Styled from './PeaceLayout.styles';

export const PEACE_PAGE_TITLE = '나와 맞는 평화 활동 찾기';

interface PeaceLayoutProps {
  children: ReactNode;
}

const PeaceLayout = ({ children }: PeaceLayoutProps) => {
  const { isMobile, isTablet } = useDevice();
  const showPageTopBar = isMobile || isTablet || isInAppWebView();

  return (
    <Styled.PageWrapper>
      {showPageTopBar ? <WebviewTopBar title={PEACE_PAGE_TITLE} /> : <Header />}
      <Styled.Main $topOffset={showPageTopBar ? 0 : HEADER_HEIGHT.desktop}>
        {children}
      </Styled.Main>
      {!isInAppWebView() && <Footer />}
    </Styled.PageWrapper>
  );
};

export default PeaceLayout;
```

- [ ] **Step 5: 통과 확인**

Run: `cd frontend && npx jest src/pages/PeacePage/components/PeaceLayout`
Expected: PASS (2 tests)

- [ ] **Step 6: 커밋**

```bash
cd frontend && npx prettier --write src/pages/PeacePage/components/PeaceLayout
git add frontend/src/pages/PeacePage/components/PeaceLayout
git commit -m "feat(peace): 평화축제 화면 공통 레이아웃을 추가한다"
```

---

### Task 4: 랜딩 페이지와 `/peace` 라우트

**Files:**
- Create: `frontend/src/pages/PeacePage/PeaceIntroPage.tsx`
- Create: `frontend/src/pages/PeacePage/PeaceIntroPage.styles.ts`
- Modify: `frontend/src/constants/eventName.ts` (`USER_EVENT` 끝, `PAGE_VIEW` GAME_PAGE 아래)
- Modify: `frontend/src/constants/CLAUDE.md` (eventName 줄)
- Modify: `frontend/src/routes/AppRoutes.tsx` (`/game` 라우트 아래)
- Test: `frontend/src/pages/PeacePage/PeaceIntroPage.test.tsx`

**Interfaces:**
- Consumes: `PeaceLayout` (Task 3), `useTrackPageView`, `useMixpanelTrack` (기존)
- Produces:
  - `PAGE_VIEW.PEACE_INTRO_PAGE = 'PeaceIntroPage'`
  - `USER_EVENT.PEACE_QUIZ_STARTED = 'Peace Quiz Started'`
  - 라우트 `/peace` → `PeaceIntroPage`

- [ ] **Step 1: 테스트 작성**

`frontend/src/pages/PeacePage/PeaceIntroPage.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import PeaceIntroPage from './PeaceIntroPage';

jest.mock('mixpanel-browser', () => ({ track: jest.fn() }));
jest.mock('./components/PeaceLayout/PeaceLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PEACE_PAGE_TITLE: '나와 맞는 평화 활동 찾기',
}));

const renderIntro = () =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={['/peace']}>
        <Routes>
          <Route path='/peace' element={<PeaceIntroPage />} />
          <Route path='/peace/quiz' element={<div>QUIZ</div>} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );

describe('PeaceIntroPage', () => {
  it('제목과 시작하기 버튼을 그린다', () => {
    renderIntro();
    expect(screen.getByText('나와 맞는 평화 활동 찾기')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '시작하기' })).toBeInTheDocument();
  });

  it('시작하기를 누르면 /peace/quiz로 이동한다', async () => {
    renderIntro();
    await userEvent.click(screen.getByRole('button', { name: '시작하기' }));
    expect(screen.getByText('QUIZ')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 실패 확인**

Run: `cd frontend && npx jest src/pages/PeacePage/PeaceIntroPage.test.tsx`
Expected: FAIL, `Cannot find module './PeaceIntroPage'`

- [ ] **Step 3: 이벤트 상수 추가**

`frontend/src/constants/eventName.ts`의 `USER_EVENT` 객체 안, `WEBVIEW_SUBSCRIBE_TOGGLED` 줄 아래에:

```ts
  // 평화축제
  PEACE_QUIZ_STARTED: 'Peace Quiz Started',
```

`PAGE_VIEW` 객체 안, `GAME_PAGE: 'GamePage',` 아래에:

```ts
  PEACE_INTRO_PAGE: 'PeaceIntroPage',
```

`frontend/src/constants/CLAUDE.md`의 `eventName.ts` 줄을 다음으로 바꾼다:

```
- `eventName.ts` - Mixpanel 이벤트명 (`USER_EVENT`, `PAGE_VIEW`, `PAGE_NAME`). 평화축제(`PEACE_*`)는 2026-10 행사 종료 후 제거 대상
```

- [ ] **Step 4: 스타일 작성**

`frontend/src/pages/PeacePage/PeaceIntroPage.styles.ts`:

```ts
import styled from 'styled-components';
import { setTypography } from '@/styles/theme/typography';

export const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  padding: 48px 0 40px;
`;

export const Eyebrow = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p2)};
  color: ${({ theme }) => theme.colors.primary[900]};
`;

export const Title = styled.h1`
  ${({ theme }) => setTypography(theme.typography.title.title2)};
  color: ${({ theme }) => theme.colors.base.black};
`;

export const Description = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p1)};
  color: ${({ theme }) => theme.colors.gray[700]};
  white-space: pre-line;
`;

export const StartButton = styled.button`
  width: 100%;
  min-height: 64px;
  margin-top: 24px;
  border: none;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.primary[900]};
  color: ${({ theme }) => theme.colors.base.white};
  ${({ theme }) => setTypography(theme.typography.title.title5)};
  cursor: pointer;

  &:active {
    transform: scale(0.98);
  }
`;
```

- [ ] **Step 5: 컴포넌트 작성**

`frontend/src/pages/PeacePage/PeaceIntroPage.tsx`:

```tsx
import { useNavigate } from 'react-router-dom';
import { PAGE_VIEW, USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import PeaceLayout, { PEACE_PAGE_TITLE } from './components/PeaceLayout/PeaceLayout';
import * as Styled from './PeaceIntroPage.styles';

const PeaceIntroPage = () => {
  useTrackPageView(PAGE_VIEW.PEACE_INTRO_PAGE);
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();

  const handleStart = () => {
    trackEvent(USER_EVENT.PEACE_QUIZ_STARTED);
    navigate('/peace/quiz');
  };

  return (
    <PeaceLayout>
      <Styled.Hero>
        <Styled.Eyebrow>연결이 곧 평화</Styled.Eyebrow>
        <Styled.Title>{PEACE_PAGE_TITLE}</Styled.Title>
        <Styled.Description>
          {'8개 질문에 답하면\n나에게 맞는 평화 유형과 활동을 알려드려요.\n30초면 충분해요.'}
        </Styled.Description>
      </Styled.Hero>
      <Styled.StartButton type='button' onClick={handleStart}>
        시작하기
      </Styled.StartButton>
    </PeaceLayout>
  );
};

export default PeaceIntroPage;
```

- [ ] **Step 6: 라우트 등록**

`frontend/src/routes/AppRoutes.tsx` 상단 import 목록에 (`GamePage` import 아래):

```ts
import PeaceIntroPage from '@/pages/PeacePage/PeaceIntroPage';
```

`/game` 라우트 객체 바로 아래에:

```tsx
    {
      path: '/peace',
      element: (
        <ContentErrorBoundary>
          <PeaceIntroPage />
        </ContentErrorBoundary>
      ),
    },
```

- [ ] **Step 7: 통과 확인**

Run: `cd frontend && npx jest src/pages/PeacePage/PeaceIntroPage.test.tsx && npm run typecheck`
Expected: PASS (2 tests), typecheck 오류 0

- [ ] **Step 8: 커밋**

```bash
cd frontend && npx prettier --write src/pages/PeacePage src/routes/AppRoutes.tsx src/constants/eventName.ts
git add frontend/src/pages/PeacePage frontend/src/routes/AppRoutes.tsx frontend/src/constants/eventName.ts frontend/src/constants/CLAUDE.md
git commit -m "feat(peace): /peace 랜딩 페이지와 라우트를 추가한다"
```

---

### Task 5: 퀴즈 페이지와 `/peace/quiz` 라우트

**Files:**
- Create: `frontend/src/pages/PeacePage/PeaceQuizPage.tsx`
- Create: `frontend/src/pages/PeacePage/PeaceQuizPage.styles.ts`
- Modify: `frontend/src/constants/eventName.ts`
- Modify: `frontend/src/routes/AppRoutes.tsx`
- Test: `frontend/src/pages/PeacePage/PeaceQuizPage.test.tsx`

**Interfaces:**
- Consumes: `PEACE_QUESTIONS` (Task 1), `calculatePeaceType` (Task 2), `PeaceLayout` (Task 3)
- Produces:
  - `PAGE_VIEW.PEACE_QUIZ_PAGE = 'PeaceQuizPage'`
  - `USER_EVENT.PEACE_QUIZ_COMPLETED = 'Peace Quiz Completed'` props `{ type }`
  - 라우트 `/peace/quiz`
  - 완료 시 `navigate('/peace/result?type=<PeaceTypeId>', { replace: true })`

- [ ] **Step 1: 테스트 작성**

`frontend/src/pages/PeacePage/PeaceQuizPage.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { ReactNode } from 'react';
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { PEACE_QUESTIONS } from './data/questions';
import PeaceQuizPage from './PeaceQuizPage';

jest.mock('mixpanel-browser', () => ({ track: jest.fn() }));
jest.mock('./components/PeaceLayout/PeaceLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PEACE_PAGE_TITLE: '나와 맞는 평화 활동 찾기',
}));

const ResultProbe = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  return (
    <div>
      <div>RESULT {search}</div>
      <button type='button' onClick={() => navigate(-1)}>
        뒤로
      </button>
    </div>
  );
};

const answerAll = async () => {
  for (let i = 0; i < PEACE_QUESTIONS.length; i += 1) {
    // 모두 첫 번째 선택지: energizer, daily, carer, carer, carer, carer, embracer, carer → carer 5점
    await userEvent.click(
      screen.getByRole('button', { name: PEACE_QUESTIONS[i].options[0].label }),
    );
  }
};

const renderQuiz = () =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={['/peace', '/peace/quiz']} initialIndex={1}>
        <Routes>
          <Route path='/peace' element={<div>INTRO</div>} />
          <Route path='/peace/quiz' element={<PeaceQuizPage />} />
          <Route path='/peace/result' element={<ResultProbe />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );

describe('PeaceQuizPage', () => {
  it('첫 문항과 진행 표시 1 / 8을 그린다', () => {
    renderQuiz();
    expect(screen.getByText(PEACE_QUESTIONS[0].text)).toBeInTheDocument();
    expect(screen.getByText('1 / 8')).toBeInTheDocument();
  });

  it('선택지를 누르면 다음 문항으로 넘어간다', async () => {
    renderQuiz();
    await userEvent.click(screen.getByRole('button', { name: PEACE_QUESTIONS[0].options[0].label }));
    expect(screen.getByText(PEACE_QUESTIONS[1].text)).toBeInTheDocument();
    expect(screen.getByText('2 / 8')).toBeInTheDocument();
  });

  it('이전 버튼은 앞 문항으로 돌아가고, 첫 문항에서는 /peace로 간다', async () => {
    renderQuiz();
    await userEvent.click(screen.getByRole('button', { name: PEACE_QUESTIONS[0].options[0].label }));
    await userEvent.click(screen.getByRole('button', { name: '이전' }));
    expect(screen.getByText('1 / 8')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '이전' }));
    expect(screen.getByText('INTRO')).toBeInTheDocument();
  });

  it('8문항을 모두 답하면 결과 페이지로 유형 쿼리와 함께 이동한다', async () => {
    renderQuiz();
    await answerAll();
    expect(screen.getByText('RESULT ?type=carer')).toBeInTheDocument();
  });

  it('결과에서 뒤로 가면 퀴즈가 아니라 랜딩으로 간다', async () => {
    // 퀴즈→결과가 replace라 히스토리는 [/peace, /peace/result]
    renderQuiz();
    await answerAll();
    await userEvent.click(screen.getByRole('button', { name: '뒤로' }));
    expect(screen.getByText('INTRO')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 실패 확인**

Run: `cd frontend && npx jest src/pages/PeacePage/PeaceQuizPage.test.tsx`
Expected: FAIL, `Cannot find module './PeaceQuizPage'`

- [ ] **Step 3: 이벤트 상수 추가**

`USER_EVENT`의 `PEACE_QUIZ_STARTED` 아래:

```ts
  PEACE_QUIZ_COMPLETED: 'Peace Quiz Completed',
```

`PAGE_VIEW`의 `PEACE_INTRO_PAGE` 아래:

```ts
  PEACE_QUIZ_PAGE: 'PeaceQuizPage',
```

- [ ] **Step 4: 스타일 작성**

`frontend/src/pages/PeacePage/PeaceQuizPage.styles.ts`:

```ts
import styled from 'styled-components';
import { setTypography } from '@/styles/theme/typography';

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const BackButton = styled.button`
  border: none;
  background: transparent;
  padding: 8px 12px;
  ${({ theme }) => setTypography(theme.typography.paragraph.p2)};
  color: ${({ theme }) => theme.colors.gray[600]};
  cursor: pointer;
`;

export const Progress = styled.span`
  ${({ theme }) => setTypography(theme.typography.paragraph.p2)};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

export const ProgressBar = styled.div<{ $ratio: number }>`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: ${({ theme }) => theme.colors.gray[200]};
  margin-bottom: 32px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    width: ${({ $ratio }) => $ratio * 100}%;
    height: 100%;
    background: ${({ theme }) => theme.colors.primary[900]};
    transition: width ${({ theme }) => theme.transitions.duration.normal};
  }
`;

export const Question = styled.h2`
  ${({ theme }) => setTypography(theme.typography.title.title3)};
  color: ${({ theme }) => theme.colors.base.black};
  margin-bottom: 32px;
  word-break: keep-all;
`;

export const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const OptionButton = styled.button`
  width: 100%;
  min-height: 64px;
  padding: 16px 20px;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.base.white};
  ${({ theme }) => setTypography(theme.typography.paragraph.p1)};
  color: ${({ theme }) => theme.colors.base.black};
  text-align: left;
  word-break: keep-all;
  cursor: pointer;

  &:active {
    background: ${({ theme }) => theme.colors.primary[500]};
    border-color: ${({ theme }) => theme.colors.primary[900]};
  }
`;
```

- [ ] **Step 5: 컴포넌트 작성**

`frontend/src/pages/PeacePage/PeaceQuizPage.tsx`:

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PAGE_VIEW, USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import PeaceLayout from './components/PeaceLayout/PeaceLayout';
import { PEACE_QUESTIONS } from './data/questions';
import { calculatePeaceType } from './utils/calculatePeaceType';
import * as Styled from './PeaceQuizPage.styles';

const TOTAL = PEACE_QUESTIONS.length;

const PeaceQuizPage = () => {
  useTrackPageView(PAGE_VIEW.PEACE_QUIZ_PAGE);
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();
  // answers.length가 곧 현재 문항 인덱스다. 별도 인덱스 상태를 두지 않는다.
  const [answers, setAnswers] = useState<number[]>([]);

  const questionIndex = answers.length;
  const question = PEACE_QUESTIONS[questionIndex];

  // 렌더 시점 answers로 next를 만든다. 리렌더 전 중복 탭은 같은 배열을 두 번 set할 뿐이라
  // 한 문항만 진행된다. 함수형 업데이터(prev => [...prev, i])를 쓰면 두 번 진행되므로 쓰지 않는다.
  const handleSelect = (optionIndex: number) => {
    const next = [...answers, optionIndex];
    setAnswers(next);
    if (next.length === TOTAL) {
      const type = calculatePeaceType(next);
      trackEvent(USER_EVENT.PEACE_QUIZ_COMPLETED, { type });
      navigate(`/peace/result?type=${type}`, { replace: true });
    }
  };

  const handleBack = () => {
    if (answers.length === 0) {
      navigate('/peace');
      return;
    }
    setAnswers((prev) => prev.slice(0, -1));
  };

  if (!question) return null;

  return (
    <PeaceLayout>
      <Styled.TopRow>
        <Styled.BackButton type='button' onClick={handleBack}>
          이전
        </Styled.BackButton>
        <Styled.Progress>{`${questionIndex + 1} / ${TOTAL}`}</Styled.Progress>
      </Styled.TopRow>
      <Styled.ProgressBar $ratio={questionIndex / TOTAL} />
      <Styled.Question>{question.text}</Styled.Question>
      <Styled.OptionList>
        {question.options.map((option, i) => (
          <Styled.OptionButton
            key={option.label}
            type='button'
            onClick={() => handleSelect(i)}
          >
            {option.label}
          </Styled.OptionButton>
        ))}
      </Styled.OptionList>
    </PeaceLayout>
  );
};

export default PeaceQuizPage;
```

마지막 문항에서 중복 탭이 배치되면 `PEACE_QUIZ_COMPLETED`가 두 번 찍힐 수 있다. URL은 `replace`라 같다. 분석 시 같은 세션의 1초 내 중복은 하나로 본다.

- [ ] **Step 6: 라우트 등록**

`AppRoutes.tsx` import에 (`PeaceIntroPage` 아래):

```ts
import PeaceQuizPage from '@/pages/PeacePage/PeaceQuizPage';
```

`/peace` 라우트 객체 아래에:

```tsx
    {
      path: '/peace/quiz',
      element: (
        <ContentErrorBoundary>
          <PeaceQuizPage />
        </ContentErrorBoundary>
      ),
    },
```

- [ ] **Step 7: 통과 확인**

Run: `cd frontend && npx jest src/pages/PeacePage/PeaceQuizPage.test.tsx && npm run typecheck`
Expected: PASS (5 tests). 기대 유형 `carer`는 Task 1 데이터에서 각 문항 첫 선택지 유형이 `energizer, daily, carer, carer, carer, carer, embracer, carer`라 carer 5점으로 단독 최고점이다. 데이터 문구 순서를 바꿨다면 기대값을 다시 계산한다.

- [ ] **Step 8: 커밋**

```bash
cd frontend && npx prettier --write src/pages/PeacePage src/routes/AppRoutes.tsx src/constants/eventName.ts
git add frontend/src/pages/PeacePage frontend/src/routes/AppRoutes.tsx frontend/src/constants/eventName.ts
git commit -m "feat(peace): 8문항을 한 화면씩 진행하는 퀴즈 페이지를 추가한다"
```

---

### Task 6: 결과 카드 컴포넌트와 이미지 프리로드

**Files:**
- Create: `frontend/src/pages/PeacePage/components/ResultCard/cardImages.ts`
- Create: `frontend/src/pages/PeacePage/components/ResultCard/ResultCard.tsx`
- Create: `frontend/src/pages/PeacePage/components/ResultCard/ResultCard.styles.ts`
- Create: `frontend/src/pages/PeacePage/components/ResultCard/ResultCard.stories.tsx`
- Modify: `frontend/src/pages/PeacePage/PeaceIntroPage.tsx` (프리로드 추가)
- Test: `frontend/src/pages/PeacePage/components/ResultCard/ResultCard.test.tsx`

**Interfaces:**
- Consumes: `PeaceType`, `PeaceTypeId`, `PEACE_TYPES` (Task 1), framer-motion `motion`
- Produces:
  - `CARD_IMAGES: Partial<Record<PeaceTypeId, string>>` — 이미지 URL. 없으면 단색 카드
  - `ResultCard({ type }: { type: PeaceType })` — 유형명·캐치프레이즈·이미지(또는 단색)를 3D 뒤집기와 기울기 연출로 그린다

- [ ] **Step 1: 테스트 작성**

`frontend/src/pages/PeacePage/components/ResultCard/ResultCard.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { PEACE_TYPES } from '../../data/peaceTypes';
import ResultCard from './ResultCard';

jest.mock('./cardImages', () => ({
  CARD_IMAGES: { carer: 'carer.webp' },
}));

const renderCard = (id: 'carer' | 'daily') =>
  render(
    <ThemeProvider theme={theme}>
      <ResultCard type={PEACE_TYPES[id]} />
    </ThemeProvider>,
  );

describe('ResultCard', () => {
  it('유형명과 캐치프레이즈를 그린다', () => {
    renderCard('carer');
    expect(screen.getByText('돌봄가')).toBeInTheDocument();
    expect(screen.getByText('이웃을 돌보고 나누는 평화 메이커')).toBeInTheDocument();
  });

  it('이미지가 있으면 img를 그린다', () => {
    renderCard('carer');
    expect(screen.getByRole('img', { name: '돌봄가 카드' })).toHaveAttribute('src', 'carer.webp');
  });

  it('이미지가 없으면 img 없이 단색 카드를 그린다', () => {
    renderCard('daily');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('일상가')).toBeInTheDocument();
  });
});
```

framer-motion이 jsdom에서 `matchMedia`를 요구하면 테스트 상단에 다음을 추가한다:

```ts
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
});
```

- [ ] **Step 2: 실패 확인**

Run: `cd frontend && npx jest src/pages/PeacePage/components/ResultCard`
Expected: FAIL, `Cannot find module './ResultCard'`

- [ ] **Step 3: cardImages.ts 작성**

`frontend/src/pages/PeacePage/components/ResultCard/cardImages.ts`:

```ts
import { PeaceTypeId } from '../../data/peaceTypes';

/**
 * Blender 렌더 카드 이미지. 유형이 빠져 있으면 ResultCard가 분과 단색 카드로 그린다.
 * 이미지가 오면 `frontend/src/assets/images/peace/<id>.webp`에 두고 아래에 한 줄 추가한다.
 *   import carer from '@/assets/images/peace/carer.webp';
 *   export const CARD_IMAGES = { carer, ... };
 * 이 파일이 data/peaceTypes.ts와 분리된 이유: jest transform이 .webp를 stub하지 않아
 * 데이터 모듈에 이미지를 두면 채점 테스트가 깨진다.
 */
export const CARD_IMAGES: Partial<Record<PeaceTypeId, string>> = {};
```

- [ ] **Step 4: 스타일 작성**

`frontend/src/pages/PeacePage/components/ResultCard/ResultCard.styles.ts`:

```ts
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { setTypography } from '@/styles/theme/typography';

export const Perspective = styled.div`
  perspective: 1200px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

/** 등장 시 한 번 뒤집히는 바깥 껍질 */
export const Flip = styled(motion.div)`
  width: min(100%, 360px);
  transform-style: preserve-3d;
`;

/** 포인터에 따라 기울어지는 카드 본체 */
export const Card = styled(motion.div)<{ $bg: string }>`
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 24px;
  background: ${({ $bg }) => $bg};
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 24px;
  overflow: hidden;
  transform-style: preserve-3d;
  will-change: transform;
  position: relative;
  touch-action: none;
`;

export const Image = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const TextBlock = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  color: ${({ theme }) => theme.colors.base.white};
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
`;

export const Name = styled.h1`
  ${({ theme }) => setTypography(theme.typography.title.title1)};
`;

export const Catchphrase = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p1)};
  word-break: keep-all;
`;
```

- [ ] **Step 5: 컴포넌트 작성**

`frontend/src/pages/PeacePage/components/ResultCard/ResultCard.tsx`:

```tsx
import { PointerEvent, useState } from 'react';
import { useTheme } from 'styled-components';
import { PeaceType } from '../../data/peaceTypes';
import { CARD_IMAGES } from './cardImages';
import * as Styled from './ResultCard.styles';

const MAX_TILT_DEG = 10;

interface ResultCardProps {
  type: PeaceType;
}

const ResultCard = ({ type }: ResultCardProps) => {
  const theme = useTheme();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const image = CARD_IMAGES[type.id];
  const bg = theme.colors.secondary[type.colorIndex].main;

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -py * MAX_TILT_DEG * 2, y: px * MAX_TILT_DEG * 2 });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  return (
    <Styled.Perspective>
      <Styled.Flip
        initial={{ rotateY: 180, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <Styled.Card
          $bg={bg}
          animate={{ rotateX: tilt.x, rotateY: tilt.y }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetTilt}
          onPointerUp={resetTilt}
        >
          {image && <Styled.Image src={image} alt={`${type.name} 카드`} />}
          <Styled.TextBlock>
            <Styled.Name>{type.name}</Styled.Name>
            <Styled.Catchphrase>{type.catchphrase}</Styled.Catchphrase>
          </Styled.TextBlock>
        </Styled.Card>
      </Styled.Flip>
    </Styled.Perspective>
  );
};

export default ResultCard;
```

뒤집기(바깥)와 기울기(안쪽)를 두 요소로 나눈 이유: 한 요소의 `animate`에 두 값을 함께 두면 등장용 0.8초 전환이 기울기에도 걸려 포인터 반응이 늦어진다.

- [ ] **Step 6: 스토리 작성**

`frontend/src/pages/PeacePage/components/ResultCard/ResultCard.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { PEACE_TYPE_IDS, PEACE_TYPES } from '../../data/peaceTypes';
import ResultCard from './ResultCard';

const meta = {
  title: 'Pages/PeacePage/Components/ResultCard',
  component: ResultCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'UN 평화축제 결과 카드. cardImages.ts에 이미지가 없는 유형은 분과 단색으로 그린다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ResultCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Carer: Story = { args: { type: PEACE_TYPES.carer } };
export const Embracer: Story = { args: { type: PEACE_TYPES.embracer } };
export const Daily: Story = { args: { type: PEACE_TYPES.daily } };
export const Explorer: Story = { args: { type: PEACE_TYPES.explorer } };
export const Energizer: Story = { args: { type: PEACE_TYPES.energizer } };
export const Expresser: Story = { args: { type: PEACE_TYPES.expresser } };

export const AllTypes: Story = {
  args: { type: PEACE_TYPES.carer },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 240px)', gap: 16 }}>
      {PEACE_TYPE_IDS.map((id) => (
        <ResultCard key={id} type={PEACE_TYPES[id]} />
      ))}
    </div>
  ),
};
```

`.storybook/preview.tsx`가 `ThemeProvider`를 전역으로 감싸므로 스토리에서 따로 감싸지 않는다.

- [ ] **Step 7: 랜딩 페이지에 프리로드 추가**

`frontend/src/pages/PeacePage/PeaceIntroPage.tsx`에 import 추가:

```ts
import { useEffect } from 'react';
import { CARD_IMAGES } from './components/ResultCard/cardImages';
```

컴포넌트 본문 `useTrackPageView` 아래에:

```tsx
  // 결과 화면이 네트워크 없이도 뜨도록 카드 이미지를 미리 받아 둔다.
  useEffect(() => {
    Object.values(CARD_IMAGES).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);
```

- [ ] **Step 8: 통과 확인**

Run: `cd frontend && npx jest src/pages/PeacePage && npm run typecheck`
Expected: PASS (ResultCard 3 tests 포함, 기존 테스트 유지), typecheck 오류 0

- [ ] **Step 9: 커밋**

```bash
cd frontend && npx prettier --write src/pages/PeacePage
git add frontend/src/pages/PeacePage
git commit -m "feat(peace): 3D 연출이 들어간 결과 카드와 이미지 프리로드를 추가한다"
```

---

### Task 7: 결과 페이지와 `/peace/result` 라우트

**Files:**
- Create: `frontend/src/pages/PeacePage/PeaceResultPage.tsx`
- Create: `frontend/src/pages/PeacePage/PeaceResultPage.styles.ts`
- Modify: `frontend/src/constants/eventName.ts`
- Modify: `frontend/src/routes/AppRoutes.tsx`
- Test: `frontend/src/pages/PeacePage/PeaceResultPage.test.tsx`

**Interfaces:**
- Consumes: `PEACE_TYPES`, `isPeaceTypeId` (Task 1), `PeaceLayout` (Task 3), `ResultCard` (Task 6)
- Produces:
  - `PAGE_VIEW.PEACE_RESULT_PAGE = 'PeaceResultPage'`
  - `USER_EVENT.PEACE_CLUB_TAG_CLICKED = 'Peace Club Tag Clicked'` props `{ type, clubName }`
  - `USER_EVENT.PEACE_RETRY_CLICKED = 'Peace Retry Clicked'` props `{ type }`
  - 라우트 `/peace/result`

- [ ] **Step 1: 테스트 작성**

`frontend/src/pages/PeacePage/PeaceResultPage.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { ReactNode } from 'react';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { PEACE_TYPES } from './data/peaceTypes';
import PeaceResultPage from './PeaceResultPage';

jest.mock('mixpanel-browser', () => ({ track: jest.fn() }));
jest.mock('./components/PeaceLayout/PeaceLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PEACE_PAGE_TITLE: '나와 맞는 평화 활동 찾기',
}));
jest.mock('./components/ResultCard/ResultCard', () => ({
  __esModule: true,
  default: ({ type }: { type: { name: string } }) => <div>CARD {type.name}</div>,
}));

const ClubProbe = () => {
  const { clubName } = useParams();
  return <div>CLUB {clubName}</div>;
};

const renderResult = (search: string) =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[`/peace/result${search}`]}>
        <Routes>
          <Route path='/peace' element={<div>INTRO</div>} />
          <Route path='/peace/result' element={<PeaceResultPage />} />
          <Route path='/clubDetail/@:clubName' element={<ClubProbe />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );

describe('PeaceResultPage', () => {
  const originalClubs = PEACE_TYPES.carer.recommendedClubs;

  afterEach(() => {
    PEACE_TYPES.carer.recommendedClubs = originalClubs;
  });

  it('유효한 type이면 카드·설명·작은 행동을 그린다', () => {
    renderResult('?type=carer');
    expect(screen.getByText('CARD 돌봄가')).toBeInTheDocument();
    expect(screen.getByText(PEACE_TYPES.carer.description)).toBeInTheDocument();
    expect(screen.getByText(PEACE_TYPES.carer.smallAction)).toBeInTheDocument();
  });

  it('type이 없거나 정의되지 않으면 /peace로 돌려보낸다', () => {
    renderResult('');
    expect(screen.getByText('INTRO')).toBeInTheDocument();
  });

  it('정의되지 않은 type도 /peace로 돌려보낸다', () => {
    renderResult('?type=abc');
    expect(screen.getByText('INTRO')).toBeInTheDocument();
  });

  it('추천 동아리가 비어 있으면 태그 영역을 그리지 않는다', () => {
    PEACE_TYPES.carer.recommendedClubs = [];
    renderResult('?type=carer');
    expect(screen.queryByText('추천 동아리')).not.toBeInTheDocument();
  });

  it('추천 동아리 태그를 누르면 동아리 상세로 이동한다', async () => {
    PEACE_TYPES.carer.recommendedClubs = ['테스트 동아리'];
    renderResult('?type=carer');
    expect(screen.getByText('추천 동아리')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '테스트 동아리' }));
    expect(screen.getByText('CLUB 테스트 동아리')).toBeInTheDocument();
  });

  it('다시하기를 누르면 /peace로 간다', async () => {
    renderResult('?type=carer');
    await userEvent.click(screen.getByRole('button', { name: '다시하기' }));
    expect(screen.getByText('INTRO')).toBeInTheDocument();
  });
});
```

`PEACE_TYPES.carer.recommendedClubs`를 테스트에서 직접 바꾸는 것은 `PEACE_TYPES`가 `as const`가 아닌 일반 객체라 가능하다. 테스트 후 원복한다.

- [ ] **Step 2: 실패 확인**

Run: `cd frontend && npx jest src/pages/PeacePage/PeaceResultPage.test.tsx`
Expected: FAIL, `Cannot find module './PeaceResultPage'`

- [ ] **Step 3: 이벤트 상수 추가**

`USER_EVENT`의 `PEACE_QUIZ_COMPLETED` 아래:

```ts
  PEACE_CLUB_TAG_CLICKED: 'Peace Club Tag Clicked',
  PEACE_RETRY_CLICKED: 'Peace Retry Clicked',
```

`PAGE_VIEW`의 `PEACE_QUIZ_PAGE` 아래:

```ts
  PEACE_RESULT_PAGE: 'PeaceResultPage',
```

- [ ] **Step 4: 스타일 작성**

`frontend/src/pages/PeacePage/PeaceResultPage.styles.ts`:

```ts
import styled from 'styled-components';
import { setTypography } from '@/styles/theme/typography';

export const CardSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px 0 40px;
`;

export const Lead = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p1)};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

export const Detail = styled.section<{ $back: string }>`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px 24px;
  border-radius: 24px;
  background: ${({ $back }) => $back};
`;

export const SectionTitle = styled.h2`
  ${({ theme }) => setTypography(theme.typography.title.title5)};
  color: ${({ theme }) => theme.colors.base.black};
  margin-bottom: 8px;
`;

export const Body = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p1)};
  color: ${({ theme }) => theme.colors.gray[800]};
  word-break: keep-all;
`;

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const Tag = styled.button<{ $main: string }>`
  min-height: 48px;
  padding: 10px 18px;
  border: 1.5px solid ${({ $main }) => $main};
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.base.white};
  ${({ theme }) => setTypography(theme.typography.paragraph.p2)};
  color: ${({ theme }) => theme.colors.base.black};
  cursor: pointer;

  &:active {
    background: ${({ $main }) => $main};
    color: ${({ theme }) => theme.colors.base.white};
  }
`;

export const RetryButton = styled.button`
  width: 100%;
  min-height: 64px;
  margin-top: 32px;
  border: none;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.base.black};
  color: ${({ theme }) => theme.colors.base.white};
  ${({ theme }) => setTypography(theme.typography.title.title5)};
  cursor: pointer;
`;
```

- [ ] **Step 5: 컴포넌트 작성**

`frontend/src/pages/PeacePage/PeaceResultPage.tsx`:

```tsx
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { PAGE_VIEW, USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import PeaceLayout from './components/PeaceLayout/PeaceLayout';
import ResultCard from './components/ResultCard/ResultCard';
import { isPeaceTypeId, PEACE_TYPES } from './data/peaceTypes';
import * as Styled from './PeaceResultPage.styles';

const PeaceResultPage = () => {
  useTrackPageView(PAGE_VIEW.PEACE_RESULT_PAGE);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();
  const theme = useTheme();

  const typeParam = searchParams.get('type');
  if (!isPeaceTypeId(typeParam)) {
    return <Navigate to='/peace' replace />;
  }

  const type = PEACE_TYPES[typeParam];
  const palette = theme.colors.secondary[type.colorIndex];

  const handleClubClick = (clubName: string) => {
    trackEvent(USER_EVENT.PEACE_CLUB_TAG_CLICKED, { type: type.id, clubName });
    navigate(`/clubDetail/@${encodeURIComponent(clubName)}`);
  };

  const handleRetry = () => {
    trackEvent(USER_EVENT.PEACE_RETRY_CLICKED, { type: type.id });
    navigate('/peace', { replace: true });
  };

  return (
    <PeaceLayout>
      <Styled.CardSection>
        <Styled.Lead>당신의 평화 유형은</Styled.Lead>
        <ResultCard type={type} />
      </Styled.CardSection>

      <Styled.Detail $back={palette.back}>
        <div>
          <Styled.SectionTitle>{`${type.name}는 이런 사람`}</Styled.SectionTitle>
          <Styled.Body>{type.description}</Styled.Body>
        </div>
        <div>
          <Styled.SectionTitle>오늘의 작은 평화 행동</Styled.SectionTitle>
          <Styled.Body>{type.smallAction}</Styled.Body>
        </div>
        {type.recommendedClubs.length > 0 && (
          <div>
            <Styled.SectionTitle>추천 동아리</Styled.SectionTitle>
            <Styled.TagList>
              {type.recommendedClubs.map((name) => (
                <Styled.Tag
                  key={name}
                  type='button'
                  $main={palette.main}
                  onClick={() => handleClubClick(name)}
                >
                  {name}
                </Styled.Tag>
              ))}
            </Styled.TagList>
          </div>
        )}
      </Styled.Detail>

      <Styled.RetryButton type='button' onClick={handleRetry}>
        다시하기
      </Styled.RetryButton>
    </PeaceLayout>
  );
};

export default PeaceResultPage;
```

훅(`useTrackPageView`, `useSearchParams`, `useNavigate`, `useMixpanelTrack`, `useTheme`)은 모두 early return 위에 있어야 한다. 위 코드는 그 순서를 지킨다.

- [ ] **Step 6: 라우트 등록**

`AppRoutes.tsx` import에 (`PeaceQuizPage` 아래):

```ts
import PeaceResultPage from '@/pages/PeacePage/PeaceResultPage';
```

`/peace/quiz` 라우트 객체 아래에:

```tsx
    {
      path: '/peace/result',
      element: (
        <ContentErrorBoundary>
          <PeaceResultPage />
        </ContentErrorBoundary>
      ),
    },
```

- [ ] **Step 7: 통과 확인**

Run: `cd frontend && npx jest src/pages/PeacePage && npm run typecheck && npm run audit:tracking`
Expected: PASS (전체 PeacePage 테스트), typecheck 0, audit:tracking에서 `PEACE_*` 미사용 경고 없음

- [ ] **Step 8: 커밋**

```bash
cd frontend && npx prettier --write src/pages/PeacePage src/routes/AppRoutes.tsx src/constants/eventName.ts
git add frontend/src/pages/PeacePage frontend/src/routes/AppRoutes.tsx frontend/src/constants/eventName.ts
git commit -m "feat(peace): 유형 카드와 추천 동아리 태그를 보여주는 결과 페이지를 추가한다"
```

---

### Task 8: 전체 검증과 수동 시나리오

**Files:**
- 변경 없음(검증만). 문제가 나오면 해당 Task의 파일을 고친다.

**Interfaces:**
- Consumes: Task 1~7 전부
- Produces: 검증 결과 기록

- [ ] **Step 1: 자동 검사 일괄 실행**

Run:
```bash
cd frontend && npm run typecheck && npm run lint && npx jest && npm run audit:tracking
```
Expected: 모두 0 오류. `lint`는 `eslint --fix`라 파일이 바뀔 수 있다. 바뀐 파일이 있으면 `git diff`로 확인 후 커밋에 포함한다.

- [ ] **Step 2: Storybook 빌드**

Run: `cd frontend && npm run build-storybook`
Expected: 빌드 성공. `ResultCard` 스토리 7개(6개 유형 + AllTypes)가 포함된다. 실패하면 `.storybook/preview.tsx`의 ThemeProvider 유무를 확인한다.

- [ ] **Step 3: 개발 서버로 수동 시나리오**

Run: `cd frontend && npm run dev` (백그라운드)

브라우저에서 순서대로 확인하고 결과를 기록한다:

1. `http://localhost:5173/peace` → 제목·시작하기 버튼. 데스크톱 폭에서 Header, 500px 이하에서 WebviewTopBar.
2. 시작하기 → `/peace/quiz`, `1 / 8` 표시.
3. 1번 문항에서 "이전" → `/peace`.
4. 8문항 답변 → URL이 `/peace/result?type=…`로 바뀌고 카드가 뒤집히며 등장.
5. 카드 위에서 마우스/터치 이동 → 기울기 반응.
6. 브라우저 뒤로 가기 → `/peace`(퀴즈 중간이 아님).
7. `/peace/result?type=abc` 직접 입력 → `/peace`.
8. `/peace/result?type=carer` 직접 입력 → 돌봄가 결과.
9. 결과에서 "다시하기" → `/peace`.
10. DevTools 폭 1024·768·390에서 선택지 버튼 텍스트가 잘리지 않는지.
11. DevTools Network를 Offline으로 두고 `/peace`부터 결과까지 → 에러 없이 진행(이미지가 없어 단색 카드).
12. 터치 기기(또는 DevTools 터치 에뮬레이션)에서 선택지를 빠르게 두 번 탭 → 한 문항만 넘어가고 진행 표시가 한 칸만 증가.

- [ ] **Step 4: 검증 결과 기록**

`docs/superpowers/plans/2026-09-28-peace-festival-quiz.md` 하단에 다음 형식으로 결과를 남긴다:

```
## 검증 기록 (YYYY-MM-DD)
- typecheck / lint / jest / audit:tracking: 통과 여부
- build-storybook: 통과 여부
- 수동 시나리오 1~12: 각 통과 여부, 실패 시 재현 방법
```

- [ ] **Step 5: 커밋**

```bash
git add docs/superpowers/plans/2026-09-28-peace-festival-quiz.md
git commit -m "docs(peace): 평화축제 퀴즈 검증 기록을 남긴다"
```

---

## 계획 밖 후속 작업 (코드 아님)

- 홈 배너 등록: 백엔드 운영 페이지에서 `linkTo: '/peace'` 배너를 `WEB`, `WEB_MOBILE`(필요 시 `APP_HOME`)에 등록. 행사 종료 후 삭제.
- 추천 동아리 이름 확정 후 `data/peaceTypes.ts`의 `recommendedClubs` 채우기.
- Blender 카드 이미지 6장 수령 후 `assets/images/peace/`에 두고 `cardImages.ts`에 import 추가.
- 김수현 님과 담당 확인(66차 회의록 주간 할 일에 "평화 축제 관련 테스트" 있음).
- 이슈·Jira 생성 후 `feature/#번호-peace-quiz-MOA-키` 브랜치로 PR.

## 검증 기록 (2026-09-28)
- typecheck / lint(eslint, 변경 파일) / jest(73 suites, 599 tests) / audit:tracking(USER_EVENT 61, PAGE_VIEW 32, 미사용 없음): 모두 통과
- build-storybook: 통과, `pages-peacepage-components-resultcard--*` 스토리 포함
- 수동 시나리오(Playwright, dev 서버 5199):
  1. `/peace` 1024px: Header + 본문 + Footer, 헤더와 겹침 없음 — 통과. 390px: WebviewTopBar — 통과
  2. 시작하기 → `/peace/quiz`, `1 / 8` — 통과
  3. 1번 문항 "이전" → `/peace` — 통과
  4. 8답 → `/peace/result?type=carer`, 카드 등장 — 통과
  5. 카드 hover 시 transform 변화, 벗어나면 `none`으로 복원 — 통과
  6. 결과에서 브라우저 뒤로 → `/peace` — 통과
  7. `?type=abc` → `/peace` — 통과
  8. `?type=expresser`, `?type=daily` 직접 진입 → 해당 결과 — 통과
  9. 다시하기 → `/peace` — 통과
  10. 390px 선택지 4개 scrollWidth ≤ clientWidth(넘침 없음), 높이 62px — 통과. 768px는 1024px와 같은 분기(isLaptop)라 별도 확인 생략
  11. 오프라인: 도구로 네트워크 차단을 못 해 미검증. 코드상 `/peace`, `/peace/quiz`, `/peace/result`는 fetch 호출이 없다(Header·Footer는 기존 컴포넌트)
  12. 1번 문항 첫 선택지를 동기적으로 두 번 click() → `2 / 8`(한 문항만 진행) — 통과
- 콘솔: 기존 Header의 `isScrolled` prop DOM 전달 경고 1건(이번 변경과 무관, 기존 코드)
