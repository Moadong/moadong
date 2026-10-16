/**
 * @fileoverview Mixpanel 이벤트명은 eventName.ts 상수만 사용하도록 강제한다.
 * 문자열 하드코딩을 막아 이벤트명 오타/중복을 컴파일 전에 잡고,
 * 동적 이벤트명(`${page} Visited`)을 막아 이벤트 종류가 값마다 늘어나지 않게 한다.
 * (docs/features/analytics/mixpanel-naming-convention.md 2-2, 3-1)
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Mixpanel 이벤트명은 src/constants/eventName.ts 상수만 사용 (문자열 하드코딩·동적 이벤트명 금지)',
    },
    schema: [],
    messages: {
      hardcoded:
        '이벤트명을 문자열로 하드코딩하지 마세요. eventName.ts 상수를 사용하세요.',
      dynamic:
        '이벤트명에 동적 값을 넣지 마세요. 변하는 값은 속성(snake_case)으로 보내세요.',
    },
  },

  create(context) {
    /** trackEvent(...) 또는 mixpanel.track(...) 호출인지 판별 */
    function isTrackCall(callee) {
      if (callee.type === 'Identifier') {
        return callee.name === 'trackEvent';
      }
      // mixpanel?.track(...) 옵셔널 체이닝도 함께 검사
      const isMember =
        callee.type === 'MemberExpression' ||
        callee.type === 'OptionalMemberExpression';
      return (
        isMember &&
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
      return arg.type === 'TemplateLiteral' && arg.expressions.length === 0;
    }

    /** 첫 인자가 값에 따라 달라지는 이벤트명(`${x} Visited`, 'a' + x)인지 판별 */
    function isDynamicString(arg) {
      if (arg.type === 'TemplateLiteral') {
        return arg.expressions.length > 0;
      }
      return arg.type === 'BinaryExpression' && arg.operator === '+';
    }

    return {
      CallExpression(node) {
        if (!isTrackCall(node.callee)) return;
        const firstArg = node.arguments[0];
        if (!firstArg) return;
        if (isHardcodedString(firstArg)) {
          context.report({ node: firstArg, messageId: 'hardcoded' });
        } else if (isDynamicString(firstArg)) {
          context.report({ node: firstArg, messageId: 'dynamic' });
        }
      },
    };
  },
};
