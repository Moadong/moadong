import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  buildSites,
  clusters,
  domainOf,
  figmaTargets,
  mergeSites,
  pickByIds,
  promoteVerified,
  staleSites,
} from './sites.mjs';

test('도메인은 페이지 단위, AdminPage만 탭 단위', () => {
  const cases = {
    'src/pages/ClubDetailPage/components/X/X.tsx': 'ClubDetailPage',
    'src/pages/AdminPage/tabs/RecruitEditTab/RecruitEditTab.tsx':
      'AdminPage/tabs/RecruitEditTab',
    'src/pages/AdminPage/auth/LoginTab/LoginTab.tsx': 'AdminPage/auth',
    'src/pages/AdminPage/AdminPage.tsx': 'AdminPage',
    'src/components/common/Modal/Modal.tsx': 'common/Modal',
    'src/components/map/X/X.tsx': 'components/map',
  };
  for (const [file, domain] of Object.entries(cases))
    assert.equal(domainOf(file), domain, file);
});

const def = (name, key, extra = {}) => ({
  file: 'src/pages/A/A.styles.ts',
  name,
  kind: 'styled.button',
  line: 1,
  base: { height: '40px' },
  nested: {},
  dynamic: [],
  key,
  overridesAppearance: false,
  ...extra,
});
const use = (name, usageFile, label = '확인') => ({
  defFile: 'src/pages/A/A.styles.ts',
  name,
  usageFile,
  line: 3,
  typeAttr: null,
  label,
});

test('사용처마다 자리를 만들고 정의 없는 사용처는 버린다', () => {
  const sites = buildSites(
    [def('Ok', 'k1')],
    [
      use('Ok', 'src/pages/A/A.tsx'),
      use('Ok', 'src/pages/A/A.tsx', null),
      use('Container', 'src/pages/A/A.tsx'),
    ],
  );
  assert.deepEqual(
    sites.map((s) => [s.id, s.locator]),
    [
      [
        'src/pages/A/A.styles.ts::Ok::src/pages/A/A.tsx::0',
        { role: 'button', name: '확인' },
      ],
      ['src/pages/A/A.styles.ts::Ok::src/pages/A/A.tsx::1', null],
    ],
  );
  assert.equal(sites[0].status, 'inventoried');
});

test('다시 돌려도 사람이 채운 값과 판정을 보존한다', () => {
  const [fresh] = buildSites(
    [def('Ok', 'k1')],
    [use('Ok', 'src/pages/A/A.tsx')],
  );
  const prev = [
    { ...fresh, route: '/a', figma: 'https://f', status: 'figma-match' },
  ];
  const [merged] = mergeSites(prev, [fresh]);
  assert.equal(merged.route, '/a');
  assert.equal(merged.figma, 'https://f');
  assert.equal(merged.status, 'figma-match');
});

test('시그니처가 바뀌면 판정을 되돌린다', () => {
  const [old] = buildSites([def('Ok', 'k1')], [use('Ok', 'src/pages/A/A.tsx')]);
  const [changed] = buildSites(
    [def('Ok', 'k2')],
    [use('Ok', 'src/pages/A/A.tsx')],
  );
  const [merged] = mergeSites(
    [{ ...old, route: '/a', status: 'figma-match' }],
    [changed],
  );
  assert.equal(merged.route, '/a');
  assert.equal(merged.status, 'inventoried');
});

test('이전이 끝나 사라진 자리는 남기고, 그냥 사라진 자리는 지운다', () => {
  const [a, b] = buildSites(
    [def('A', 'k1'), def('B', 'k1')],
    [use('A', 'src/pages/A/A.tsx'), use('B', 'src/pages/A/A.tsx')],
  );
  const merged = mergeSites([{ ...a, status: 'verified' }, b], []);
  assert.deepEqual(
    merged.map((s) => s.name),
    ['A'],
  );
});

// 순번 id는 사용처가 끼어들거나 빠지면 다른 버튼을 가리킨다. 라벨이 다르면 다른 버튼으로 본다.
test('라벨이 바뀌면 locator·route·figma·판정을 이어 받지 않는다', () => {
  const [old] = buildSites(
    [def('Ok', 'k1')],
    [use('Ok', 'src/pages/A/A.tsx', '확인')],
  );
  const [changed] = buildSites(
    [def('Ok', 'k1')],
    [use('Ok', 'src/pages/A/A.tsx', '확인하기')],
  );
  const [merged] = mergeSites(
    [
      {
        ...old,
        route: '/a',
        figma: 'https://f',
        figmaViewport: 375,
        status: 'figma-match',
      },
    ],
    [changed],
  );
  assert.deepEqual(merged.locator, { role: 'button', name: '확인하기' });
  assert.equal(merged.route, null);
  assert.equal(merged.figma, null);
  assert.equal(merged.figmaViewport, null);
  assert.equal(merged.status, 'inventoried');
});

test('앞에 사용처가 끼어들어 순번이 밀려도 시안·경로가 다른 버튼으로 옮겨 가지 않는다', () => {
  const [old] = buildSites(
    [def('Ok', 'k1')],
    [use('Ok', 'src/pages/A/A.tsx', '확인')],
  );
  const next = buildSites(
    [def('Ok', 'k1')],
    [
      use('Ok', 'src/pages/A/A.tsx', '새 버튼'),
      use('Ok', 'src/pages/A/A.tsx', '확인'),
    ],
  );
  const merged = mergeSites(
    [{ ...old, route: '/a', figma: 'https://f', status: 'figma-match' }],
    next,
  );
  const inserted = merged.find((s) => s.id.endsWith('::0'));
  assert.equal(inserted.label, '새 버튼');
  assert.equal(inserted.figma, null);
  assert.equal(inserted.route, null);
  assert.equal(inserted.status, 'inventoried');
});

test('두 사용처 중 하나만 옮기면 남은 사용처는 migrated를 물려받지 않고, 옮긴 기록은 따로 남는다', () => {
  const [first, second] = buildSites(
    [def('Ok', 'k1')],
    [
      use('Ok', 'src/pages/A/A.tsx', '저장'),
      use('Ok', 'src/pages/A/A.tsx', '취소'),
    ],
  );
  const prev = [
    { ...first, route: '/a', figma: 'https://f', status: 'migrated' },
    second,
  ];
  // 첫 사용처를 공용 Button으로 옮긴 뒤 다시 인벤토리: 남은 '취소'가 ::0이 된다
  const next = buildSites(
    [def('Ok', 'k1')],
    [use('Ok', 'src/pages/A/A.tsx', '취소')],
  );
  const merged = mergeSites(prev, next);
  const live = merged.find((s) => s.id === first.id);
  assert.equal(live.label, '취소');
  assert.equal(live.status, 'inventoried');
  assert.equal(live.route, null);
  const kept = merged.find((s) => s.id === `${first.id}#migrated`);
  assert.ok(kept, '옮긴 기록이 사라졌다');
  assert.equal(kept.status, 'migrated');
  assert.equal(kept.label, '저장');
  assert.equal(kept.route, '/a');
  assert.equal(merged.length, 2);
});

test('같은 id·같은 라벨이어도 살아 있는 정의의 사용처에는 verified를 물려주지 않는다', () => {
  const [site] = buildSites(
    [def('Ok', 'k1')],
    [use('Ok', 'src/pages/A/A.tsx')],
  );
  const merged = mergeSites(
    [{ ...site, route: '/a', status: 'verified' }],
    [site],
  );
  assert.deepEqual(
    merged.map((s) => [s.id, s.status]),
    [
      [site.id, 'inventoried'],
      [`${site.id}#migrated`, 'verified'],
    ],
  );
  // 다시 돌려도 #migrated 기록이 늘어나지 않는다
  const again = mergeSites(merged, [site]);
  assert.deepEqual(
    again.map((s) => s.id),
    merged.map((s) => s.id),
  );
});

test('후보 묶음은 도메인 2곳 이상이고 동적 값이 없어야 한다', () => {
  const sites = buildSites(
    [def('Ok', 'k1'), def('Dyn', 'k2', { dynamic: ['color'] })],
    [
      use('Ok', 'src/pages/A/A.tsx'),
      use('Ok', 'src/pages/B/B.tsx'),
      use('Dyn', 'src/pages/A/A.tsx'),
      use('Dyn', 'src/pages/B/B.tsx'),
    ],
  );
  const cs = clusters(sites);
  assert.deepEqual(
    cs.map((c) => [c.key, c.domains, c.candidate]),
    [
      ['k1', ['A', 'B'], true],
      ['k2', ['A', 'B'], false],
    ],
  );
});

const rec = (id, extra = {}) => ({
  id,
  defFile: `src/pages/${id}/${id}.styles.ts`,
  usageFile: `src/pages/${id}/${id}.tsx`,
  route: `/${id}`,
  locator: { role: 'button', name: id },
  figma: 'https://f',
  status: 'inventoried',
  ...extra,
});

test('--ids에 대장에 없는 id가 있으면 그 id를 돌려준다 (조용히 빼지 않는다)', () => {
  const { picked, unknown } = pickByIds([rec('A'), rec('B')], ['A', 'Typo']);
  assert.deepEqual(
    picked.map((s) => s.id),
    ['A'],
  );
  assert.deepEqual(unknown, ['Typo']);
});

test('기준 커밋과 달라진 파일의 자리인데 migrated가 아니면 경고 대상이다', () => {
  const sites = [
    rec('A', { status: 'migrated' }),
    rec('B'),
    rec('C', { status: 'figma-match' }),
  ];
  const changed = new Set(['src/pages/A/A.tsx', 'src/pages/B/B.styles.ts']);
  assert.deepEqual(
    staleSites(sites, changed).map((s) => s.id),
    ['B'],
  );
});

test('PASS한 migrated 자리만 verified로 올리고 writtenOff를 남긴다', () => {
  const all = [
    rec('A', { status: 'migrated' }),
    rec('B', { status: 'migrated' }),
    rec('C'),
  ];
  const results = [
    { site: all[0], pass: true, writtenOff: ['/auth/user/refresh'] },
    { site: all[1], pass: false, writtenOff: [] },
    { site: all[2], pass: true, writtenOff: [] },
  ];
  const out = promoteVerified(all, results, { srcChanged: true });
  assert.deepEqual(
    out.map((s) => [s.id, s.status, s.writtenOff]),
    [
      ['A', 'verified', ['/auth/user/refresh']],
      ['B', 'migrated', undefined],
      ['C', 'inventoried', undefined],
    ],
  );
  const clean = promoteVerified([all[0]], [{ ...results[0], writtenOff: [] }], {
    srcChanged: true,
  });
  assert.deepEqual(clean[0].writtenOff, []);
});

test('src가 기준 커밋과 같으면 PASS여도 verified로 올리지 않는다', () => {
  const all = [rec('A', { status: 'migrated' })];
  const out = promoteVerified(
    all,
    [{ site: all[0], pass: true, writtenOff: [] }],
    {
      srcChanged: false,
    },
  );
  assert.equal(out[0].status, 'migrated');
});

test('figma-match 대상: migrated·verified는 --ids로 골라도 덮어쓰지 않고, 모르는 id·빈 필드는 알린다', () => {
  const sites = [
    rec('A'),
    rec('B', { status: 'migrated' }),
    rec('C', { status: 'verified' }),
    rec('D', { figma: null }),
    rec('E', { status: 'figma-violation' }),
    rec('F', { status: 'no-design' }),
  ];
  const byIds = figmaTargets(sites, ['A', 'B', 'C', 'D', 'Typo']);
  assert.deepEqual(
    byIds.targets.map((s) => s.id),
    ['A'],
  );
  assert.deepEqual(
    byIds.skippedDone.map((s) => s.id),
    ['B', 'C'],
  );
  assert.deepEqual(
    byIds.incomplete.map((s) => s.id),
    ['D'],
  );
  assert.deepEqual(byIds.unknown, ['Typo']);
  const all = figmaTargets(sites, null);
  assert.deepEqual(
    all.targets.map((s) => s.id),
    ['A', 'E'],
  );
});
