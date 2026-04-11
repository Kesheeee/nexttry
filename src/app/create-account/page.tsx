'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Navbar } from '@/components/ui/navbar';
import { Eye, EyeOff, GraduationCap, BookOpen, Briefcase, RefreshCw, Heart, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-1.341-.138-2.65-.389-3.917z" />
  </svg>
);

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-primary/70 focus-within:bg-primary/10">
    {children}
  </div>
);

const stages = [
  { value: 'secondary', label: 'Secondary School', icon: GraduationCap, accent: '#f39c12' },
  { value: 'university', label: 'University', icon: BookOpen, accent: '#00b894' },
  { value: 'early-career', label: 'Early Career', icon: Briefcase, accent: '#6c5ce7' },
  { value: 'career-change', label: 'Career Change', icon: RefreshCw, accent: '#e17055' },
  { value: 'retired', label: 'Retired', icon: Heart, accent: '#fab1a0' },
];

export default function CreateAccountPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar minimal />

      <div className="flex items-center justify-center min-h-screen px-8 pt-16">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Brand */}
          <span className="text-lg font-semibold text-primary mb-6 block">NextTry</span>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-2">
                  <span className="font-light text-foreground tracking-tighter">Create your account</span>
                </h1>
                <p className="text-muted-foreground mb-6">
                  Join NextTry and start your journey — wherever you are in life.
                </p>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label htmlFor="first-name" className="text-sm font-medium text-muted-foreground">First Name</label>
                      <GlassInputWrapper>
                        <input
                          id="first-name"
                          name="firstName"
                          type="text"
                          required
                          placeholder="First name"
                          className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-inset"
                        />
                      </GlassInputWrapper>
                    </div>
                    <div className="flex-1">
                      <label htmlFor="last-name" className="text-sm font-medium text-muted-foreground">Last Name</label>
                      <GlassInputWrapper>
                        <input
                          id="last-name"
                          name="lastName"
                          type="text"
                          required
                          placeholder="Last name"
                          className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-inset"
                        />
                      </GlassInputWrapper>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="signup-email" className="text-sm font-medium text-muted-foreground">Email Address</label>
                    <GlassInputWrapper>
                      <input
                        id="signup-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="Enter your email address"
                        className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-inset"
                      />
                    </GlassInputWrapper>
                  </div>

                  <div>
                    <label htmlFor="signup-password" className="text-sm font-medium text-muted-foreground">Password</label>
                    <GlassInputWrapper>
                      <div className="relative">
                        <input
                          id="signup-password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          minLength={8}
                          autoComplete="new-password"
                          placeholder="Create a password (min 8 characters)"
                          className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-inset"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          className="absolute inset-y-0 right-3 flex items-center focus-visible:outline-none focus-visible:text-primary"
                        >
                          {showPassword
                            ? <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                            : <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />}
                        </button>
                      </div>
                    </GlassInputWrapper>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-primary py-4 font-medium text-sm text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    Continue
                  </button>
                </form>

                <div className="relative flex items-center justify-center my-6">
                  <span className="w-full border-t border-border" />
                  <span className="px-4 text-sm text-muted-foreground bg-background absolute">Or</span>
                </div>

                <button
                  onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                  className="w-full flex items-center justify-center gap-3 border border-border rounded-2xl py-4 hover:bg-secondary transition-colors text-sm"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>

                <p className="text-center text-sm text-muted-foreground mt-6">
                  Already have an account?{' '}
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); router.push('/sign-in'); }}
                    className="text-primary hover:underline transition-colors"
                  >
                    Sign In
                  </a>
                </p>
              </motion.div>
            ) : (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-2">
                  <span className="font-light text-foreground tracking-tighter">Where are you in life?</span>
                </h1>
                <p className="text-muted-foreground mb-8">
                  This helps us personalise your experience. You can change this anytime.
                </p>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-3">
                    {stages.map((stage) => {
                      const isSelected = selectedStage === stage.value;
                      return (
                        <button
                          key={stage.value}
                          type="button"
                          onClick={() => setSelectedStage(stage.value)}
                          className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl border text-left transition-all duration-200 ${
                            isSelected ? 'border-transparent shadow-md' : 'border-border hover:border-muted-foreground/20 hover:bg-muted/50'
                          }`}
                          style={isSelected ? { borderColor: stage.accent, backgroundColor: `${stage.accent}10` } : {}}
                        >
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${stage.accent}${isSelected ? '20' : '10'}` }}
                          >
                            <stage.icon className="w-5 h-5" style={{ color: stage.accent }} strokeWidth={1.5} />
                          </div>
                          <span className="text-sm font-semibold text-foreground">{stage.label}</span>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute right-4 w-6 h-6 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: stage.accent }}
                            >
                              <Check className="w-3.5 h-3.5 text-white" />
                            </motion.div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 rounded-2xl border border-border py-4 font-medium text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!selectedStage}
                      className="flex-1 rounded-2xl bg-primary py-4 font-medium text-sm text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      Get Started
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Skip for now
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
