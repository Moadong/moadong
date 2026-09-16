// Figma REST API로 노드 속성과 PNG를 가져오고, 사용된 색/타이포 토큰을 뽑는다.
import { typoKey } from './theme.mjs';

const TOKEN = process.env.FIGMA_TOKEN ?? process.env.FIGMA_OAUTH_TOKEN;
const API = 'https://api.figma.com/v1';

export function parseFigmaUrl(url) {
  const u = new URL(url);
  const key = u.pathname.match(/\/(?:design|file)\/([A-Za-z0-9]+)/)?.[1];
  const nodeId = u.searchParams.get('node-id')?.replace('-', ':');
  if (!key || !nodeId)
    throw new Error(`Figma URL에서 file key/node-id를 못 읽음: ${url}`);
  return { key, nodeId };
}

async function api(pathname) {
  if (!TOKEN) throw new Error('FIGMA_TOKEN(개인 액세스 토큰)이 없다');
  const res = await fetch(`${API}${pathname}`, {
    headers: { 'X-Figma-Token': TOKEN },
  });
  const body = await res.json();
  if (!res.ok || body.err)
    throw new Error(`Figma API ${res.status}: ${body.err ?? pathname}`);
  return body;
}

const toHex = ({ r, g, b }) =>
  '#' +
  [r, g, b]
    .map((c) =>
      Math.round(c * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')
    .toUpperCase();

export function extractTokens(
  node,
  acc = { colors: new Map(), typography: new Map(), translucent: new Map() },
  inheritedOpacity = 1,
) {
  if (node.visible === false) return acc;
  // 노드 opacity는 자식까지 곱해져 내려간다. paint opacity만 보면 반투명을 불투명 토큰으로 잘못 센다.
  const nodeOpacity = inheritedOpacity * (node.opacity ?? 1);
  for (const paint of [...(node.fills ?? []), ...(node.strokes ?? [])]) {
    if (paint.type !== 'SOLID' || paint.visible === false) continue;
    const opacity = nodeOpacity * (paint.opacity ?? 1);
    // 반투명 fill은 다른 fill 위에 겹쳐 색을 바꾸는 용도라 토큰이 아니다. 따로 모아 리포트에만 보인다.
    if (opacity < 1) {
      acc.translucent.set(
        `${toHex(paint.color)}@${Math.round(opacity * 100)}%`,
        node.name,
      );
    } else {
      acc.colors.set(toHex(paint.color), node.name);
    }
  }
  if (node.type === 'TEXT' && node.style) {
    const { fontSize, fontWeight, lineHeightPercentFontSize, lineHeightUnit } =
      node.style;
    const lineHeight =
      lineHeightUnit === 'INTRINSIC_%' || lineHeightPercentFontSize == null
        ? null
        : `${lineHeightPercentFontSize}%`;
    acc.typography.set(
      typoKey({ size: fontSize, weight: fontWeight, lineHeight }),
      node.name,
    );
  }
  for (const child of node.children ?? [])
    extractTokens(child, acc, nodeOpacity);
  return acc;
}

export async function fetchFigma(url, scale = 2) {
  const { key, nodeId } = parseFigmaUrl(url);
  const [nodes, images] = await Promise.all([
    api(`/files/${key}/nodes?ids=${encodeURIComponent(nodeId)}`),
    api(
      `/images/${key}?ids=${encodeURIComponent(nodeId)}&format=png&scale=${scale}`,
    ),
  ]);
  const doc = nodes.nodes[nodeId]?.document;
  if (!doc) throw new Error(`노드 ${nodeId}를 파일 ${key}에서 못 찾음`);
  const imageUrl = images.images[nodeId];
  if (!imageUrl) throw new Error(`노드 ${nodeId} 이미지 렌더 실패`);
  const png = Buffer.from(await (await fetch(imageUrl)).arrayBuffer());
  const box = doc.absoluteBoundingBox;
  return {
    name: doc.name,
    bbox: { width: box.width, height: box.height },
    png,
    // itemSpacing은 SPACE_BETWEEN이면 실제 간격과 무관한 값이 남는다. 자식 위치에서 직접 잰다.
    layout: {
      mode: doc.layoutMode ?? 'NONE',
      children: (doc.children ?? [])
        .filter((c) => c.visible !== false && c.absoluteBoundingBox)
        .map((c) => ({
          name: c.name,
          x: c.absoluteBoundingBox.x - box.x,
          y: c.absoluteBoundingBox.y - box.y,
          width: c.absoluteBoundingBox.width,
          height: c.absoluteBoundingBox.height,
        })),
    },
    ...extractTokens(doc),
  };
}
