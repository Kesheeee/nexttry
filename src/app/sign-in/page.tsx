'use client';

import { SignInPage, Testimonial } from '@/components/ui/sign-in';
import { Navbar } from '@/components/ui/navbar';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const testimonials: Testimonial[] = [
  {
    avatarSrc: 'https://randomuser.me/api/portraits/women/57.jpg',
    name: 'Sarah Chen',
    handle: '@sarahdigital',
    text: 'NextTry helped me figure out my next move when I felt completely stuck. Best decision I made.',
  },
  {
    avatarSrc: 'https://randomuser.me/api/portraits/men/64.jpg',
    name: 'Marcus Johnson',
    handle: '@marcustech',
    text: 'From career change to thriving — NextTry connected me with the right mentors at the right time.',
  },
  {
    avatarSrc: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'David Martinez',
    handle: '@davidcreates',
    text: 'Clear, simple, and made for you. That tagline is real — NextTry actually delivers.',
  },
];

export default function SignInRoute() {
  const router = useRouter();

  return (
    <div className="bg-background text-foreground">
      <Navbar minimal />
      <SignInPage
        heroImageSrc="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=2160&q=80"
        testimonials={testimonials}
        onSignIn={(e) => {
          e.preventDefault();
          router.push('/dashboard');
        }}
        onGoogleSignIn={() => {
          signIn('google', { callbackUrl: '/dashboard' });
        }}
        onResetPassword={() => {}}
        onCreateAccount={() => router.push('/create-account')}
      />
    </div>
  );
}
