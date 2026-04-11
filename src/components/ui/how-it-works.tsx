'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, Users, ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { useLanguage } from '@/components/ui/language-context';

const stepIcons = [Search, Users, ArrowRight];
const stepAccents = ['#00b894', '#f39c12', '#e17055'];

// Split text into characters for staggered reveal
function SplitText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{
            duration: 0.4,
            delay: delay + i * 0.02,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

export function HowItWorks() {
  const { t } = useLanguage();
  const steps = [
    { icon: stepIcons[0], number: '01', title: t('how.step1'), description: t('how.step1Desc'), accent: stepAccents[0] },
    { icon: stepIcons[1], number: '02', title: t('how.step2'), description: t('how.step2Desc'), accent: stepAccents[1] },
    { icon: stepIcons[2], number: '03', title: t('how.step3'), description: t('how.step3Desc'), accent: stepAccents[2] },
  ];
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Connecting line draws as you scroll
  const lineScaleX = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);

  return (
    <section ref={sectionRef} className="py-32 px-8 relative overflow-hidden">
      {/* Subtle glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-primary/8 blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Section label — slides up */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-xs font-semibold uppercase tracking-widest text-primary mb-3"
          >
            {t('how.label')}
          </motion.p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            <SplitText text={t('how.heading')} />
          </h2>
        </div>

        {/* Steps */}
        <div className="relative grid md:grid-cols-3 gap-12">
          {/* Connecting line — draws on scroll */}
          <motion.div
            className="hidden md:block absolute top-8 left-[16.67%] right-[16.67%] h-px origin-left"
            style={{ background: 'linear-gradient(to right, #00b894, #f39c12, #e17055)', scaleX: lineScaleX }}
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 60, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: i * 0.2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="relative flex flex-col gap-4 text-center items-center"
            >
              {/* Icon circle — scales up */}
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.2 + 0.1,
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                }}
                className="w-16 h-16 rounded-full border-2 bg-background flex items-center justify-center z-10"
                style={{ borderColor: `${step.accent}33` }}
              >
                <step.icon className="w-6 h-6" style={{ color: step.accent }} strokeWidth={1.5} />
              </motion.div>

              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.4, delay: i * 0.2 + 0.2 }}
                className="text-xs font-bold tracking-widest"
                style={{ color: step.accent }}
              >
                {step.number}
              </motion.span>

              <h3 className="text-xl font-bold tracking-tight">{step.title}</h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: i * 0.2 + 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-sm text-muted-foreground leading-relaxed max-w-xs"
              >
                {step.description}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
