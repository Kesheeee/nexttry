'use client';

import { motion, type Variants } from 'framer-motion';

const stages = [
  {
    id: '01',
    label: 'Secondary School',
    subtitle: 'Finding direction',
    tagline: 'Figuring out who you want to become',
    body: 'Before the big decisions, NextTry helps you explore what excites you, connect with mentors, and start building your story early.',
    image: '/stages/secondary-school.jpg',
    imageAlt: 'Teenage student finding their path',
  },
  {
    id: '02',
    label: 'University',
    subtitle: 'Building identity',
    tagline: 'More choices, less clarity',
    body: "Internships, majors, opportunities — NextTry helps you cut through the noise and find real people who've walked your path.",
    image: '/stages/university.jpg',
    imageAlt: 'University student with backpack and books',
  },
  {
    id: '03',
    label: 'Early Career',
    subtitle: 'First steps',
    tagline: 'Starting out and standing out',
    body: 'The job title is new but the questions are real. NextTry connects you to mentors, tools, and communities that help you grow faster.',
    image: '/stages/early-career.jpg',
    imageAlt: 'Young professional thinking about the next move',
  },
  {
    id: '04',
    label: 'Career Change',
    subtitle: 'New chapter',
    tagline: 'Brave enough to start over',
    body: 'Switching paths takes courage. NextTry helps you understand what you truly bring, find your footing, and move forward with confidence.',
    image: '/stages/career-change.jpg',
    imageAlt: 'Confident professional ready for a new chapter',
  },
  {
    id: '05',
    label: 'Retired',
    subtitle: 'Still growing',
    tagline: 'A lifetime of wisdom, still unfolding',
    body: "Growth doesn't stop. NextTry helps you give back as a mentor, explore new purpose, and stay connected to what matters.",
    image: '/stages/retired.jpg',
    imageAlt: 'Wise elder with a lifetime of experience',
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

export function LifeStages() {
  return (
    <section className="bg-background py-24 px-6">
      {/* Section header */}
      <motion.div
        className="max-w-5xl mx-auto text-center mb-20"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-pixel text-[9px] tracking-[0.25em] text-spektr-cyan-50 mb-5 uppercase">
          ── Choose your stage ──
        </p>
        <h2 className="font-pixel text-base sm:text-lg md:text-xl leading-relaxed text-black dark:text-white">
          Where are you now?
        </h2>
      </motion.div>

      {/* Stage cards */}
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.id}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className={`flex flex-col md:flex-row overflow-hidden border-[3px] border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.85)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)] ${
              index % 2 === 1 ? 'md:flex-row-reverse' : ''
            }`}
          >
            {/* Image */}
            <div className="md:w-[45%] aspect-[4/3] md:aspect-auto overflow-hidden">
              <img
                src={stage.image}
                alt={stage.imageAlt}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Text */}
            <div className="md:w-[55%] bg-card flex flex-col justify-center gap-5 p-8 lg:p-12">
              {/* Stage badge */}
              <div className="flex items-center gap-3">
                <span className="font-pixel text-[9px] tracking-widest text-spektr-cyan-50 uppercase">
                  Stage {stage.id}
                </span>
                <div className="flex-1 h-px bg-black/15 dark:bg-white/15" />
              </div>

              {/* Heading */}
              <div>
                <h3 className="font-pixel text-sm md:text-base leading-relaxed text-foreground mb-2">
                  {stage.label}
                </h3>
                <p className="font-pixel text-[10px] text-muted-foreground tracking-wide uppercase">
                  {stage.subtitle}
                </p>
              </div>

              {/* Pixel divider */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-[3px] w-[3px] bg-foreground opacity-30" />
                ))}
              </div>

              {/* Tagline */}
              <p className="font-pixel text-[10px] leading-loose text-black/75 dark:text-white/75">
                {stage.tagline}
              </p>

              {/* Body copy — readable font intentional */}
              <p className="text-sm leading-relaxed text-muted-foreground">{stage.body}</p>
            </div>
          </motion.div>
        ))}

        {/* Closing statement */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="border-[3px] border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.85)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)] bg-foreground p-12 md:p-20 text-center"
        >
          <p className="font-pixel text-[9px] tracking-[0.3em] text-spektr-cyan-50 mb-8 uppercase">
            ── Final stage ──
          </p>
          <h2 className="font-pixel text-sm sm:text-base md:text-lg text-background leading-loose mb-6">
            Wherever you are in life —<br />
            NextTry is here.
          </h2>
          <p className="font-pixel text-[10px] text-background/60 leading-loose tracking-widest">
            Every stage.&nbsp;&nbsp;&nbsp;Every question.&nbsp;&nbsp;&nbsp;Every next step.
          </p>
          <span className="animate-blink inline-block mt-8 font-pixel text-lg text-spektr-cyan-50">
            █
          </span>
        </motion.div>
      </div>
    </section>
  );
}
