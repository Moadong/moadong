import { memo, useEffect, useRef } from 'react';

const mobileQuery = window.matchMedia('(max-width: 699px)');

interface Dot {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  swept: boolean;
  t: number;
}

interface DotTextEffectProps {
  text: string;
  fontSize?: number;
  dotR?: number;
  spacing?: number;
  charGap?: number;
  hoverRadius?: number;
  sweepSpeed?: number;
}

const DOT_COLOR = '#000000';

function buildDots(
  text: string,
  fontSize: number,
  spacing: number,
  charGap: number,
): { dots: Dot[]; W: number; H: number } {
  const font = `900 ${fontSize}px "Pretendard", Arial, sans-serif`;
  const H = Math.round(fontSize * 1.5);

  const measurer = document.createElement('canvas');
  const mCtx = measurer.getContext('2d')!;
  mCtx.font = font;
  const chars = [...text];
  const charWidths = chars.map((ch) => mCtx.measureText(ch).width);
  const totalW =
    charWidths.reduce((a, b) => a + b, 0) + charGap * (chars.length - 1);
  const W = Math.ceil(totalW) + fontSize;

  const oc = document.createElement('canvas');
  oc.width = W;
  oc.height = H;
  const ctx = oc.getContext('2d')!;
  ctx.font = font;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';

  const startX = (W - totalW) / 2;
  let curX = startX;
  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(chars[i], curX, H / 2);
    curX += charWidths[i] + charGap;
  }

  const { data } = ctx.getImageData(0, 0, W, H);
  const dots: Dot[] = [];

  for (let y = 0; y < H; y += spacing) {
    for (let x = 0; x < W; x += spacing) {
      const alpha = data[(y * W + x) * 4 + 3];
      if (alpha > 100) {
        dots.push({ x, y, ox: x, oy: y, vx: 0, vy: 0, swept: false, t: 0 });
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
  sweepSpeed = 0.12,
}: DotTextEffectProps) => {
  const isMobileRef = useRef(mobileQuery.matches);

  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => {
      isMobileRef.current = e.matches;
    };
    mobileQuery.addEventListener('change', handler);
    return () => mobileQuery.removeEventListener('change', handler);
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const prevMouseRef = useRef({ x: -999, y: -999 });
  const dotsRef = useRef<Dot[]>([]);
  const rafRef = useRef<number>(0);
  const canvasSizeRef = useRef({ W: 0, H: 0 });

  const effectiveFontSize = fontSize;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    let active = true;
    let canvasW = 0;
    let canvasH = 0;

    document.fonts.ready.then(() => {
      if (!active) return;

      const { dots, W, H } = buildDots(
        text,
        effectiveFontSize,
        spacing,
        charGap,
      );
      canvasW = W;
      canvasH = H;
      canvas.width = W;
      canvas.height = H;
      canvasSizeRef.current = { W, H };

      // 컨테이너 너비를 넘으면 CSS transform으로 축소 (항상 한 줄 유지)
      const wrapper = wrapperRef.current;
      if (wrapper) {
        const availW = wrapper.clientWidth || W;
        const scale = Math.min(1, availW / W);
        canvas.style.width = `${W * scale}px`;
        canvas.style.height = `${H * scale}px`;
      }
      dotsRef.current = dots;

      rafRef.current = requestAnimationFrame(animate);
    });

    const hoverR2 = hoverRadius * hoverRadius;

    const animate = () => {
      const mouse = mouseRef.current;
      const prev = prevMouseRef.current;
      const mouseMoved = mouse.x !== prev.x || mouse.y !== prev.y;
      prevMouseRef.current = { x: mouse.x, y: mouse.y };
      const ds = dotsRef.current;
      const inactive = mouse.x < -900;

      ctx.clearRect(0, 0, canvasW, canvasH);

      // 인터랙션 없을 때: 전체 dot을 단일 path로 배치 렌더 (성능 최적화)
      if (inactive && ds.every((d) => !d.swept)) {
        ctx.beginPath();
        ctx.fillStyle = DOT_COLOR;
        for (const d of ds) {
          ctx.moveTo(d.ox + dotR, d.oy);
          ctx.arc(d.ox, d.oy, dotR, 0, Math.PI * 2);
        }
        ctx.fill();
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      for (const d of ds) {
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist2 = dx * dx + dy * dy;

        if (dist2 < hoverR2 && !d.swept && mouseMoved) {
          d.swept = true;
          d.t = 0;
          const mobile = isMobileRef.current;
          const moveAngle = Math.atan2(mouse.y - prev.y, mouse.x - prev.x);
          const angle = moveAngle + (Math.random() - 0.5) * 1.2;
          const speed = mobile
            ? 5 + Math.random() * 10
            : 10 + Math.random() * 16;
          d.vx = Math.cos(angle) * speed;
          d.vy = Math.sin(angle) * speed;
        }

        if (d.swept) {
          const effectiveSweepSpeed = isMobileRef.current ? 0.22 : sweepSpeed;
          d.t = Math.min(d.t + effectiveSweepSpeed, 1);
          if (d.t < 0.6) d.vy += 0.18;
          d.x += d.vx * (1 - d.t);
          d.y += d.vy * (1 - d.t);

          const renderT = d.t;
          if (d.t > 0.6) {
            d.x += (d.ox - d.x) * 0.08;
            d.y += (d.oy - d.y) * 0.08;
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
          ctx.arc(d.x, d.y, dotR * (1 + (1 - renderT) * 0.8), 0, Math.PI * 2);
          ctx.fillStyle = DOT_COLOR;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(d.x, d.y, dotR, 0, Math.PI * 2);
          ctx.fillStyle = DOT_COLOR;
          ctx.fill();
        }
      }

      // 커스텀 커서 (데스크탑만)
      if (!inactive) {
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
    effectiveFontSize,
    dotR,
    spacing,
    charGap,
    hoverRadius,
    sweepSpeed,
  ]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const observer = new ResizeObserver(() => {
      const { W, H } = canvasSizeRef.current;
      if (W === 0) return;
      const scale = Math.min(1, wrapper.clientWidth / W);
      canvas.style.width = `${W * scale}px`;
      canvas.style.height = `${H * scale}px`;
    });

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  const toCanvasCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current!;
    const r = canvas.getBoundingClientRect();
    return {
      x: (clientX - r.left) * (canvas.width / r.width),
      y: (clientY - r.top) * (canvas.height / r.height),
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    mouseRef.current = toCanvasCoords(e.clientX, e.clientY);
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -999, y: -999 };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.touches[0];
    mouseRef.current = toCanvasCoords(touch.clientX, touch.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.touches[0];
    mouseRef.current = toCanvasCoords(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    mouseRef.current = { x: -999, y: -999 };
  };

  return (
    <div
      ref={wrapperRef}
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role='img'
        aria-label={text}
        style={{ cursor: 'none', display: 'block', touchAction: 'none' }}
      />
    </div>
  );
};

export default memo(DotTextEffect);
