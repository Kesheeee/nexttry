'use client';

import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { useLanguage } from '@/components/ui/language-context';

const logos = [
  {
    id: 'google',
    name: 'Google',
    image: 'https://www.shadcnblocks.com/images/block/logos/google-icon.svg',
  },
  {
    id: 'github',
    name: 'GitHub',
    image: 'https://www.shadcnblocks.com/images/block/logos/github-icon.svg',
  },
  {
    id: 'figma',
    name: 'Figma',
    image: 'https://www.shadcnblocks.com/images/block/logos/figma.svg',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    image: 'https://www.shadcnblocks.com/images/block/logos/nextjs.svg',
  },
  {
    id: 'vercel',
    name: 'Vercel',
    image: 'https://www.shadcnblocks.com/images/block/logos/vercel.svg',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    image: 'https://www.shadcnblocks.com/images/block/logos/supabase.svg',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    image: 'https://www.shadcnblocks.com/images/block/logos/stripe.svg',
  },
  {
    id: 'notion',
    name: 'Notion',
    image: 'https://www.shadcnblocks.com/images/block/logos/notion.svg',
  },
];

export function LogosSlider() {
  const { t } = useLanguage();

  return (
    <section className="py-12">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-12">
        {t('logos.trusted')}
      </p>
      <div className="relative h-[60px] w-full overflow-hidden">
        <InfiniteSlider className="flex h-full w-full items-center" duration={90} gap={56}>
          {[...logos, ...logos].map((logo, i) => (
            <div key={`${logo.id}-${i}`} className="flex items-center justify-center shrink-0 w-28">
              <img
                src={logo.image}
                alt={logo.name}
                className="h-7 w-auto opacity-40 hover:opacity-70 transition-opacity duration-300"
              />
            </div>
          ))}
        </InfiniteSlider>
        <ProgressiveBlur
          className="pointer-events-none absolute top-0 left-0 h-full w-[200px]"
          direction="left"
          blurIntensity={1}
        />
        <ProgressiveBlur
          className="pointer-events-none absolute top-0 right-0 h-full w-[200px]"
          direction="right"
          blurIntensity={1}
        />
      </div>
    </section>
  );
}
