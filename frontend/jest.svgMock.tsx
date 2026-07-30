import type { SVGProps } from 'react';

/**
 * vite-plugin-svgr의 `?react` import를 테스트에서 대체한다.
 * jest-transform-stub은 객체를 반환해 컴포넌트로 쓸 수 없다.
 */
const SvgMock = (props: SVGProps<SVGSVGElement>) => <svg {...props} />;

export default SvgMock;
