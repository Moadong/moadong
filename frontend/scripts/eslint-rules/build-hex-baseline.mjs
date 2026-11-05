// no-hex-in-styles의 기준선을 지금 코드로 다시 만든다.
// hex를 토큰으로 바꿔 줄였을 때 돌려 기준선을 좁힌다. 새로 늘어난 hex까지 허용하게 되므로 늘리려고 돌리지 않는다.
// 실행: npm run lint:hex-baseline
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { ESLint } from 'eslint';
import localRules from './index.js';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUT = path.join(import.meta.dirname, 'hex-in-styles-baseline.json');

const eslint = new ESLint({
  cwd: ROOT,
  overrideConfigFile: true,
  overrideConfig: {
    files: ['src/**/*.styles.ts'],
    languageOptions: {
      parser: (await import('@typescript-eslint/parser')).default,
    },
    plugins: { local: localRules },
    rules: { 'local/no-hex-in-styles': ['warn', { baseline: {} }] },
  },
});

const results = await eslint.lintFiles(['src/**/*.styles.ts']);
const baseline = {};
for (const { filePath, messages } of results) {
  const file = path.relative(ROOT, filePath).split(path.sep).join('/');
  for (const { ruleId, message } of messages) {
    if (ruleId !== 'local/no-hex-in-styles') continue;
    const value = message.match(/^(#[0-9A-F]+)/)[1];
    baseline[file] ??= {};
    baseline[file][value] = (baseline[file][value] ?? 0) + 1;
  }
}
const sorted = Object.fromEntries(
  Object.keys(baseline)
    .sort()
    .map((f) => [f, Object.fromEntries(Object.entries(baseline[f]).sort())]),
);
writeFileSync(OUT, `${JSON.stringify(sorted, null, 2)}\n`);
const total = Object.values(sorted).reduce(
  (n, v) => n + Object.values(v).reduce((a, b) => a + b, 0),
  0,
);
console.log(
  `hex ${total}개 / 파일 ${Object.keys(sorted).length}개 → ${path.relative(ROOT, OUT)}`,
);
