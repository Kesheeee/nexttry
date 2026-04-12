'use client';

import { motion } from 'framer-motion';
import { Compass, Mic, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/ui/language-context';

const offers = [
  {
    icon: Compass,
    title: 'GOLnext',
    subtitle: 'AI Mentor',
    description: 'Personalised career guidance powered by AI',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=350&fit=crop',
    href: '/explore/golnext',
    cta: 'Try GOLnext',
    accent: '#6c5ce7',     // purple
    accentBg: '#6c5ce7',
  },
  {
    icon: Mic,
    title: 'The Fourth Relationship',
    subtitle: 'Podcast',
    description: 'Real mentorship stories, real growth',
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=350&fit=crop',
    href: '/explore/podcast',
    cta: 'Listen Now',
    accent: '#e17055',     // coral
    accentBg: '#e17055',
  },
  {
    icon: Calendar,
    title: 'Programs & Events',
    subtitle: 'Community',
    description: 'Find your mentor. Build your path.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=350&fit=crop',
    href: '/explore/programs',
    cta: 'View Events',
    accent: '#00b894',     // teal
    accentBg: '#00b894',
  },
];

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export function WhatWeOffer() {
  const { t } = useLanguage();
  return (
    <section className="py-32 px-8">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="text-xs font-semibold uppercase tracking-widest text-primary mb-3"
          >
            {t('offer.label')}
          </motion.p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            {t('offer.heading').split(' ').map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-[0.3em]"
                initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05, ease }}
              >
                {word}
              </motion.span>
            ))}
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {offers.map((offer, i) => (
            <Link key={offer.title} href={offer.href} className="group block">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, delay: i * 0.15, ease }}
                className="rounded-3xl border border-border bg-background overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                {/* Image — zoom on hover */}
                <div className="overflow-hidden">
                  <motion.img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    initial={{ scale: 1.1, filter: 'blur(4px)' }}
                    whileInView={{ scale: 1, filter: 'blur(0px)' }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, delay: i * 0.15 + 0.1, ease }}
                  />
                </div>

                {/* Content — staggered reveal */}
                <div className="p-6 flex flex-col gap-4">
                  {/* Icon + subtitle */}
                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.15 + 0.2, ease }}
                    className="flex items-center gap-2.5"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${offer.accentBg}15` }}>
                      <offer.icon className="w-4 h-4" style={{ color: offer.accent }} strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {offer.subtitle}
                    </span>
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.15 + 0.3, ease }}
                    className="text-xl font-bold tracking-tight transition-colors duration-200"
                    whileHover={{ color: offer.accent }}
                  >
                    {offer.title}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.15 + 0.4, ease }}
                    className="text-sm text-muted-foreground leading-relaxed"
                  >
                    {offer.description}
                  </motion.p>

                  {/* Arrow link */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.15 + 0.5, ease }}
                    className="flex items-center gap-1.5 text-sm font-medium group-hover:gap-3 transition-all duration-200 mt-auto"
                    style={{ color: offer.accent }}
                  >
                    {offer.cta} <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
