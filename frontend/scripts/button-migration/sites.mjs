// 자리 대장(sites.json): 버튼이 쓰이는 자리 하나가 레코드 하나. 모든 단계가 여기에 상태를 쌓는다.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export const SITES_FILE = path.join(import.meta.dirname, 'sites.json');

export const STATUSES = [
  'inventoried',
  'figma-match',
  'figma-violation',
  'no-design',
  'migrated',
  'verified',
  'deferred',
];

// styled.button이 사라져도 대장에서 지우면 안 되는 상태 (이전이 끝난 자리)
const DONE = new Set(['migrated', 'verified']);
// 사람이 채우거나 뒤 단계가 쓴 값. 인벤토리를 다시 돌려도 보존한다.
const CARRIED = ['route', 'locator', 'figma', 'figmaViewport', 'status'];

export function domainOf(file) {
  const p = file.split('/');
  if (p[1] === 'pages') {
    if (p[2] !== 'AdminPage' || p.length <= 4) return p[2];
    return p[3] === 'tabs' && p.length > 5
      ? `AdminPage/tabs/${p[4]}`
      : `AdminPage/${p[3]}`;
  }
  if (p[1] === 'components')
    return p[2] === 'common' ? `common/${p[3]}` : `components/${p[2]}`;
  return p.slice(1, -1).join('/') || p[0];
}

const byId = (a, b) => a.id.localeCompare(b.id);

export function buildSites(definitions, usages) {
  const defs = new Map(definitions.map((d) => [`${d.file}::${d.name}`, d]));
  const seen = new Map();
  const sites = [];
  for (const u of usages) {
    const def = defs.get(`${u.defFile}::${u.name}`);
    if (!def) continue;
    const base = `${u.defFile}::${u.name}::${u.usageFile}`;
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    sites.push({
      id: `${base}::${n}`,
      defFile: u.defFile,
      name: u.name,
      kind: def.kind,
      usageFile: u.usageFile,
      line: u.line,
      domain: domainOf(u.usageFile),
      signatureKey: def.key,
      signature: def.base,
      nested: def.nested,
      dynamic: def.dynamic,
      typeAttr: u.typeAttr,
      label: u.label,
      route: null,
      locator: u.label ? { role: 'button', name: u.label } : null,
      figma: null,
      figmaViewport: null,
      status: 'inventoried',
    });
  }
  return sites.sort(byId);
}

// 이전이 끝난 기록이 살아 있는 사용처와 id가 겹칠 때 붙이는 꼬리표
export const MIGRATED_SUFFIX = '#migrated';

// id의 끝 순번(::n)은 같은 파일 안의 몇 번째 사용처인지일 뿐이라, 사용처가 끼어들거나 옮겨 가면
// 다른 버튼을 가리킨다. 그래서 이어 받기는 라벨이 같을 때만 하고, 이전 끝난 판정은 살아 있는
// 사용처에 절대 물려주지 않는다 — 살아 있는 styled 정의의 사용처는 정의상 아직 안 옮긴 자리다.
export function mergeSites(prev, next) {
  const old = new Map(prev.map((s) => [s.id, s]));
  const displaced = [];
  const merged = next.map((s) => {
    const o = old.get(s.id);
    if (!o) return s;
    if (DONE.has(o.status)) {
      displaced.push(o);
      return s;
    }
    if (o.label !== s.label) return s;
    const carried = Object.fromEntries(
      CARRIED.filter((k) => o[k] != null).map((k) => [k, o[k]]),
    );
    // 스타일이 바뀌었으면 예전 시안 판정은 더 이상 이 버튼에 대한 것이 아니다
    if (o.signatureKey !== s.signatureKey) delete carried.status;
    return { ...s, ...carried };
  });
  const ids = new Set(next.map((s) => s.id));
  const gone = prev.filter((s) => !ids.has(s.id) && DONE.has(s.status));
  const taken = new Set([...ids, ...gone.map((s) => s.id)]);
  const kept = displaced.map((o) => {
    let id = `${o.id}${MIGRATED_SUFFIX}`;
    for (let n = 2; taken.has(id); n++) id = `${o.id}${MIGRATED_SUFFIX}-${n}`;
    taken.add(id);
    return { ...o, id };
  });
  return [...merged, ...gone, ...kept].sort(byId);
}

export function clusters(sites) {
  const map = new Map();
  for (const s of sites) {
    if (DONE.has(s.status)) continue;
    const c = map.get(s.signatureKey) ?? {
      key: s.signatureKey,
      signature: s.signature,
      nested: s.nested,
      dynamic: s.dynamic,
      sites: [],
      domains: new Set(),
    };
    c.sites.push(s);
    c.domains.add(s.domain);
    map.set(s.signatureKey, c);
  }
  return [...map.values()]
    .map((c) => ({
      ...c,
      domains: [...c.domains].sort(),
      candidate: c.domains.size >= 2 && c.dynamic.length === 0,
    }))
    .sort(
      (a, b) => b.sites.length - a.sites.length || a.key.localeCompare(b.key),
    );
}

export function summarize(sites, { commonButton, overrides }) {
  const cs = clusters(sites);
  const candidates = cs.filter((c) => c.candidate);
  return {
    sites: sites.length,
    byStatus: Object.fromEntries(
      STATUSES.map((st) => [st, sites.filter((s) => s.status === st).length]),
    ),
    signatures: cs.length,
    candidateClusters: candidates.length,
    candidateSites: candidates.reduce((n, c) => n + c.sites.length, 0),
    commonButton,
    overrides,
  };
}

// --ids로 고른 자리. 대장에 없는 id(오타)를 조용히 빼면 일부만 잰 결과가 전부 잰 것처럼 보인다.
export function pickByIds(sites, ids) {
  const byIdMap = new Map(sites.map((s) => [s.id, s]));
  return {
    picked: ids.filter((id) => byIdMap.has(id)).map((id) => byIdMap.get(id)),
    unknown: ids.filter((id) => !byIdMap.has(id)),
  };
}

// 기준 커밋과 달라진 파일에 있는데 migrated가 아닌 자리. 이전해 놓고 상태를 안 바꾸면
// 대장 모드는 그 자리를 아예 안 잰다.
export const staleSites = (sites, changedFiles) =>
  sites.filter(
    (s) =>
      s.status !== 'migrated' &&
      (changedFiles.has(s.defFile) || changedFiles.has(s.usageFile)),
  );

// PASS한 migrated 자리만 verified로 올린다. 점검용으로 돌린 다른 상태는 건드리지 않는다.
// src가 기준과 같으면 같은 코드끼리 비교한 것이라 이전 검증이 아니다.
export function promoteVerified(sites, results, { srcChanged }) {
  if (!srcChanged) return sites;
  const passed = new Map(
    results.filter((r) => r.pass).map((r) => [r.site.id, r.writtenOff]),
  );
  return sites.map((s) =>
    passed.has(s.id) && s.status === 'migrated'
      ? // write-off가 있는 PASS는 근거가 약하다. 대장에서도 보이게 남긴다
        { ...s, status: 'verified', writtenOff: passed.get(s.id) }
      : s,
  );
}

// 시안 대조 대상. 이전이 끝난 자리는 --ids로 골라도 판정을 덮어쓰지 않는다.
export function figmaTargets(sites, ids) {
  const ready = (s) => s.figma && s.route && s.locator;
  if (!ids)
    return {
      targets: sites.filter(
        (s) =>
          ready(s) && ['inventoried', 'figma-violation'].includes(s.status),
      ),
      unknown: [],
      incomplete: [],
      skippedDone: [],
    };
  const { picked, unknown } = pickByIds(sites, ids);
  const skippedDone = picked.filter((s) => DONE.has(s.status));
  const rest = picked.filter((s) => !DONE.has(s.status));
  return {
    targets: rest.filter(ready),
    unknown,
    incomplete: rest.filter((s) => !ready(s)),
    skippedDone,
  };
}

export const loadSites = (file) =>
  existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : [];

export const saveSites = (file, sites) =>
  writeFileSync(file, `${JSON.stringify(sites, null, 2)}\n`);
