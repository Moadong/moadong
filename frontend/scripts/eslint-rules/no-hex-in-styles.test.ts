import path from 'path';
import * as tsParser from '@typescript-eslint/parser';
import { RuleTester } from 'eslint';
import rule from './no-hex-in-styles';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

// 규칙과 같은 기준(frontend 루트)으로 경로를 만든다
const ROOT = path.resolve(__dirname, '../..');
const filename = path.join(ROOT, 'src/pages/A/A.styles.ts');
const componentFile = path.join(ROOT, 'src/components/common/B/B.styles.ts');
const baseline = { 'src/pages/A/A.styles.ts': { '#F0F0F0': 2 } };

ruleTester.run('no-hex-in-styles', rule, {
  valid: [
    // 토큰 사용 — 정상
    { code: 'const a = css`color: ${colors.gray[100]};`;', filename },
    // 반투명 rgba는 하드룰 예외
    { code: 'const a = css`background: rgba(0, 0, 0, 0.5);`;', filename },
    // 주석 안의 hex는 세지 않는다
    { code: '// #FFFFFF 는 쓰지 않는다\nconst a = 1;', filename },
    // 페이지 전용 색: 모듈 최상위 UPPER_SNAKE_CASE 상수
    { code: "const MEDAL_COLORS = { 1: '#FFB300' };", filename },
    { code: "export const DARK_ROW = { hover: '#2C2C3A' };", filename },
    // 객체 안 그라디언트 템플릿도 색 상수 (RecruitPage CARD_BACKGROUNDS)
    {
      code: 'const CARD = { dev: `linear-gradient(#BFE3FB, ${colors.accent[1][600]})` };',
      filename,
    },
    {
      // as const는 TS 문법이라 실제 lint처럼 TS 파서로 읽는다
      code: "const ICONS = ['#FFD432', '#FF9500'] as const;",
      filename,
      languageOptions: { parser: tsParser },
    },
    // baseline 개수까지는 허용 (#f0f0f0과 #F0F0F0은 같은 값)
    {
      code: "const a = css`color: #f0f0f0;`; const b = '#F0F0F0';",
      filename,
      options: [{ baseline }],
    },
  ],
  invalid: [
    {
      code: 'const a = css`color: #fff;`;',
      filename,
      errors: [
        {
          messageId: 'hex',
          data: { value: '#FFFFFF', allowed: 0, count: 1 },
          // 경고 위치가 hex 자체를 가리킨다(템플릿 앞 ` 한 글자 보정)
          line: 1,
          column: 22,
          endColumn: 26,
        },
      ],
    },
    {
      // 삼항 안의 문자열 hex
      code: "const c = (dark) => (dark ? '#22222E' : colors.base.white);",
      filename,
      // 따옴표 한 글자 보정
      errors: [{ messageId: 'hex', line: 1, column: 30, endColumn: 37 }],
    },
    {
      // 함수 안 상수는 최상위가 아니라 예외가 아니다
      code: "function f() { const DARK = '#22222E'; return DARK; }",
      filename,
      errors: [{ messageId: 'hex' }],
    },
    {
      // 공용 컴포넌트의 상수는 페이지 전용 색이 아니라 예외가 아니다
      code: "const BORDER_FOCUS = '#007bff';",
      filename: componentFile,
      errors: [{ messageId: 'hex' }],
    },
    {
      // 상수여도 css`` 스타일 블록 안의 hex는 색 상수가 아니다
      code: 'export const CARD_STYLE = css`color: #123456;`;',
      filename,
      errors: [{ messageId: 'hex' }],
    },
    {
      // 함수 호출 안의 hex도 마찬가지
      code: "const ACCENT = lighten('#123456');",
      filename,
      errors: [{ messageId: 'hex' }],
    },
    {
      // 경로에 pages가 있어도 src/pages 아래가 아니면 예외가 아니다
      code: "const DARK = '#22222E';",
      filename: path.join(ROOT, 'src/components/pages/C.styles.ts'),
      errors: [{ messageId: 'hex' }],
    },
    {
      // let은 상수가 아니다
      code: "let DARK = '#22222E';",
      filename,
      errors: [{ messageId: 'hex' }],
    },
    {
      // baseline보다 늘면 그 값의 모든 위치를 알린다
      code: "const a = css`color: #F0F0F0; border: 1px solid #F0F0F0;`; const b = '#F0F0F0';",
      filename,
      options: [{ baseline }],
      errors: [
        { messageId: 'hex', data: { value: '#F0F0F0', allowed: 2, count: 3 } },
        { messageId: 'hex' },
        { messageId: 'hex' },
      ],
    },
    {
      // 다른 파일의 baseline은 이 파일에 적용되지 않는다
      code: "const a = '#F0F0F0';",
      filename: componentFile,
      options: [{ baseline }],
      errors: [{ messageId: 'hex' }],
    },
  ],
});
