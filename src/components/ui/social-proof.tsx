"use client";

import { motion } from "motion/react";
import { useLanguage } from '@/components/ui/language-context';

const testimonials = [
  {
    text: "NextTry helped me see what I actually wanted — not just what I thought I should do.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Michelle Lam",
    role: "Early career, age 26",
    accent: "#6c5ce7",
  },
  {
    text: "I had no idea what I wanted after university. NextTry didn't just give me a mentor — it gave me a mirror.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "David Chan",
    role: "University graduate",
    accent: "#00b894",
  },
  {
    text: "The podcast made me realise I wasn't alone in feeling stuck. That was enough to take the first step.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Sarah Wong",
    role: "Career changer, age 34",
    accent: "#e17055",
  },
  {
    text: "GOLnext gave me clarity I couldn't find anywhere else. It felt like someone finally understood my situation.",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    name: "Jason Ho",
    role: "Secondary school student",
    accent: "#f39c12",
  },
  {
    text: "I thought retirement meant slowing down. NextTry showed me it's actually a fresh start.",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    name: "Raymond Ng",
    role: "Retired, age 62",
    accent: "#fab1a0",
  },
  {
    text: "The mentors here don't just give advice — they listen. That's what made the difference for me.",
    image: "https://randomuser.me/api/portraits/women/21.jpg",
    name: "Angie Tsang",
    role: "Early career, age 24",
    accent: "#6c5ce7",
  },
  {
    text: "I was overwhelmed by choices after school. NextTry helped me narrow it down to what truly matters.",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    name: "Kevin Yip",
    role: "University student",
    accent: "#00b894",
  },
  {
    text: "Changing careers at 40 felt impossible. The community here proved me wrong.",
    image: "https://randomuser.me/api/portraits/women/36.jpg",
    name: "Fiona Cheung",
    role: "Career changer, age 41",
    accent: "#e17055",
  },
  {
    text: "Every stage of life has its own kind of confusion. NextTry meets you exactly where you are.",
    image: "https://randomuser.me/api/portraits/men/64.jpg",
    name: "Marcus Lee",
    role: "Mentor at NextTry",
    accent: "#f39c12",
  },
];

const ease = [0.25, 0.46, 0.45, 0.94] as const;

function MarqueeRow({ items, direction = "left", duration = 40 }: { items: typeof testimonials; direction?: "left" | "right"; duration?: number }) {
  const doubled = [...items, ...items];

  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <motion.div
        className="flex gap-5 shrink-0"
        animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity, repeatType: "loop" }}
      >
        {doubled.map((t, i) => (
          <div
            key={`${t.name}-${i}`}
            className="shrink-0 w-[340px] rounded-2xl border border-border bg-background p-6 flex flex-col gap-4 hover:shadow-lg transition-all duration-300"
            style={{ borderLeft: `3px solid ${t.accent}` }}
          >
            <p className="text-sm text-foreground leading-relaxed">{t.text}</p>
            <div className="flex items-center gap-3 mt-auto">
              <img src={t.image} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
              <div>
                <p className="text-sm font-semibold text-foreground leading-tight">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function SocialProof() {
  const { t } = useLanguage();
  const row1 = testimonials.slice(0, 5);
  const row2 = testimonials.slice(4, 9);

  return (
    <section className="bg-background relative py-24 overflow-hidden">
      <div className="max-w-5xl mx-auto px-8 mb-12">
        <div className="flex flex-col items-center justify-center max-w-[540px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="border py-1 px-4 rounded-lg text-xs font-semibold uppercase tracking-widest text-primary"
          >
            {t('social.label')}
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-5">
            {t('social.heading').split(' ').map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-[0.3em]"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.06, ease }}
              >
                {word}
              </motion.span>
            ))}
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4, ease }}
            className="mt-4 text-muted-foreground"
          >
            {t('social.subtitle')}
          </motion.p>
        </div>
      </div>

      {/* Two rows scrolling in opposite directions */}
      <div className="flex flex-col gap-5">
        <MarqueeRow items={row1} direction="left" duration={60} />
        <MarqueeRow items={row2} direction="right" duration={70} />
      </div>
    </section>
  );
}
