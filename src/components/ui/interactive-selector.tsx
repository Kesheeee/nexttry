'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/components/ui/language-context';

interface Stage {
  title: string;
  tagline: string;
  image: string;
  accent: string;
}

function StageStrip({ stage, index }: { stage: Stage; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ height: '500px' }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${stage.image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#111',
        }}
      />

      {/* Dark overlay — fades in */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"
      />

      {/* Counter — top right */}
      <motion.span
        initial={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
        whileInView={{ opacity: 0.12, scale: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.05 }}
        className="absolute top-6 right-10 md:right-16 text-[120px] md:text-[180px] font-extrabold text-white leading-none select-none pointer-events-none"
      >
        {String(index + 1).padStart(2, '0')}
      </motion.span>

      {/* Title — slides up with blur */}
      <div className="absolute inset-0 flex flex-col justify-end p-10 md:p-16">
        <motion.h3
          initial={{ opacity: 0, y: 50, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1 + index * 0.03 }}
          className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2"
        >
          {stage.title}
        </motion.h3>

        {/* Tagline — fades in after title */}
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3 + index * 0.03 }}
          className="text-base md:text-lg text-white/70 font-medium"
        >
          {stage.tagline}
        </motion.p>

        {/* Animated underline */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.5 + index * 0.03 }}
          className="h-0.5 w-24 mt-4 origin-left"
          style={{ backgroundColor: stage.accent }}
        />
      </div>
    </motion.div>
  );
}

export function InteractiveSelector() {
  const { t } = useLanguage();

  const stages: Stage[] = [
    {
      title: t('stage.secondary'),
      tagline: t('stage.secondaryTag'),
      image: '/stages/secondary-school.jpg',
      accent: '#f39c12',  // amber
    },
    {
      title: t('stage.university'),
      tagline: t('stage.universityTag'),
      image: '/stages/university.jpg',
      accent: '#00b894',  // teal
    },
    {
      title: t('stage.earlyCareer'),
      tagline: t('stage.earlyCareerTag'),
      image: '/stages/early-career.jpg',
      accent: '#6c5ce7',  // purple (primary)
    },
    {
      title: t('stage.careerChange'),
      tagline: t('stage.careerChangeTag'),
      image: '/stages/career-change.jpg',
      accent: '#e17055',  // coral
    },
    {
      title: t('stage.retired'),
      tagline: t('stage.retiredTag'),
      image: '/stages/retired.jpg',
      accent: '#fab1a0',  // rose
    },
  ];

  return (
    <section id="life-stages" className="w-full">
      {/* 5 strips */}
      {stages.map((stage, index) => (
        <StageStrip key={stage.title} stage={stage} index={index} />
      ))}

      {/* Gradient bridge — dark strips to light background */}
      <div className="w-full h-32 bg-gradient-to-b from-[#111] to-background" />

      {/* Closing — orbiting bubbles */}
      <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-background -mt-32">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/15 blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-400/15 blur-[100px]" />
        </div>

        {/* Orbiting bubbles */}
        {stages.map((stage, i) => {
          const angle = (i / stages.length) * 360;
          const colors = stages.map(s => s.accent);
          const sizes = [44, 36, 40, 32, 38];
          const radius = 280;

          return (
            <motion.div
              key={stage.title}
              className="absolute"
              style={{ width: sizes[i], height: sizes[i] }}
              animate={{
                x: [
                  Math.cos((angle * Math.PI) / 180) * radius,
                  Math.cos(((angle + 360) * Math.PI) / 180) * radius,
                ],
                y: [
                  Math.sin((angle * Math.PI) / 180) * radius,
                  Math.sin(((angle + 360) * Math.PI) / 180) * radius,
                ],
              }}
              transition={{ duration: 20 + i * 3, repeat: Infinity, ease: 'linear' }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="relative group cursor-default"
              >
                <div
                  className="rounded-full shadow-lg"
                  style={{ width: sizes[i], height: sizes[i], backgroundColor: colors[i] }}
                />
                <div className="absolute left-1/2 -translate-x-1/2 -top-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <span className="text-xs font-semibold text-foreground whitespace-nowrap bg-background/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-border shadow-sm">
                    {stage.title}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Center text — words pop up one by one */}
        <div className="relative z-10 text-center px-8 max-w-xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
            <motion.span
              initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="inline-block"
            >
              {t('stage.closing')}&nbsp;
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-block"
            >
              you are&nbsp;
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block"
            >
              in life,&nbsp;
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30, filter: 'blur(6px)', scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35, type: 'spring', bounce: 0.3 }}
              className="inline-block text-primary"
            >
              {t('stage.closingBrand')}&nbsp;
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="inline-block"
            >
              {t('stage.closingEnd')}
            </motion.span>
          </h2>
        </div>
      </div>
    </section>
  );
}
