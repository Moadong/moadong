/**
 * 미사용 이벤트 감사 (CI 게이트)
 *
 * `src/constants/eventName.ts`의 USER_EVENT / PAGE_VIEW 키 중, 코드 어디에서도
 * `그룹명.KEY` 로 참조되지 않는 "죽은 이벤트"를 찾는다.
 * 하나라도 있으면 비정상 종료(exit 1)하여 CI를 실패시킨다.
 *
 * `/check-tracking` 커맨드의 Step 4(정의만 되고 미사용)를 결정론적으로 자동화한 것.
 * Step 1~3(인터랙션 누락 의심)은 사람/LLM 판단이 필요하므로 제외한다.
 * ADMIN_EVENT 는 현재 미사용 키 정리(누락 트래킹 추가 여부 판단)가 필요해 제외한다.
 *
 * 한계: 코드가 그룹을 구조분해(`const { X } = USER_EVENT`)하면 검출하지 못한다.
 * 현재 코드베이스는 `그룹명.KEY` 멤버 접근만 사용한다.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const DEF_FILE = join(SRC, 'constants', 'eventName.ts');

const GROUPS = ['USER_EVENT', 'PAGE_VIEW'];

/**
 * `<group> = { ... } as const;` 블록에서 키 목록을 추출한다.
 * 따옴표 종류·공백·세미콜론 유무에 유연하게 대응하고, 파싱이 깨져 키를
 * 0개로 읽으면(= 게이트가 조용히 통과해버리는 상황) 명시적으로 실패한다.
 */
function extractKeys(source, group) {
  const startMatch = source.match(new RegExp(`${group}\\s*=\\s*\\{`));
  if (!startMatch) throw new Error(`eventName.ts 에서 ${group} 정의를 찾지 못했습니다.`);
  const start = startMatch.index;
  const endMatch = source.slice(start).match(/\}\s*as\s+const\s*;?/);
  if (!endMatch) throw new Error(`${group} 블록의 끝(\`} as const;\`)을 찾지 못했습니다.`);
  const block = source.slice(start, start + endMatch.index);

  const keys = new Map(); // key -> event name(value)
  const re = /^\s*([A-Z][A-Z0-9_]*)\s*:\s*(['"])(.*?)\2/gm;
  let m;
  while ((m = re.exec(block)) !== null) keys.set(m[1], m[3]);
  if (keys.size === 0) {
    throw new Error(`${group} 키를 하나도 파싱하지 못했습니다. 파서/포맷을 확인하세요.`);
  }
  return keys;
}

/** src 아래 .ts/.tsx 를 모두 읽어 하나의 문자열로 합친다(정의 파일 제외). */
function collectSource(dir) {
  let buf = '';
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const st = statSync(path);
    if (st.isDirectory()) {
      buf += collectSource(path);
    } else if (/\.tsx?$/.test(name) && path !== DEF_FILE) {
      buf += readFileSync(path, 'utf8') + '\n';
    }
  }
  return buf;
}

const source = readFileSync(DEF_FILE, 'utf8');
const corpus = collectSource(SRC);

const unused = []; // [group, key, eventName]
const summary = [];
for (const group of GROUPS) {
  const keys = extractKeys(source, group);
  for (const [key, eventName] of keys) {
    if (!new RegExp(`${group}\\.${key}\\b`).test(corpus)) unused.push([group, key, eventName]);
  }
  summary.push(`${group} ${keys.size}`);
}

if (unused.length === 0) {
  console.log(`✓ 미사용 이벤트 없음 (${summary.join(', ')})`);
  process.exit(0);
}

console.error(`✗ 정의만 되고 미사용인 이벤트 ${unused.length}개 발견:\n`);
for (const [group, key, eventName] of unused) {
  console.error(`  - ${group}.${key}  ('${eventName}')`);
}
console.error(
  '\n해당 이벤트에 trackEvent 를 연결하거나, 더 이상 쓰지 않으면 eventName.ts 에서 제거하세요.',
);
process.exit(1);
