'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

interface Image {
  src: string;
  alt?: string;
}

interface ZoomParallaxProps {
  /**
   * Up to 6 images placed around the center in the collage.
   * Index 0 → top-left, 1 → top, 2 → right, 3 → bottom-left,
   * 4 → bottom, 5 → far-right (small).
   */
  images: Image[];
  /**
   * Optional content rendered in the center slot.
   * Scales from 1→4× as the user scrolls, filling the viewport.
   * Fades in during the last ~30 % of the scroll range.
   */
  centerContent?: React.ReactNode;
}

// Each surrounding image has its own scale speed
const SURROUNDING_SCALES = [
  [1, 5],
  [1, 6],
  [1, 5],
  [1, 6],
  [1, 8],
  [1, 9],
] as const;

// Tailwind [&>div] overrides for each surrounding slot
const POSITION_CLASSES = [
  '[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]',
  '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]',
  '[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]',
  '[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]',
  '[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]',
  '[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]',
];

export function ZoomParallax({ images, centerContent }: ZoomParallaxProps) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  // Center slot: slowest zoom (1→4) so it stays visible the longest
  const centerScale = useTransform(scrollYProgress, [0, 1], [1, 4]);
  // Center text fades in during the last 30 % of the scroll
  const centerOpacity = useTransform(scrollYProgress, [0.65, 0.95], [0, 1]);

  return (
    <div ref={container} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ── Surrounding images (up to 6) ── */}
        {images.slice(0, 6).map(({ src, alt }, i) => {
          const [from, to] = SURROUNDING_SCALES[i % SURROUNDING_SCALES.length];
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const scale = useTransform(scrollYProgress, [0, 1], [from, to]);

          return (
            <motion.div
              key={i}
              style={{ scale }}
              className={`absolute top-0 flex h-full w-full items-center justify-center ${POSITION_CLASSES[i % POSITION_CLASSES.length]}`}
            >
              <div className="relative h-[25vh] w-[25vw]">
                <img
                  src={src || '/placeholder.svg'}
                  alt={alt || `Life stage ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>
          );
        })}

        {/* ── Center reveal slot ── rendered last = highest z-index */}
        {centerContent && (
          <motion.div
            style={{ scale: centerScale }}
            className="absolute top-0 z-50 flex h-full w-full items-center justify-center"
          >
            {/* At scale=4 this div fills ~100vw × 100vh */}
            <div className="relative h-[25vh] w-[25vw] overflow-hidden bg-black flex items-center justify-center">
              <motion.div
                style={{ opacity: centerOpacity }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-[6px] p-[8px] text-center"
              >
                {centerContent}
              </motion.div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
