import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { check, replaceArguments, stripFrontmatter, write } from './sync-codex-skills.mjs';

test('frontmatter가 있으면 떼고 본문만 남긴다', () => {
  assert.equal(stripFrontmatter('---\ndescription: x\nallowed-tools: Agent\n---\n\n본문\n'), '본문\n');
});

test('frontmatter가 없거나 닫는 ---가 없으면 원문을 그대로 둔다', () => {
  assert.equal(stripFrontmatter('# 제목\n\n본문\n'), '# 제목\n\n본문\n');
  assert.equal(stripFrontmatter('---\ndescription: x\n본문\n'), '---\ndescription: x\n본문\n');
});

test('ARGUMENTS 세 가지 형태를 모두 치환하고 서로 겹치지 않는다', () => {
  assert.equal(
    replaceArguments('--writer ${ARGUMENTS:-claude}'),
    '--writer <사용자의 현재 요청, 비어 있으면 claude>',
  );
  assert.equal(replaceArguments('`${ARGUMENTS}`가 비어 있으면'), '`사용자의 현재 요청`가 비어 있으면');
  assert.equal(replaceArguments('`$ARGUMENTS`가 비어 있으면'), '`사용자의 현재 요청`가 비어 있으면');
});

test('--check는 디렉터리만 스킬로 보고 .DS_Store 같은 파일은 무시한다', () => {
  const outDir = mkdtempSync(path.join(tmpdir(), 'codex-skills-'));
  const generated = { a: '---\nname: "a"\n---\n본문\n' };
  write(generated, outDir);
  writeFileSync(path.join(outDir, '.DS_Store'), '');
  assert.deepEqual(check(generated, outDir), []);

  mkdirSync(path.join(outDir, 'zzz'));
  assert.deepEqual(check(generated, outDir), ['.codex/skills/zzz: MANIFEST에 없는 스킬']);
});

test('--check는 CRLF로 저장된 사본도 LF 생성 결과와 같다고 본다', () => {
  const outDir = mkdtempSync(path.join(tmpdir(), 'codex-skills-'));
  const generated = { a: '---\nname: "a"\n---\n본문\n' };
  mkdirSync(path.join(outDir, 'a'));
  writeFileSync(path.join(outDir, 'a', 'SKILL.md'), generated.a.replace(/\n/g, '\r\n'));
  assert.deepEqual(check(generated, outDir), []);

  writeFileSync(path.join(outDir, 'a', 'SKILL.md'), '다른 내용\n');
  assert.deepEqual(check(generated, outDir), ['.codex/skills/a/SKILL.md: 원본과 다름']);
});
