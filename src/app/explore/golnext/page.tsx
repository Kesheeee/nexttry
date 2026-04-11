'use client';

import { useSession } from 'next-auth/react';
import { Navbar } from "@/components/ui/navbar";
import { Sidebar } from "@/components/ui/sidebar";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import { DotBackground } from "@/components/ui/dot-background";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect } from "react";
import { Sparkles, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/ui/language-context";

// suggestions moved inside component to use t()

export default function GOLnextPage() {
  const { data: session } = useSession();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const suggestions = [t('gol.sug1'), t('gol.sug2'), t('gol.sug3'), t('gol.sug4')];

  interface Message { id: string; role: 'user' | 'assistant'; content: string; createdAt: Date; }
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasStarted = messages.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: message, createdAt: new Date() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error('API error');

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      const assistantId = (Date.now() + 1).toString();

      // Add empty assistant message
      setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '', createdAt: new Date() }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            if ((parsed.type === 'text-delta' || parsed.type === 'text') && (parsed.delta || parsed.textDelta)) {
              assistantContent += parsed.delta || parsed.textDelta || '';
              setMessages(prev =>
                prev.map(m => m.id === assistantId ? { ...m, content: assistantContent } : m)
              );
            }
            // Handle error from API
            if (parsed.type === 'error' && parsed.errorText) {
              assistantContent = "I'm having trouble connecting right now. Please try again in a moment.";
              setMessages(prev =>
                prev.map(m => m.id === assistantId ? { ...m, content: assistantContent } : m)
              );
            }
          } catch {}
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I couldn't process that right now. Please try again.",
        createdAt: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const firstName = session?.user?.name?.split(' ')[0] || '';

  return (
    <>
      <Navbar />
      {session?.user && <Sidebar />}
      <main className="min-h-screen flex flex-col relative overflow-hidden transition-all duration-300">
        <DotBackground />

        <div className="relative z-10 flex-1 flex flex-col w-full max-w-2xl mx-auto px-8">

          {/* Title — shrinks after first message */}
          {!hasStarted && (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                {firstName ? `Hi ${firstName}, ` : ''}{t('gol.greeting')}
              </h1>

              {/* Input */}
              <div className="w-full">
                <PromptInputBox
                  placeholder={t('gol.placeholder')}
                  onSend={handleSend}
                />
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="text-xs font-medium px-4 py-2 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {hasStarted && (
            <div className="flex-1 overflow-y-auto flex flex-col gap-6 pt-24 pb-40">
              {messages.map((msg, i) => (
                msg.role === 'assistant' ? (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div className="max-w-[85%]">
                      <div className="rounded-3xl rounded-tl-lg bg-background border border-border px-6 py-4 text-sm leading-relaxed shadow-sm">
                        <div
                          className="whitespace-pre-wrap [&>strong]:font-bold [&>h2]:text-base [&>h2]:font-bold [&>h2]:mt-4 [&>h2]:mb-2 prose-headings:text-foreground"
                          dangerouslySetInnerHTML={{
                            __html: msg.content
                              .replace(/## (.*?)(\n|$)/g, '<h2>$1</h2>')
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\n/g, '<br/>')
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-3 mt-2 ml-2">
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <button
                          onClick={() => handleCopy(msg.content.replace(/\*\*/g, ''), i)}
                          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {copiedIndex === i ? <><Check className="w-3 h-3 text-emerald-500" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-3 justify-end"
                  >
                    <div className="max-w-[75%]">
                      <div className="rounded-3xl rounded-tr-lg bg-primary text-primary-foreground px-6 py-3.5 text-sm leading-relaxed shadow-sm">
                        {msg.content}
                      </div>
                    </div>
                    {session?.user?.image && (
                      <img src={session.user.image} alt="" className="w-8 h-8 rounded-xl object-cover shrink-0 mt-0.5" />
                    )}
                  </motion.div>
                )
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div className="rounded-2xl rounded-bl-md bg-muted/50 border border-border px-5 py-3.5">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0s' }} />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0.15s' }} />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0.3s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>
          )}

        </div>

        {/* Fixed bottom input — after first message */}
        <AnimatePresence>
          {hasStarted && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed bottom-0 left-0 right-0 z-20"
            >
              <div className="max-w-2xl mx-auto px-8 pb-6 pt-4 bg-gradient-to-t from-background via-background to-transparent">
                <PromptInputBox
                  placeholder={t('gol.followUp')}
                  onSend={handleSend}
                  isLoading={isLoading}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
