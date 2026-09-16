// 사용: node scripts/figma-story-diff/run.mjs [이름필터]
// src/**/*.figma.json 매핑을 읽어 Figma 캡처 → 스토리 캡처 → 픽셀 diff → 토큰/크기 판정 → visual-diff/ 리포트.
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { diffPng } from './diff.mjs';
import { fetchFigma } from './figma.mjs';
import { captureStory } from './story.mjs';
import { loadPending, loadTheme, PENDING_DIR } from './theme.mjs';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUT = path.join(ROOT, 'visual-diff');
const SIZE_TOLERANCE_PX = 2;
const filter = process.argv[2] ?? '';

async function loadMappings() {
  const files = (await readdir(path.join(ROOT, 'src'), { recursive: true }))
    .filter((f) => f.endsWith('.figma.json'))
    .map((f) => path.join(ROOT, 'src', f));
  const entries = [];
  for (const file of files) {
    const json = JSON.parse(await readFile(file, 'utf8'));
    for (const [name, spec] of Object.entries(json)) {
      if (name.includes(filter))
        entries.push({ name, file: path.relative(ROOT, file), ...spec });
    }
  }
  return entries;
}

const only = (a, b) => [...a].filter(([k]) => !b.has(k));
const missing = (used, known) => [...used].filter(([k]) => !known.has(k));
const table = (rows, head) =>
  rows.length
    ? [
        `| ${head[0]} | ${head[1]} |`,
        '|---|---|',
        ...rows.map(([k, v]) => `| \`${k}\` | ${v} |`),
      ].join('\n')
    : '없음';

function writePendingTs(pending) {
  const block = (rows) => (rows.length ? `{\n${rows.join('\n')}\n  }` : '{}');
  // Figma 노드 이름이 그대로 들어온다. 따옴표 하나에 생성 파일이 깨지면 다음 실행의 loadPending()이 죽는다.
  const str = (v) => JSON.stringify(String(v));
  const colors = block(
    Object.entries(pending.colors).map(
      ([hex, from]) => `    ${str(hex)}: ${str(from)},`,
    ),
  );
  const typography = block(
    Object.entries(pending.typography).map(
      ([key, t]) =>
        `    ${str(key)}: { size: ${str(t.size)}, weight: ${t.weight}, lineHeight: ${str(t.lineHeight)}, from: ${str(t.from)} },`,
    ),
  );
  return `// figma-story-diff(scripts/figma-story-diff)가 생성·갱신한다. 손으로 고치지 말 것.
// Figma 시안에는 있지만 theme/에 없는 토큰의 보류 목록. 디자이너 컨펌 후 theme/으로 옮기고 여기서 지운다.
export const pending = {
  colors: ${colors},
  typography: ${typography},
} as const;
`;
}

async function runEntry(entry, theme, pending) {
  const figma = await fetchFigma(entry.figma);
  const viewport = {
    width: Math.ceil(figma.bbox.width),
    height: Math.ceil(figma.bbox.height),
  };
  const story = await captureStory({
    story: entry.story,
    args: entry.args,
    viewport,
  });
  const diff = diffPng(figma.png, story.png);

  const dir = path.join(OUT, entry.name.replace(/[\/\s]/g, '_'));
  await mkdir(dir, { recursive: true });

  await Promise.all([
    writeFile(path.join(dir, 'figma.png'), figma.png),
    writeFile(path.join(dir, 'story.png'), story.png),
    writeFile(path.join(dir, 'diff.png'), diff.png),
  ]);

  const figmaMissingColors = missing(figma.colors, theme.colors);
  const figmaMissingTypo = missing(figma.typography, theme.typography);
  const storyMissingColors = missing(story.colors, theme.colors);
  const storyMissingTypo = missing(story.typography, theme.typography);
  for (const [hex, node] of figmaMissingColors)
    pending.colors[hex] ??= `${entry.name} · ${node}`;
  for (const [key, node] of figmaMissingTypo) {
    const [size, weight, lh] = key.split('/');
    pending.typography[key] ??= {
      size: `${size}px`,
      weight: Number(weight),
      lineHeight: `${lh}%`,
      from: `${entry.name} · ${node}`,
    };
  }

  // 반올림하면 2.49px가 2로 접혀 통과한다. 판정은 실제 차이로 하고 표시할 때만 자른다.
  const dw = story.bbox.width - figma.bbox.width;
  const dh = story.bbox.height - figma.bbox.height;
  const sizePass =
    Math.abs(dw) <= SIZE_TOLERANCE_PX && Math.abs(dh) <= SIZE_TOLERANCE_PX;
  const tokenPass =
    figmaMissingColors.length +
      figmaMissingTypo.length +
      storyMissingColors.length +
      storyMissingTypo.length ===
    0;
  const onlyFigmaColors = only(figma.colors, story.colors);
  const onlyStoryColors = only(story.colors, figma.colors);
  const onlyFigmaTypo = only(figma.typography, story.typography);
  const onlyStoryTypo = only(story.typography, figma.typography);
  const parityPass =
    onlyFigmaColors.length +
      onlyStoryColors.length +
      onlyFigmaTypo.length +
      onlyStoryTypo.length ===
    0;
  const pass = sizePass && tokenPass && parityPass;

  const label = (ok) => (ok ? 'PASS' : 'FAIL');
  const report = `# ${entry.name} — ${label(pass)}

- Figma: [${figma.name}](${entry.figma})
- Story: ${story.url}
- 매핑: \`${entry.file}\`

## 판정

| 항목 | 결과 | 값 |
|---|---|---|
| 토큰 (theme에 없는 값) | ${label(tokenPass)} | Figma ${figmaMissingColors.length + figmaMissingTypo.length}건 · 구현 ${storyMissingColors.length + storyMissingTypo.length}건 |
| 토큰 일치 (Figma↔구현 사용 집합) | ${label(parityPass)} | Figma에만 ${onlyFigmaColors.length + onlyFigmaTypo.length}건 · 구현에만 ${onlyStoryColors.length + onlyStoryTypo.length}건 |
| 루트 크기 (±${SIZE_TOLERANCE_PX}px) | ${label(sizePass)} | Figma ${figma.bbox.width}×${figma.bbox.height} · 구현 ${story.bbox.width}×${story.bbox.height} (Δ ${dw.toFixed(2)}, ${dh.toFixed(2)}) |
| 픽셀 차이 (참고용) | – | ${diff.mismatchPercent.toFixed(2)}% · 이미지 ${diff.sizes.figma.join('×')} vs ${diff.sizes.story.join('×')} |

![figma](figma.png) ![story](story.png) ![diff](diff.png)

## Figma 시안에 있고 theme에 없는 토큰 → \`src/styles/theme.test/index.ts\`에 기록

${table(figmaMissingColors, ['색', 'Figma 노드'])}

${table(figmaMissingTypo, ['타이포 size/weight/lineHeight%', 'Figma 노드'])}

## 구현에 있고 theme에 없는 값

${table(storyMissingColors, ['색', 'DOM 요소'])}

${table(storyMissingTypo, ['타이포 size/weight/lineHeight%', 'DOM 요소'])}

## Figma 반투명 겹침 fill (토큰 판정 제외, 시안 정리 대상)

${table([...figma.translucent], ['색@불투명도', 'Figma 노드'])}

## Figma에만 쓰인 토큰 / 구현에만 쓰인 토큰

${table(onlyFigmaColors, ['Figma에만: 색', '노드'])}
${table(onlyStoryColors, ['구현에만: 색', 'DOM 요소'])}
${table(onlyFigmaTypo, ['Figma에만: 타이포', '노드'])}
${table(onlyStoryTypo, ['구현에만: 타이포', 'DOM 요소'])}
`;
  await writeFile(path.join(dir, 'report.md'), report);
  return { name: entry.name, pass, dir: path.relative(ROOT, dir) };
}

const entries = await loadMappings();
if (!entries.length) {
  console.error(
    `매핑 없음: src/**/*.figma.json${filter ? ` (필터 "${filter}")` : ''}`,
  );
  process.exit(2);
}
const theme = await loadTheme();
const pending = await loadPending();
const results = [];
for (const entry of entries) {
  try {
    results.push(await runEntry(entry, theme, pending));
  } catch (e) {
    results.push({ name: entry.name, pass: false, error: e.message });
  }
}
await mkdir(PENDING_DIR, { recursive: true });
await writeFile(path.join(PENDING_DIR, 'index.ts'), writePendingTs(pending));

for (const r of results)
  console.log(
    `${r.pass ? 'PASS' : 'FAIL'}  ${r.name}  ${r.error ?? r.dir + '/report.md'}`,
  );
console.log(
  `보류 토큰: 색 ${Object.keys(pending.colors).length}개, 타이포 ${Object.keys(pending.typography).length}개 → src/styles/theme.test/index.ts`,
);
process.exit(results.every((r) => r.pass) ? 0 : 1);
