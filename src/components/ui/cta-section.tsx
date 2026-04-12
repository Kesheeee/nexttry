'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import { useLanguage } from '@/components/ui/language-context';

export function CTASection() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Parallax glow orbs
  const glowY1 = useTransform(scrollYProgress, [0, 1], ['-30%', '30%']);
  const glowY2 = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);

  return (
    <section ref={ref} className="py-32 px-8 relative overflow-hidden">
      {/* Parallax glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{ y: glowY1, backgroundColor: 'rgba(108, 92, 231, 0.15)' }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full blur-[90px]"
          style={{ y: glowY2, backgroundColor: 'rgba(225, 112, 85, 0.12)' }}
        />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full blur-[80px]" style={{ backgroundColor: 'rgba(0, 184, 148, 0.08)' }} />
      </div>

      <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
        {/* Heading — word by word */}
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
          {t('cta.heading').split(' ').map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.3em]"
              initial={{ opacity: 0, y: 40, filter: 'blur(8px)', rotateX: 45 }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', rotateX: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {word}
            </motion.span>
          ))}
        </h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-muted-foreground text-lg max-w-lg"
        >
          {t('cta.subtitle')}
        </motion.p>

        {/* Button — slides up with scale */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: 0.55,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <Link
            href="/sign-in"
            className="inline-block rounded-full bg-foreground text-background px-8 py-4 text-sm font-medium hover:opacity-80 active:scale-[0.97] transition-all duration-200"
          >
            {t('cta.button')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
