"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { useLanguage } from "@/components/ui/language-context";

function Hero() {
  const { t } = useLanguage();
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => [t('hero.confused'), t('hero.lost'), t('hero.stuck'), t('hero.overwhelmed'), t('hero.frustrated'), t('hero.unsure')],
    [t]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev + 1) % titles.length);
    }, 2200);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="relative w-full max-w-2xl mx-auto px-6 flex flex-col items-center gap-6 text-center">
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.15]">
        <div className="relative inline-flex justify-center overflow-hidden h-[1.2em] w-full">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={titleNumber}
              className="absolute"
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -40, filter: "blur(8px)" }}
              transition={{ type: "spring", stiffness: 80, damping: 16 }}
            >
              {titles[titleNumber]}
              <span className="text-primary">?</span>
            </motion.span>
          </AnimatePresence>
        </div>
        <span className="block">{t('hero.headline')}</span>
      </h1>

      <p className="text-base text-muted-foreground">{t('hero.subtitle')}</p>

      <Link href="/sign-in">
        <ButtonColorful label={t('hero.cta')} />
      </Link>

      <motion.button
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        className="mt-8 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:text-primary"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        aria-label="Scroll to explore"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.button>
    </div>
  );
}

export { Hero };
