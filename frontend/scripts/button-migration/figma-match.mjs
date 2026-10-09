// 단계 ②: figma·route·locator가 채워진 자리를 시안 노드와 대조해 figma-match / figma-violation을 기록한다.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { fetchFigma } from '../figma-story-diff/figma.mjs';
import { collectElement } from '../figma-story-diff/story.mjs';
import { loadTheme } from '../figma-story-diff/theme.mjs';
import { FRONTEND, openPages, startVite } from './app.mjs';
import { figmaGate } from './figma-gate.mjs';
import {
  FREEZE_CSS,
  launchBrowser,
  resolveTarget,
  waitForQuiet,
} from './measure.mjs';
import { figmaTargets, loadSites, saveSites, SITES_FILE } from './sites.mjs';

const PORT = 3102;
const DEFAULT_VIEWPORT = 1440;
const OUT = path.join(FRONTEND, 'visual-diff/button-figma');
const { values: args } = parseArgs({ options: { ids: { type: 'string' } } });

const sites = loadSites(SITES_FILE);
const { targets, unknown, incomplete, skippedDone } = figmaTargets(
  sites,
  args.ids ? args.ids.split(',') : null,
);
if (unknown.length || incomplete.length) {
  if (unknown.length) console.error(`대장에 없는 id:\n${unknown.join('\n')}`);
  if (incomplete.length)
    console.error(
      `figma·route·locator가 비어 있는 자리:\n${incomplete.map((s) => s.id).join('\n')}`,
    );
  process.exit(2);
}
// 이전이 끝난 자리의 상태를 시안 판정으로 되돌리면 이전 기록이 사라진다
for (const s of skippedDone)
  console.log(
    `SKIP  ${s.id}  status가 ${s.status}라 시안 판정을 덮어쓰지 않는다`,
  );
if (!targets.length) {
  console.error('대상 없음: figma·route·locator가 모두 채워진 자리가 없다');
  process.exit(2);
}

const lines = (items) => items.map((x) => `- ${x}`).join('\n') || '없음';

const theme = await loadTheme();
const server = await startVite(FRONTEND, PORT);
// launchBrowser가 던져도 server.stop()은 반드시 돌아야 포트가 안 묶인다 (before-after.mjs와 같은 패턴).
let browser;
const results = [];
try {
  browser = await launchBrowser();
  const pageFor = await openPages(browser, server.url, targets, {
    deviceScaleFactor: 2,
  });
  for (const site of targets) {
    try {
      const figma = await fetchFigma(site.figma);
      const page = pageFor(site.route);
      await page.setViewportSize({
        width: site.figmaViewport ?? DEFAULT_VIEWPORT,
        height: 900,
      });
      // Vite HMR WebSocket이 계속 열려 있어 networkidle은 dev 서버에서 절대 안 끝난다(measure.mjs와 같은 이유).
      // load로 멈추고, load 뒤에도 이어지는 fetch는 waitForQuiet으로 따로 기다린다.
      const quiet = waitForQuiet(page);
      await page.goto(new URL(site.route, server.url).href, {
        waitUntil: 'load',
      });
      const { writtenOff } = await quiet;
      await page.addStyleTag({ content: FREEZE_CSS });
      const target = await resolveTarget(page, site.locator);
      if (!target) throw new Error('요소가 안 보인다');
      const impl = await collectElement(target);
      const gate = figmaGate({ figma, impl, theme });
      const dir = path.join(OUT, site.id.replace(/[^\w.-]+/g, '_'));
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, 'figma.png'), figma.png);
      await writeFile(path.join(dir, 'impl.png'), impl.png);
      await writeFile(
        path.join(dir, 'report.md'),
        `# ${site.id} — ${gate.pass ? 'figma-match' : 'figma-violation'}

- 시안: [${figma.name}](${site.figma}) · 폭 ${site.figmaViewport ?? DEFAULT_VIEWPORT}
- 경로: \`${site.route}\` · locator: \`${JSON.stringify(site.locator)}\`
- 루트 크기: 시안 ${figma.bbox.width}×${figma.bbox.height} · 구현 ${impl.bbox.width}×${impl.bbox.height} (Δ ${gate.dw.toFixed(2)}, ${gate.dh.toFixed(2)}) — ${gate.sizePass ? 'PASS' : 'FAIL'}
- 요청 포기: ${writtenOff.length ? writtenOff.join(', ') : '없음'}

## 토큰 일치 (판정)

${lines(gate.parityIssues)}

## theme에 없는 값 (보고만, 이전 전에 theme에 추가)

${lines(gate.tokenIssues)}

![figma](figma.png) ![impl](impl.png)
`,
      );
      results.push({
        site,
        status: gate.pass ? 'figma-match' : 'figma-violation',
        note: `${path.relative(FRONTEND, dir)}/report.md`,
      });
    } catch (e) {
      results.push({ site, status: null, note: e.message });
    }
  }
} finally {
  if (browser) await browser.close();
  await server.stop();
}

const statusById = new Map(
  results.filter((r) => r.status).map((r) => [r.site.id, r.status]),
);
saveSites(
  SITES_FILE,
  sites.map((s) =>
    statusById.has(s.id) ? { ...s, status: statusById.get(s.id) } : s,
  ),
);
for (const r of results)
  console.log(`${r.status ?? 'ERROR'}  ${r.site.id}  ${r.note}`);
process.exit(results.every((r) => r.status) ? 0 : 1);
