/**
 * @fileoverview Mixpanel 이벤트명은 USER_EVENT 상수만 사용하도록 강제한다.
 * 문자열 하드코딩을 막아 이벤트명 오타/중복을 컴파일 전에 잡는다.
 * (conventions.md: "문자열 하드코딩 금지")
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Mixpanel 이벤트명은 src/constants/eventName.ts의 USER_EVENT 상수만 사용 (문자열 하드코딩 금지)',
    },
    schema: [],
    messages: {
      hardcoded:
        '이벤트명을 문자열로 하드코딩하지 마세요. USER_EVENT 상수를 사용하세요.',
    },
  },

  create(context) {
    /** trackEvent(...) 또는 mixpanel.track(...) 호출인지 판별 */
    function isTrackCall(callee) {
      if (callee.type === 'Identifier') {
        return callee.name === 'trackEvent';
      }
      return (
        callee.type === 'MemberExpression' &&
        callee.object.type === 'Identifier' &&
        callee.object.name === 'mixpanel' &&
        callee.property.type === 'Identifier' &&
        callee.property.name === 'track'
      );
    }

    /** 첫 인자가 하드코딩된 문자열(리터럴 또는 정적 템플릿)인지 판별 */
    function isHardcodedString(arg) {
      if (arg.type === 'Literal') {
        return typeof arg.value === 'string';
      }
      // `${x} Visited` 같은 동적 템플릿은 허용, `foo` 같은 정적 템플릿만 금지
      return arg.type === 'TemplateLiteral' && arg.expressions.length === 0;
    }

    return {
      CallExpression(node) {
        if (!isTrackCall(node.callee)) return;
        const firstArg = node.arguments[0];
        if (!firstArg) return;
        if (isHardcodedString(firstArg)) {
          context.report({ node: firstArg, messageId: 'hardcoded' });
        }
      },
    };
  },
};
