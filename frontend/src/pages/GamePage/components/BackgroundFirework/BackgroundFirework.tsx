import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

const PARTICLE_COUNT = 70;
const PARTICLE_COLORS = [
  '#FF5414',
  '#FFD432',
  '#FF9D7C',
  '#5FD8C0',
  '#7094FF',
  '#FF5FA2',
  '#A06BFF',
];

const BackgroundFirework = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const angle =
          (i / PARTICLE_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const distance = 280 + Math.random() * 380;
        const size = 8 + Math.random() * 16;
        const isConfetti = Math.random() > 0.45;
        return {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          color:
            PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
          size,
          isConfetti,
          spin: (Math.random() - 0.5) * 1080,
          duration: 1.3 + Math.random() * 0.6,
        };
      }),
    [],
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* 중앙 플래시 링 */}
      <motion.span
        initial={{ scale: 0, opacity: 0.6 }}
        animate={{ scale: 6, opacity: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 200,
          height: 200,
          marginTop: -100,
          marginLeft: -100,
          borderRadius: '50%',
          border: '6px solid rgba(255, 212, 50, 0.7)',
        }}
      />
      {particles.map((p, i) => (
        <motion.span
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
          animate={{
            x: p.x,
            y: [0, p.y * 0.65, p.y + 120],
            opacity: [1, 1, 0],
            scale: 0.4,
            rotate: p.spin,
          }}
          transition={{ duration: p.duration, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: p.isConfetti ? p.size * 0.6 : p.size,
            height: p.isConfetti ? p.size * 1.7 : p.size,
            marginTop: -p.size / 2,
            marginLeft: -p.size / 2,
            borderRadius: p.isConfetti ? '2px' : '50%',
            background: p.color,
            boxShadow: `0 0 12px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
};

export default memo(BackgroundFirework);
