// "✳️ 페이지 최종"에서 버튼 라벨과 글자가 같은 TEXT 노드를 찾아 감싸는 프레임을 후보로 낸다.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { api } from '../figma-story-diff/figma.mjs';

export const FILE_KEY = process.env.FIGMA_FILE_KEY ?? 'LB4VudDhuIGjFayrm1kge1';
export const PAGE_NAME = '✳️ 페이지 최종';
const CACHE = path.resolve(
  import.meta.dirname,
  '../../node_modules/.cache/button-migration/page.json',
);

const BOXY = new Set(['FRAME', 'INSTANCE', 'COMPONENT']);
const painted = (n) =>
  (n.fills ?? []).some((f) => f.visible !== false && f.type === 'SOLID') ||
  (n.strokes ?? []).length > 0 ||
  n.cornerRadius > 0;

export const nodeUrl = (id) =>
  `https://www.figma.com/design/${FILE_KEY}/moadong?node-id=${id.replace(':', '-')}`;

export function findCandidates(page, label) {
  const out = [];
  const walk = (node, ancestors) => {
    if (node.type === 'TEXT' && node.characters?.trim() === label) {
      // 인스턴스 내부 노드(I로 시작)는 링크로 못 연다. 바깥의 칠해진 프레임을 잡는다.
      const box = [...ancestors]
        .reverse()
        .find((a) => BOXY.has(a.type) && !a.id.startsWith('I') && painted(a));
      if (box)
        out.push({
          nodeId: box.id,
          name: box.name,
          screen: ancestors
            .slice(1, 3)
            .map((a) => a.name)
            .join(' / '),
          url: nodeUrl(box.id),
        });
    }
    for (const c of node.children ?? []) walk(c, [...ancestors, node]);
  };
  walk(page, []);
  return out;
}

// 페이지 전체 트리는 크다. 한 번 받아 캐시하고, 시안이 바뀌면 --refresh로 다시 받는다.
export async function loadPage({ refresh = false } = {}) {
  if (!refresh && existsSync(CACHE))
    return JSON.parse(readFileSync(CACHE, 'utf8'));
  const file = await api(`/files/${FILE_KEY}?depth=1`);
  const page = file.document.children.find((p) => p.name === PAGE_NAME);
  if (!page) throw new Error(`Figma 페이지 "${PAGE_NAME}"가 없다`);
  const body = await api(
    `/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(page.id)}`,
  );
  const doc = body.nodes[page.id].document;
  await mkdir(path.dirname(CACHE), { recursive: true });
  writeFileSync(CACHE, JSON.stringify(doc));
  return doc;
}
