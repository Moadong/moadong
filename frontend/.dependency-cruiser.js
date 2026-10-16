/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'warn',
      comment: '순환 참조 = 양방향 결합. 리팩터링 1순위.',
      from: {},
      to: { circular: true },
    },
    {
      name: 'no-orphans',
      severity: 'info',
      comment: '어디서도 import되지 않는 고립 모듈(dead code 후보).',
      from: {
        orphan: true,
        pathNot: ['\\.(d|test|stories)\\.[tj]sx?$', '^src/index\\.[tj]sx?$'],
      },
      to: {},
    },
    {
      name: 'common-no-pages',
      severity: 'error',
      comment: '공통 컴포넌트가 pages를 역참조하면 응집도 붕괴 신호.',
      from: { path: '^src/components/common' },
      to: { path: '^src/pages' },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsConfig: { fileName: 'tsconfig.json' },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
    reporterOptions: {
      dot: { collapsePattern: 'node_modules/(?:@[^/]+/[^/]+|[^/]+)' },
    },
  },
};
