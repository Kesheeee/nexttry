'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';

interface FooterLink {
  title: string;
  href: string;
}

interface FooterSection {
  label: string;
  links: FooterLink[];
}

const footerLinks: FooterSection[] = [
  {
    label: 'Explore',
    links: [
      { title: 'GOLnext',  href: '/explore/golnext'  },
      { title: 'Podcast',  href: '/explore/podcast'  },
      { title: 'Programs', href: '/explore/programs' },
    ],
  },
  {
    label: 'Company',
    links: [
      { title: 'Our Story',      href: '/about'          },
      { title: 'Team',           href: '/about/team'     },
      { title: 'Contact',        href: '/about/contact'  },
      { title: 'Privacy Policy', href: '/privacy'        },
    ],
  },
  {
    label: 'Resources',
    links: [
      { title: 'Blog',             href: '/blog'       },
      { title: 'Mentorship',       href: '/mentorship' },
      { title: 'Help',             href: '/help'       },
      { title: 'Terms of Service', href: '/terms'      },
    ],
  },
  {
    label: 'Social',
    links: [
      { title: 'Instagram', href: 'https://www.instagram.com/nexttry.hk' },
      { title: 'LinkedIn',  href: 'https://linkedin.com/company/nexttry' },
    ],
  },
];

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export function Footer() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <footer className="relative w-full flex flex-col items-center justify-center bg-background border-t border-border px-8 py-12 lg:py-16 overflow-hidden">
      {/* Top glow line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease }}
        className="bg-foreground/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur origin-center"
      />

      <div className="grid w-full max-w-7xl mx-auto gap-8 xl:grid-cols-3 xl:gap-8">
        {/* Brand — slides up */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 24, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="space-y-4"
        >
          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            className="text-muted-foreground text-sm leading-relaxed max-w-xs"
          >
            Wherever you are in life — NextTry is here. Every stage. Every question. Every next step.
          </motion.p>
          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease }}
            className="text-muted-foreground text-sm"
          >
            © {new Date().getFullYear()} NextTry. All rights reserved.
          </motion.p>
        </motion.div>

        {/* Links grid — stagger left to right */}
        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
          {footerLinks.map((section, sectionIndex) => (
            <motion.div
              key={section.label}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + sectionIndex * 0.1, ease }}
              className="mb-10 md:mb-0"
            >
              {/* Section heading */}
              <motion.h3
                initial={shouldReduceMotion ? {} : { opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15 + sectionIndex * 0.1, ease }}
                className="text-xs font-semibold text-foreground tracking-widest uppercase"
              >
                {section.label}
              </motion.h3>

              {/* Links — each staggers in */}
              <ul className="text-muted-foreground mt-4 space-y-2.5 text-sm">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.title}
                    initial={shouldReduceMotion ? {} : { opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.35,
                      delay: 0.2 + sectionIndex * 0.1 + linkIndex * 0.05,
                      ease,
                    }}
                  >
                    <Link
                      href={link.href}
                      target={link.href.startsWith('https') ? '_blank' : undefined}
                      rel={link.href.startsWith('https') ? 'noopener noreferrer' : undefined}
                      className="hover:text-primary inline-flex items-center gap-1.5 transition-colors duration-200"
                    >
                      {link.title}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </footer>
  );
}
