/**
 * @fileoverview 스타일 파일에 hex 색을 새로 쓰지 못하게 한다.
 * 색은 src/styles/theme/colors.ts 토큰을 쓴다(src/components/CLAUDE.md 스타일 하드룰).
 * 이미 있던 hex는 baseline 옵션(파일별 값·개수)만큼 허용하고, 그보다 늘면 경고한다.
 * src/pages 아래 파일은 모듈 최상위 UPPER_SNAKE_CASE 상수에 둔 색을 페이지 전용 색으로 보고 허용한다.
 * 공용 컴포넌트는 예외 없이 토큰을 쓴다.
 * @type {import('eslint').Rule.RuleModule}
 */
const path = require('path');

const HEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g;
const CONSTANT_NAME = /^[A-Z][A-Z0-9_]*$/;
// 기준선 키의 기준. 실행 위치(cwd)가 아니라 이 파일 위치로 잡아 어디서 돌려도 같은 키가 나온다
const FRONTEND_ROOT = path.resolve(__dirname, '../..');
// 상수 값으로 인정하는 모양. css`` 스타일 블록이나 함수 호출 안의 hex는 색 상수로 보지 않는다
const VALUE_SHAPES = new Set([
  'ObjectExpression',
  'Property',
  'ArrayExpression',
  'TemplateLiteral',
  'TSAsExpression',
  'TSSatisfiesExpression',
]);

/** #fff·#FfFfFf → #FFFFFF 처럼 같은 색을 같은 키로 맞춘다 */
function normalize(hex) {
  const body = hex.slice(1).toUpperCase();
  const full = body.length <= 4 ? [...body].map((c) => c + c).join('') : body;
  return `#${full}`;
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        '스타일 파일의 hex 색 대신 colors 토큰 사용 (기존 hex는 baseline만큼 허용)',
    },
    schema: [
      {
        type: 'object',
        properties: { baseline: { type: 'object' } },
        additionalProperties: false,
      },
    ],
    messages: {
      hex: '{{value}} 대신 colors 토큰을 쓰세요. src/pages에서만 쓰는 색이면 파일 위 UPPER_SNAKE_CASE 상수에 두세요. (이 파일 허용 {{allowed}}개, 지금 {{count}}개)',
    },
  },

  create(context) {
    const baseline = context.options[0]?.baseline ?? {};
    const file = path
      .relative(FRONTEND_ROOT, context.filename)
      .split(path.sep)
      .join('/');
    const allowedInFile = baseline[file] ?? {};
    const isPageFile = file.startsWith('src/pages/');
    const sourceCode = context.sourceCode;
    /** 값 → 이 파일에서 나온 위치들 */
    const found = new Map();

    /** const FOO = ... 처럼 모듈 최상위 상수의 값(문자열·객체·배열) 안에 있는지 */
    function isInTopLevelConstant(node) {
      const ancestors = sourceCode.getAncestors(node);
      const index = ancestors.findIndex((a) => a.type === 'VariableDeclarator');
      if (index === -1) return false;
      const declarator = ancestors[index];
      const declaration = declarator.parent;
      const owner = declaration.parent;
      const isTopLevel =
        owner.type === 'Program' ||
        (owner.type === 'ExportNamedDeclaration' &&
          owner.parent.type === 'Program');
      return (
        isTopLevel &&
        declaration.kind === 'const' &&
        declarator.id.type === 'Identifier' &&
        CONSTANT_NAME.test(declarator.id.name) &&
        ancestors.slice(index + 1).every((a) => VALUE_SHAPES.has(a.type))
      );
    }

    function collect(node, raw) {
      if (isPageFile && isInTopLevelConstant(node)) return;
      // Literal은 따옴표, TemplateElement는 ` 또는 } 한 글자가 raw 앞에 있다
      const start = node.range[0] + 1;
      for (const match of raw.matchAll(HEX)) {
        const value = normalize(match[0]);
        const index = start + match.index;
        const loc = {
          start: sourceCode.getLocFromIndex(index),
          end: sourceCode.getLocFromIndex(index + match[0].length),
        };
        found.set(value, [...(found.get(value) ?? []), loc]);
      }
    }

    return {
      Literal(node) {
        if (typeof node.value === 'string')
          collect(node, node.raw.slice(1, -1));
      },
      TemplateElement(node) {
        collect(node, node.value.raw);
      },
      'Program:exit'() {
        for (const [value, locs] of found) {
          const allowed = allowedInFile[value] ?? 0;
          if (locs.length <= allowed) continue;
          for (const loc of locs) {
            context.report({
              loc,
              messageId: 'hex',
              data: { value, allowed, count: locs.length },
            });
          }
        }
      },
    };
  },
};
