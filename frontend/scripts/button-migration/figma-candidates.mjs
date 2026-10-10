// 단계 ② 보조: 후보 묶음의 자리마다 시안 노드 후보를 찾아 목록을 낸다. 확정은 사람이 sites.json의 figma에 적는다.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { findCandidates, loadPage } from './figma-search.mjs';
import { clusters, loadSites, pickByIds, SITES_FILE } from './sites.mjs';

const OUT = path.resolve(import.meta.dirname, '../../visual-diff/button-figma');
const { values: args } = parseArgs({
  options: {
    ids: { type: 'string' },
    refresh: { type: 'boolean', default: false },
  },
});

const sites = loadSites(SITES_FILE);
const candidateKeys = new Set(
  clusters(sites)
    .filter((c) => c.candidate)
    .map((c) => c.key),
);
let targets;
if (args.ids) {
  const { picked, unknown } = pickByIds(sites, args.ids.split(','));
  if (unknown.length) {
    console.error(`대장에 없는 id:\n${unknown.join('\n')}`);
    process.exit(2);
  }
  targets = picked;
} else {
  targets = sites.filter((s) => candidateKeys.has(s.signatureKey) && !s.figma);
}

const page = await loadPage({ refresh: args.refresh });
const lines = ['# 시안 노드 후보', ''];
for (const s of targets) {
  const found = s.label ? findCandidates(page, s.label) : [];
  lines.push(`## ${s.id}`, '');
  if (!s.label) lines.push('- 라벨이 동적이라 직접 찾아야 한다');
  else if (!found.length) lines.push(`- "${s.label}" 글자를 가진 노드가 없다`);
  else lines.push(...found.map((c) => `- ${c.screen} › ${c.name} — ${c.url}`));
  lines.push('');
}
await mkdir(OUT, { recursive: true });
await writeFile(path.join(OUT, 'candidates.md'), lines.join('\n'));
console.log(
  `자리 ${targets.length}개 → visual-diff/button-figma/candidates.md`,
);
