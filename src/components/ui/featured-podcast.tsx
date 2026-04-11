'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export function FeaturedPodcast() {
  return (
    <section className="py-24 px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-border overflow-hidden flex flex-col md:flex-row"
        >
          {/* Left — cover placeholder */}
          <div className="md:w-2/5 bg-primary/10 flex items-center justify-center p-16 md:p-20 min-h-[300px]">
            <div className="flex flex-col items-center gap-5">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center group cursor-pointer hover:bg-primary/30 transition-colors">
                <Play className="w-10 h-10 text-primary ml-1" fill="currentColor" strokeWidth={0} />
              </div>
              <span className="text-sm font-bold text-primary tracking-wide">Podcast</span>
            </div>
          </div>

          {/* Right — info */}
          <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center gap-5 bg-background">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Featured Episode</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              The Fourth Relationship
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Beyond family, friends, and romantic partners — there's a fourth kind of relationship that shapes who you become.
              Real conversations about mentorship, identity, and the people who change your direction.
            </p>
            <a
              href="#"
              className="mt-2 w-fit flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all duration-200"
            >
              Listen now <span className="text-lg">→</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
