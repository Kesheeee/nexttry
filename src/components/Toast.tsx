"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Toast = { id: number; text: string };
const ToastContext = createContext<{ push: (text: string) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);
  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto bg-primary text-primary-foreground text-sm px-4 py-2 rounded-full shadow-md"
          >
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { push: (_: string) => {} };
  }
  return ctx;
}

export function useToastAfterMount(text: string | undefined) {
  const { push } = useToast();
  useEffect(() => {
    if (text) push(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
