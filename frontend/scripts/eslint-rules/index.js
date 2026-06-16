/**
 * 모아동 로컬 ESLint 플러그인.
 * @type {import('eslint').ESLint.Plugin}
 */
module.exports = {
  rules: {
    'no-hardcoded-event-name': require('./no-hardcoded-event-name'),
  },
};
