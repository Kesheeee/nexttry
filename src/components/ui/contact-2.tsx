'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface Contact2Props {
  title?: string;
  description?: string;
  email?: string;
}

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <motion.div
      className="lg:w-3/5"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
    >
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center gap-4 py-16 text-center"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Message sent!</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Thank you for reaching out. We'll get back to you as soon as possible.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="text-sm font-medium text-primary hover:underline mt-2"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-firstname" className="text-sm font-medium text-foreground">
                First Name <span className="text-primary">*</span>
              </label>
              <div className="border-b border-border focus-within:border-primary transition-colors">
                <input id="contact-firstname" name="firstname" type="text" required className="w-full bg-transparent text-sm py-2 focus:outline-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-lastname" className="text-sm font-medium text-foreground">
                Last Name <span className="text-primary">*</span>
              </label>
              <div className="border-b border-border focus-within:border-primary transition-colors">
                <input id="contact-lastname" name="lastname" type="text" required className="w-full bg-transparent text-sm py-2 focus:outline-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-email" className="text-sm font-medium text-foreground">
                Email <span className="text-primary">*</span>
              </label>
              <div className="border-b border-border focus-within:border-primary transition-colors">
                <input id="contact-email" name="email" type="email" required className="w-full bg-transparent text-sm py-2 focus:outline-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-source" className="text-sm font-medium text-foreground">
                Where did you hear about us?
              </label>
              <div className="border-b border-border focus-within:border-primary transition-colors">
                <select id="contact-source" name="source" defaultValue="" className="w-full bg-transparent text-sm py-2 focus:outline-none text-muted-foreground cursor-pointer">
                  <option value="" disabled>Please Select</option>
                  <option value="friend">Friend / Word of mouth</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="search">Search engine</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-message" className="text-sm font-medium text-foreground">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={3}
                className="w-full bg-transparent text-sm pt-2 focus:outline-none resize-none border-b border-border focus:border-primary transition-colors"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-32 rounded-full bg-primary text-primary-foreground py-3 text-sm font-semibold hover:bg-primary/90 active:scale-[0.97] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Submit
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export const Contact2 = ({
  title = "How can we help you?",
  description = "Thank you for your interest in NextTry. Please use this form to contact us. We will get back to you as soon as we can.",
  email = "hello@nexttry.hk",
}: Contact2Props) => {
  return (
    <section className="min-h-screen flex items-center py-24 relative overflow-hidden">

      {/* Aurora glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/25 blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-400/25 blur-[90px]" />
      </div>

      <div className="relative mx-auto w-full max-w-4xl px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16 lg:items-start">

          {/* Left */}
          <motion.div
            className="lg:w-2/5 flex flex-col gap-6 lg:pt-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
              {title}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {description}
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Email</span>
              <a href={`mailto:${email}`} className="text-foreground hover:text-primary transition-colors font-medium">
                {email}
              </a>
            </div>
          </motion.div>

          {/* Right — form */}
          <ContactForm />
        </div>
      </div>
    </section>
  );
};
