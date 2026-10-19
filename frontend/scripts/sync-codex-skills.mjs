#!/usr/bin/env node
// .claude/commands·.claude/agents 원본에서 .codex/skills/<name>/SKILL.md를 생성한다.
// 사람이 고치는 파일은 .claude/ 쪽 하나다. .codex/는 항상 이 스크립트의 출력과 같아야 한다.
//
//   node scripts/sync-codex-skills.mjs          # .codex/skills를 다시 생성한다
//   node scripts/sync-codex-skills.mjs --check  # 생성 결과와 다르면 목록을 찍고 exit 1
//
// Codex 전용 메타(이름·설명·제목·원본 목록)는 원본에서 끌어낼 수 없어 아래 MANIFEST에 둔다.
// 새 커맨드·에이전트를 Codex에도 노출하려면 MANIFEST에 항목을 더한다.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const FRONTEND_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(FRONTEND_ROOT, '.codex', 'skills');

const MANIFEST = {
  'api-hooks': {
    title: '모아동 API 훅',
    description:
      '모아동 프론트엔드에서 React Query API 훅을 생성하거나 수정할 때 사용한다. src/hooks/Queries, src/apis, 쿼리 키, 캐시 무효화, mutation 성공 처리, API 훅 일관성 작업에 사용한다.',
    sources: ['.claude/agents/API훅부서.md'],
  },
  'check-tracking': {
    title: '모아동 이벤트 트래킹 감사',
    description:
      '모아동 프론트엔드의 Mixpanel 이벤트 트래킹을 감사할 때 사용한다. 트래킹 점검, 누락된 trackEvent 탐지, USER_EVENT 정의와 사용처 비교, 이벤트 계측 확인 요청에 사용한다.',
    sources: ['.claude/commands/check-tracking.md'],
  },
  commit: {
    title: '모아동 커밋',
    description:
      '모아동 세션 dailyNote를 작성하고 필요하면 기능 문서를 갱신한 뒤 현재 변경사항을 커밋할 때 사용한다. /commit 흐름이나 세션 기록과 git commit을 함께 요청할 때 사용한다.',
    sources: ['.claude/commands/commit.md'],
  },
  'common-components': {
    title: '모아동 공통 컴포넌트',
    description:
      '모아동 프론트엔드의 재사용 가능한 공통 UI 컴포넌트를 생성, 수정, 리팩터링할 때 사용한다. src/components/common, 공통 컴포넌트 API, styled-components, 접근성, 컴포넌트 재사용 패턴 작업에 사용한다.',
    sources: ['.claude/agents/공통컴포넌트부서.md'],
  },
  'cross-review': {
    title: '모아동 크로스 리뷰',
    description:
      '다른 AI가 작성한 코드를 리뷰하기 위해 모아동 cross-review 스크립트를 실행할 때 사용한다. /cross-review, 크로스 에이전트 리뷰, Claude 작성 코드 리뷰, Codex 작성 코드 리뷰 요청에 사용한다.',
    sources: ['.claude/commands/cross-review.md'],
  },
  'jira-story': {
    title: '모아동 Jira 스토리',
    description:
      '모아동 Jira 스토리를 대화형으로 생성하고 선택적으로 연결된 GitHub 이슈와 브랜치를 만들 때 사용한다. /jira-story 또는 기능 요청에서 Jira 스토리 생성을 요청할 때 사용한다.',
    sources: ['.claude/commands/jira-story.md'],
  },
  'jira-task': {
    title: '모아동 Jira 태스크',
    description:
      '기존 모아동 Jira 스토리 키를 기반으로 GitHub 이슈, Jira 하위 작업, 브랜치를 생성할 때 사용한다. /jira-task 또는 Jira 스토리에서 구현 태스크 생성을 요청할 때 사용한다.',
    sources: ['.claude/commands/jira-task.md'],
  },
  'mixpanel-ab': {
    title: '모아동 Mixpanel A/B 분석',
    description:
      '모아동 A/B 테스트 결과를 분석하고 통계적 오류를 피할 때 사용한다. Mixpanel 실험, variant, 유의성, 신뢰구간, MDE, 실험 분석 요청에 사용한다.',
    sources: ['.claude/commands/mixpanel-ab.md'],
  },
  mixpanel: {
    title: '모아동 Mixpanel 분석',
    description:
      '모아동 Mixpanel 데이터를 분석하고 마크다운 리포트를 작성할 때 사용한다. 사용자 행동 분석, 퍼널, 리텐션, 이벤트 리포트, 인사이트, 주간 리포트 요청에 사용한다.',
    sources: ['.claude/commands/mixpanel.md'],
  },
  prd: {
    title: '모아동 PRD',
    description:
      '모아동 기능 요구사항을 대화형으로 수집하고 하위 작업으로 분해한 뒤 Jira 스토리와 GitHub 이슈를 일괄 생성할 때 사용한다. /prd 또는 기능 기획을 Jira/GitHub 태스크로 나누는 요청에 사용한다.',
    sources: ['.claude/commands/prd.md'],
  },
  rn: {
    title: '모아동 React Native',
    description:
      '모아동 React Native + Expo 프로젝트와 프론트엔드 WebView 연동을 작업할 때 사용한다. RN, React Native, Expo, WebView 브릿지, 딥링크, 푸시 알림, 앱 라우팅, /RN 요청에 사용한다.',
    sources: ['.claude/commands/RN.md', '.claude/agents/RN에이전트.md'],
  },
  test: {
    title: '모아동 테스트 작성',
    description:
      '모아동 프론트엔드의 Jest, React Testing Library, Playwright 테스트를 작성할 때 사용한다. 테스트 추가, 특정 파일/기능 테스트, /test 흐름 요청에 사용한다.',
    sources: ['.claude/commands/test.md'],
  },
};

const CODEX_RULES = `## Codex 적용 규칙

- Claude slash command의 인자 참조는 사용자의 현재 요청으로 해석한다.
- Claude 전용 \`allowed-tools\` 메타데이터는 무시하고, 현재 Codex 세션에서 제공되는 도구를 사용한다.
- 원본이 Claude 서브에이전트 호출을 지시하면, Codex에서 명시적인 서브에이전트 도구가 있고 적절한 경우를 제외하고 해당 에이전트 지침을 직접 따라 작업한다.
- 모든 작업은 저장소의 \`AGENTS.md\` 지침을 우선해서 따른다.`;

// Claude 커맨드 frontmatter(description, allowed-tools)를 떼고 본문만 남긴다.
export function stripFrontmatter(text) {
  if (!text.startsWith('---\n')) return text;
  const end = text.indexOf('\n---\n', 4);
  if (end === -1) return text;
  return text.slice(end + '\n---\n'.length).replace(/^\n+/, '');
}

// $ARGUMENTS는 Claude slash command 전용 치환자라 Codex에는 뜻이 없다.
// `${ARGUMENTS:-x}`나 `${ARGUMENTS}`를 셸에 그대로 두면 Codex에는 그 변수가 없어 빈 값이나 기본값으로 돈다.
export function replaceArguments(text) {
  return text.replace(/\$\{ARGUMENTS(?::-([^}]*))?\}|\$ARGUMENTS/g, (_, fallback) =>
    fallback === undefined ? '사용자의 현재 요청' : `<사용자의 현재 요청, 비어 있으면 ${fallback}>`,
  );
}

// autocrlf가 켜진 체크아웃에서 CRLF로 바뀌어도 frontmatter 경계와 비교가 어긋나지 않게 LF로 맞춘다.
function readLf(path) {
  return readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
}

function sourceBody(relPath) {
  return replaceArguments(stripFrontmatter(readLf(join(FRONTEND_ROOT, relPath))));
}

function render(name, { title, description, sources }) {
  const sections = sources.map((src) => `## Source: \`${src}\`\n\n${sourceBody(src)}`);
  return [
    '---',
    `name: "${name}"`,
    `description: "${description}"`,
    '---',
    '',
    `# ${title}`,
    '',
    CODEX_RULES,
    '',
    sections.join('\n---\n\n'),
  ].join('\n');
}

export function generate() {
  return Object.fromEntries(Object.entries(MANIFEST).map(([name, entry]) => [name, render(name, entry)]));
}

export function check(generated, outDir = OUT_DIR) {
  const problems = [];
  // 파일(.DS_Store 등)은 건너뛰고 디렉터리만 스킬로 본다.
  const existing = existsSync(outDir)
    ? readdirSync(outDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
    : [];
  for (const name of existing) {
    if (!(name in generated)) problems.push(`.codex/skills/${name}: MANIFEST에 없는 스킬`);
  }
  for (const [name, content] of Object.entries(generated)) {
    const file = join(outDir, name, 'SKILL.md');
    if (!existsSync(file)) {
      problems.push(`.codex/skills/${name}/SKILL.md: 없음`);
    } else if (readLf(file) !== content) {
      problems.push(`.codex/skills/${name}/SKILL.md: 원본과 다름`);
    }
  }
  return problems;
}

export function write(generated, outDir = OUT_DIR) {
  for (const [name, content] of Object.entries(generated)) {
    mkdirSync(join(outDir, name), { recursive: true });
    writeFileSync(join(outDir, name, 'SKILL.md'), content);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const generated = generate();
  if (process.argv.includes('--check')) {
    const problems = check(generated);
    if (problems.length > 0) {
      console.error('Codex 스킬이 .claude 원본과 어긋났다. `npm run codex:sync`를 실행해 커밋한다.');
      for (const p of problems) console.error(`  - ${p}`);
      process.exit(1);
    }
    console.log(`Codex 스킬 ${Object.keys(generated).length}개가 원본과 같다.`);
  } else {
    write(generated);
    console.log(`Codex 스킬 ${Object.keys(generated).length}개를 생성했다.`);
  }
}
