import { useEffect, useRef } from 'react';

interface Dot {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  swept: boolean;
  t: number;
  charIndex: number;
  color: string;
}

interface DotTextEffectProps {
  text: string;
  fontSize?: number;
  dotR?: number;
  spacing?: number;
  charGap?: number;
  hoverRadius?: number;
  sweepSpeed?: number;
  charColors?: string[];
}

const DOT_COLOR = '#888780';

const DEFAULT_CHAR_COLORS = [
  '#FF5414',
  '#FFB300',
  '#5FD8C0',
  '#7094FF',
  '#D4537E',
  '#EF9F27',
  '#FF9D7C',
];

function lerpColor(a: string, b: string, t: number): string {
  const ah = parseInt(a.replace('#', ''), 16);
  const bh = parseInt(b.replace('#', ''), 16);
  const ar = (ah >> 16) & 255,
    ag = (ah >> 8) & 255,
    ab = ah & 255;
  const br = (bh >> 16) & 255,
    bg = (bh >> 8) & 255,
    bb = bh & 255;
  return `rgb(${Math.round(ar + (br - ar) * t)},${Math.round(ag + (bg - ag) * t)},${Math.round(ab + (bb - ab) * t)})`;
}

function buildDots(
  text: string,
  fontSize: number,
  spacing: number,
  charGap: number,
): { dots: Dot[]; W: number; H: number } {
  const font = `900 ${fontSize}px "Pretendard", Arial, sans-serif`;
  const H = Math.round(fontSize * 1.5);

  // 각 글자 너비 측정
  const measurer = document.createElement('canvas');
  const mCtx = measurer.getContext('2d')!;
  mCtx.font = font;
  const chars = [...text]; // 유니코드 글자 단위로 분리
  const charWidths = chars.map((ch) => mCtx.measureText(ch).width);
  const totalW =
    charWidths.reduce((a, b) => a + b, 0) + charGap * (chars.length - 1);
  const W = Math.ceil(totalW) + fontSize; // 좌우 여백

  // 오프스크린 캔버스에 글자별로 개별 렌더
  const oc = document.createElement('canvas');
  oc.width = W;
  oc.height = H;
  const ctx = oc.getContext('2d')!;
  ctx.font = font;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';

  // 글자별 x 시작 위치 계산 (전체 중앙 정렬)
  const startX = (W - totalW) / 2;
  const charStarts: number[] = [];
  let curX = startX;
  for (let i = 0; i < chars.length; i++) {
    charStarts.push(curX);
    ctx.fillText(chars[i], curX, H / 2);
    curX += charWidths[i] + charGap;
  }

  // 글자별 x 경계 (end = 다음 글자 start - charGap)
  const charEnds = charStarts.map((s, i) => s + charWidths[i]);

  // 픽셀 샘플링 → Dot 생성
  const { data } = ctx.getImageData(0, 0, W, H);
  const dots: Dot[] = [];

  for (let y = 0; y < H; y += spacing) {
    for (let x = 0; x < W; x += spacing) {
      const alpha = data[(y * W + x) * 4 + 3];
      if (alpha > 100) {
        // 어느 글자에 속하는지 판별
        let charIndex = chars.length - 1;
        for (let ci = 0; ci < chars.length; ci++) {
          if (x >= charStarts[ci] && x <= charEnds[ci]) {
            charIndex = ci;
            break;
          }
        }
        dots.push({
          x,
          y,
          ox: x,
          oy: y,
          vx: 0,
          vy: 0,
          swept: false,
          t: 0,
          charIndex,
          color: '',
        });
      }
    }
  }

  return { dots, W, H };
}

const DotTextEffect = ({
  text,
  fontSize = 80,
  dotR = 2.2,
  spacing = 4,
  charGap = 14,
  hoverRadius = 28,
  sweepSpeed = 0.15,
  charColors = DEFAULT_CHAR_COLORS,
}: DotTextEffectProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const dotsRef = useRef<Dot[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    let active = true;
    let canvasW = 0;
    let canvasH = 0;

    document.fonts.ready.then(() => {
      if (!active) return;

      const { dots, W, H } = buildDots(text, fontSize, spacing, charGap);
      canvasW = W;
      canvasH = H;
      canvas.width = W;
      canvas.height = H;
      dots.forEach((d) => {
        d.color = charColors[Math.floor(Math.random() * charColors.length)];
      });
      dotsRef.current = dots;

      rafRef.current = requestAnimationFrame(animate);
    });

    const animate = () => {
      const mouse = mouseRef.current;
      const ds = dotsRef.current;

      ctx.clearRect(0, 0, canvasW, canvasH);

      const colorRadius = hoverRadius * 1.8;

      for (const d of ds) {
        const sweptColor = d.color;
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < hoverRadius && !d.swept) {
          d.swept = true;
          d.t = 0;
          const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.4;
          const speed = 2.5 + Math.random() * 4;
          d.vx = Math.cos(angle) * speed;
          d.vy = Math.sin(angle) * speed;
        }

        if (d.swept) {
          d.t = Math.min(d.t + sweepSpeed, 1);
          d.x += d.vx * (1 - d.t);
          d.y += d.vy * (1 - d.t);

          if (d.t > 0.55) {
            d.x += (d.ox - d.x) * 0.06;
            d.y += (d.oy - d.y) * 0.06;
            const backDist = Math.sqrt((d.x - d.ox) ** 2 + (d.y - d.oy) ** 2);
            if (backDist < 0.5) {
              d.x = d.ox;
              d.y = d.oy;
              d.swept = false;
              d.t = 0;
              d.vx = 0;
              d.vy = 0;
            }
          }

          ctx.beginPath();
          ctx.arc(d.x, d.y, dotR * (1 + (1 - d.t) * 0.8), 0, Math.PI * 2);
          ctx.fillStyle = lerpColor(sweptColor, DOT_COLOR, d.t);
          ctx.fill();
        } else {
          // 커서 주변 colorRadius 안 공들은 거리 비례로 색이 물듦
          const proximityColor =
            dist < colorRadius
              ? lerpColor(
                  sweptColor,
                  DOT_COLOR,
                  Math.pow(dist / colorRadius, 2.5),
                )
              : DOT_COLOR;

          ctx.beginPath();
          ctx.arc(d.x, d.y, dotR, 0, Math.PI * 2);
          ctx.fillStyle = proximityColor;
          ctx.fill();
        }
      }

      // 커스텀 커서
      if (mouse.x > 0) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#FF5414';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, hoverRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,84,20,0.18)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    return () => {
      active = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [
    text,
    fontSize,
    dotR,
    spacing,
    charGap,
    hoverRadius,
    sweepSpeed,
    charColors,
  ]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = canvasRef.current!.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -999, y: -999 };
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: 'none', display: 'block' }}
    />
  );
};

export default DotTextEffect;
