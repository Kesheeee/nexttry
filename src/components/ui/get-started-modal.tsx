"use client"

import { useState, useEffect } from "react"
import { X, Check, Users, BookOpen } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { MeshGradient } from "@paper-design/shaders-react"

interface GetStartedModalProps {
  isOpen: boolean
  onClose: () => void
}

const LIFE_STAGES = [
  "Secondary School",
  "University",
  "Early Career",
  "Career Change",
  "Retired",
]

export function GetStartedModal({ isOpen, onClose }: GetStartedModalProps) {
  const [formStep, setFormStep] = useState<"idle" | "submitting" | "success">("idle")

  const handleClose = () => {
    onClose()
    setTimeout(() => setFormStep("idle"), 500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormStep("submitting")
    setTimeout(() => setFormStep("success"), 1500)
  }

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset"
    return () => { document.body.style.overflow = "unset" }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
            style={{ borderRadius: "24px" }}
            className="relative flex h-full w-full overflow-hidden sm:h-auto sm:max-h-[90vh] sm:max-w-5xl shadow-2xl"
          >
            {/* Mesh gradient — purple palette */}
            <div className="absolute inset-0 pointer-events-none">
              <MeshGradient
                speed={0.5}
                colors={["#6c5ce7", "#5a4ed4", "#3d2fa8", "#4834d4"]}
                distortion={0.7}
                swirl={0.12}
                grainMixer={0.12}
                grainOverlay={0}
                style={{ height: "100%", width: "100%" }}
              />
            </div>

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={handleClose}
              className="absolute right-4 top-4 sm:right-6 sm:top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </motion.button>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="relative z-10 flex flex-col lg:flex-row h-full w-full overflow-y-auto lg:overflow-hidden"
            >
              {/* ── Left: info + testimonial ── */}
              <div className="flex-1 flex flex-col justify-center p-8 sm:p-12 lg:p-14 gap-8 text-white">
                <div className="space-y-3">
                  <p className="font-pixel text-[9px] tracking-[0.25em] text-white/50 uppercase">
                    ── start your journey ──
                  </p>
                  <h2 className="font-pixel text-base sm:text-lg md:text-xl leading-relaxed">
                    Wherever you are —<br />NextTry is here.
                  </h2>
                  <p className="text-sm text-white/70 leading-relaxed max-w-xs">
                    Connect with mentors, explore programs, and take your next step with confidence.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                      <Users className="w-5 h-5 text-white/80" />
                    </div>
                    <div>
                      <h3 className="font-pixel text-[10px] text-white mb-1 tracking-wide">Find Your Mentor</h3>
                      <p className="text-white/60 text-xs leading-relaxed">
                        Real people who've walked your path. Ask questions, get honest answers.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                      <BookOpen className="w-5 h-5 text-white/80" />
                    </div>
                    <div>
                      <h3 className="font-pixel text-[10px] text-white mb-1 tracking-wide">Explore Programs</h3>
                      <p className="text-white/60 text-xs leading-relaxed">
                        Curated resources for every life stage — clear, simple, made for you.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/20">
                  <blockquote className="text-sm font-medium leading-relaxed text-white/90 mb-4">
                    "NextTry helped me figure out my next move when I felt completely stuck. Best decision I made."
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-violet-400 to-cyan-400 flex items-center justify-center text-sm font-bold text-white">
                      JL
                    </div>
                    <div>
                      <div className="font-pixel text-[9px] text-white tracking-wide">Jamie Lee</div>
                      <div className="text-xs text-white/50">Career changer, now thriving</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Right: form ── */}
              <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-14 bg-black/10 lg:bg-transparent">
                <div className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl">
                  {formStep === "success" ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center text-center py-12 space-y-5"
                    >
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                        <Check className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-pixel text-[11px] text-white mb-2 tracking-wide">You're in!</h3>
                        <p className="text-white/70 text-sm leading-relaxed">
                          We'll reach out soon to match you with the right mentor and resources.
                        </p>
                      </div>
                      <button
                        onClick={handleClose}
                        className="px-5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-xs font-pixel tracking-wide"
                      >
                        Back to Home
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <h3 className="font-pixel text-[11px] text-white mb-1 tracking-wide">Get Started</h3>
                        <p className="text-xs text-white/60">Tell us a little about yourself.</p>
                      </div>

                      <div>
                        <label htmlFor="gs-name" className="block text-[10px] font-pixel text-white/60 mb-1.5 uppercase tracking-wider">
                          Your Name
                        </label>
                        <input
                          required
                          type="text"
                          id="gs-name"
                          placeholder="Alex Kim"
                          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="gs-email" className="block text-[10px] font-pixel text-white/60 mb-1.5 uppercase tracking-wider">
                          Email
                        </label>
                        <input
                          required
                          type="email"
                          id="gs-email"
                          placeholder="you@example.com"
                          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="gs-stage" className="block text-[10px] font-pixel text-white/60 mb-1.5 uppercase tracking-wider">
                          Life Stage
                        </label>
                        <select
                          required
                          id="gs-stage"
                          defaultValue=""
                          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all text-sm appearance-none cursor-pointer"
                        >
                          <option value="" disabled className="bg-[#3d2fa8] text-white/40">
                            Where are you now?
                          </option>
                          {LIFE_STAGES.map((s) => (
                            <option key={s} value={s} className="bg-[#3d2fa8]">
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="gs-goal" className="block text-[10px] font-pixel text-white/60 mb-1.5 uppercase tracking-wider">
                          What's your next step?
                        </label>
                        <textarea
                          id="gs-goal"
                          rows={3}
                          placeholder="I'm trying to figure out..."
                          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all resize-none text-sm"
                        />
                      </div>

                      <button
                        disabled={formStep === "submitting"}
                        type="submit"
                        className="w-full flex items-center justify-center px-8 py-3.5 rounded-lg bg-white text-[#6c5ce7] font-pixel text-[10px] tracking-widest hover:bg-white/90 focus:ring-4 focus:ring-violet-400/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed uppercase"
                      >
                        {formStep === "submitting" ? (
                          <span className="flex items-center gap-2">
                            <span className="h-3 w-3 border-2 border-[#6c5ce7] border-t-transparent rounded-full animate-spin" />
                            Sending...
                          </span>
                        ) : (
                          "▶  Let's Go"
                        )}
                      </button>

                      <p className="text-[10px] text-center text-white/40">
                        No spam. No pressure. Just your next step.
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
