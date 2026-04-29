"use client";

import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowUp, Paperclip, Square, X, StopCircle, Mic, Globe, BrainCog, FolderCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

// Textarea
const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex w-full rounded-md border-none bg-transparent px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] resize-none",
        className
      )}
      ref={ref}
      rows={1}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

// Tooltip
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground shadow-md animate-in fade-in-0 zoom-in-95",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = "TooltipContent";

// Dialog
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className)}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-[90vw] md:max-w-[800px] translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-0 shadow-xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-2xl",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 z-10 rounded-full bg-muted p-2 hover:bg-muted/80 transition-all">
        <X className="h-5 w-5 text-foreground" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props} />
));
DialogTitle.displayName = "DialogTitle";

// VoiceRecorder
const VoiceRecorder: React.FC<{
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: (duration: number) => void;
  visualizerBars?: number;
}> = ({ isRecording, onStartRecording, onStopRecording, visualizerBars = 32 }) => {
  const [time, setTime] = React.useState(0);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  React.useEffect(() => {
    if (isRecording) {
      onStartRecording();
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      onStopRecording(time);
      setTime(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className={cn("flex flex-col items-center justify-center w-full transition-all duration-300 py-3", isRecording ? "opacity-100" : "opacity-0 h-0")}>
      <div className="flex items-center gap-2 mb-3">
        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        <span className="font-mono text-sm text-foreground/80">{formatTime(time)}</span>
      </div>
      <div className="w-full h-10 flex items-center justify-center gap-0.5 px-4">
        {[...Array(visualizerBars)].map((_, i) => (
          <div key={i} className="w-0.5 rounded-full bg-primary/50 animate-pulse" style={{ height: `${Math.max(15, Math.random() * 100)}%`, animationDelay: `${i * 0.05}s`, animationDuration: `${0.5 + Math.random() * 0.5}s` }} />
        ))}
      </div>
    </div>
  );
};

// ImageViewDialog
const ImageViewDialog: React.FC<{ imageUrl: string | null; onClose: () => void }> = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;
  return (
    <Dialog open={!!imageUrl} onOpenChange={onClose}>
      <DialogContent className="p-0 border-none bg-transparent shadow-none">
        <DialogTitle className="sr-only">Image Preview</DialogTitle>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-background rounded-2xl overflow-hidden shadow-2xl">
          <img src={imageUrl} alt="Preview" className="w-full max-h-[80vh] object-contain rounded-2xl" />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

// PromptInput Context
interface PromptInputContextType { isLoading: boolean; value: string; setValue: (v: string) => void; maxHeight: number | string; onSubmit?: () => void; disabled?: boolean; }
const PromptInputContext = React.createContext<PromptInputContextType>({ isLoading: false, value: "", setValue: () => {}, maxHeight: 240 });
function usePromptInput() { return React.useContext(PromptInputContext); }

const PromptInput = React.forwardRef<HTMLDivElement, {
  className?: string; isLoading?: boolean; maxHeight?: number | string; value?: string; onValueChange?: (v: string) => void; onSubmit?: () => void; children: React.ReactNode; disabled?: boolean;
  onDragOver?: (e: React.DragEvent) => void; onDragLeave?: (e: React.DragEvent) => void; onDrop?: (e: React.DragEvent) => void;
}>(({ className, isLoading = false, maxHeight = 240, value, onValueChange, onSubmit, children, disabled = false, onDragOver, onDragLeave, onDrop }, ref) => {
  const [internalValue, setInternalValue] = React.useState(value || "");
  return (
    <TooltipProvider>
      <PromptInputContext.Provider value={{ isLoading, value: value ?? internalValue, setValue: onValueChange ?? setInternalValue, maxHeight, onSubmit, disabled }}>
        <div ref={ref} className={cn("rounded-3xl border border-border bg-background p-2 shadow-lg transition-all duration-300", isLoading && "border-red-500/70", className)} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
          {children}
        </div>
      </PromptInputContext.Provider>
    </TooltipProvider>
  );
});
PromptInput.displayName = "PromptInput";

const PromptInputTextarea: React.FC<{ placeholder?: string; className?: string } & React.ComponentProps<typeof Textarea>> = ({ className, onKeyDown, placeholder, ...props }) => {
  const { value, setValue, maxHeight, onSubmit, disabled } = usePromptInput();
  const ref = React.useRef<HTMLTextAreaElement>(null);
  React.useEffect(() => { if (!ref.current) return; ref.current.style.height = "auto"; ref.current.style.height = typeof maxHeight === "number" ? `${Math.min(ref.current.scrollHeight, maxHeight)}px` : `min(${ref.current.scrollHeight}px, ${maxHeight})`; }, [value, maxHeight]);
  return <Textarea ref={ref} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSubmit?.(); } onKeyDown?.(e); }} className={className} disabled={disabled} placeholder={placeholder} {...props} />;
};

const PromptInputActions: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => <div className={cn("flex items-center gap-2", className)} {...props}>{children}</div>;

const PromptInputAction: React.FC<{ tooltip: React.ReactNode; children: React.ReactNode; side?: "top" | "bottom" | "left" | "right" } & React.ComponentProps<typeof Tooltip>> = ({ tooltip, children, side = "top", ...props }) => {
  const { disabled } = usePromptInput();
  return <Tooltip {...props}><TooltipTrigger asChild disabled={disabled}>{children}</TooltipTrigger><TooltipContent side={side}>{tooltip}</TooltipContent></Tooltip>;
};

const CustomDivider = () => (
  <div className="relative h-6 w-[1.5px] mx-1">
    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-primary/50 to-transparent rounded-full" />
  </div>
);

// Main Component
interface PromptInputBoxProps { onSend?: (message: string, files?: File[]) => void; isLoading?: boolean; placeholder?: string; className?: string; }

export const PromptInputBox = React.forwardRef<HTMLDivElement, PromptInputBoxProps>((props, ref) => {
  const { onSend = () => {}, isLoading = false, placeholder = "Ask nCall anything...", className } = props;
  const [input, setInput] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [filePreviews, setFilePreviews] = React.useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [isRecording, setIsRecording] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);
  const [showThink, setShowThink] = React.useState(false);
  const [showCanvas, setShowCanvas] = React.useState(false);
  const uploadRef = React.useRef<HTMLInputElement>(null);
  const boxRef = React.useRef<HTMLDivElement>(null);

  const handleToggle = (v: string) => {
    if (v === "search") { setShowSearch(p => !p); setShowThink(false); }
    else if (v === "think") { setShowThink(p => !p); setShowSearch(false); }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) return;
    setFiles([file]);
    const reader = new FileReader();
    reader.onload = (e) => setFilePreviews({ [file.name]: e.target?.result as string });
    reader.readAsDataURL(file);
  };

  const handleDrop = React.useCallback((e: React.DragEvent) => { e.preventDefault(); const f = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/")); if (f[0]) processFile(f[0]); }, []);

  const handleSubmit = () => {
    if (!input.trim() && files.length === 0) return;
    const prefix = showSearch ? "[Search: " : showThink ? "[Think: " : showCanvas ? "[Canvas: " : "";
    onSend(prefix ? `${prefix}${input}]` : input, files);
    setInput(""); setFiles([]); setFilePreviews({});
  };

  const hasContent = input.trim() !== "" || files.length > 0;

  return (
    <>
      <PromptInput value={input} onValueChange={setInput} isLoading={isLoading} onSubmit={handleSubmit}
        className={cn("w-full border-border bg-background shadow-lg", isRecording && "border-red-500/70", className)}
        disabled={isLoading || isRecording} ref={ref || boxRef}
        onDragOver={(e) => { e.preventDefault(); }} onDragLeave={(e) => { e.preventDefault(); }} onDrop={handleDrop}
      >
        {files.length > 0 && !isRecording && (
          <div className="flex flex-wrap gap-2 pb-1">
            {files.map((file, i) => file.type.startsWith("image/") && filePreviews[file.name] && (
              <div key={i} className="relative group">
                <div className="w-16 h-16 rounded-xl overflow-hidden cursor-pointer" onClick={() => setSelectedImage(filePreviews[file.name])}>
                  <img src={filePreviews[file.name]} alt={file.name} className="h-full w-full object-cover" />
                  <button onClick={(e) => { e.stopPropagation(); setFiles([]); setFilePreviews({}); }} className="absolute top-1 right-1 rounded-full bg-black/70 p-0.5"><X className="h-3 w-3 text-white" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={cn("transition-all duration-300", isRecording ? "h-0 overflow-hidden opacity-0" : "opacity-100")}>
          <PromptInputTextarea placeholder={showSearch ? "Search the web..." : showThink ? "Think deeply..." : showCanvas ? "Create on canvas..." : placeholder} className="text-base" />
        </div>

        {isRecording && <VoiceRecorder isRecording={isRecording} onStartRecording={() => {}} onStopRecording={(d) => { setIsRecording(false); onSend(`[Voice message - ${d}s]`, []); }} />}

        <PromptInputActions className="flex items-center justify-between gap-2 pt-2">
          <div className={cn("flex items-center gap-1 transition-opacity duration-300", isRecording ? "opacity-0 invisible h-0" : "opacity-100 visible")}>
            <PromptInputAction tooltip="Upload image">
              <button onClick={() => uploadRef.current?.click()} className="flex h-8 w-8 text-muted-foreground cursor-pointer items-center justify-center rounded-full hover:bg-muted hover:text-foreground transition-colors" disabled={isRecording}>
                <Paperclip className="h-5 w-5" />
                <input ref={uploadRef} type="file" className="hidden" onChange={(e) => { if (e.target.files?.[0]) processFile(e.target.files[0]); e.target.value = ""; }} accept="image/*" />
              </button>
            </PromptInputAction>

            <div className="flex items-center">
              <button type="button" onClick={() => handleToggle("search")} className={cn("rounded-full transition-all flex items-center gap-1 px-2 py-1 border h-8", showSearch ? "bg-primary/15 border-primary text-primary" : "bg-transparent border-transparent text-muted-foreground hover:text-foreground")}>
                <motion.div animate={{ rotate: showSearch ? 360 : 0, scale: showSearch ? 1.1 : 1 }} whileHover={{ rotate: 15, scale: 1.1 }} transition={{ type: "spring", stiffness: 260, damping: 25 }} className="w-5 h-5 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </motion.div>
                <AnimatePresence>{showSearch && <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: "auto", opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="text-xs overflow-hidden whitespace-nowrap text-primary">Search</motion.span>}</AnimatePresence>
              </button>

              <CustomDivider />

              <button type="button" onClick={() => handleToggle("think")} className={cn("rounded-full transition-all flex items-center gap-1 px-2 py-1 border h-8", showThink ? "bg-primary/15 border-primary text-primary" : "bg-transparent border-transparent text-muted-foreground hover:text-foreground")}>
                <motion.div animate={{ rotate: showThink ? 360 : 0, scale: showThink ? 1.1 : 1 }} whileHover={{ rotate: 15, scale: 1.1 }} transition={{ type: "spring", stiffness: 260, damping: 25 }} className="w-5 h-5 flex items-center justify-center">
                  <BrainCog className="w-4 h-4" />
                </motion.div>
                <AnimatePresence>{showThink && <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: "auto", opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="text-xs overflow-hidden whitespace-nowrap text-primary">Think</motion.span>}</AnimatePresence>
              </button>

              <CustomDivider />

              <button type="button" onClick={() => setShowCanvas(p => !p)} className={cn("rounded-full transition-all flex items-center gap-1 px-2 py-1 border h-8", showCanvas ? "bg-primary/15 border-primary text-primary" : "bg-transparent border-transparent text-muted-foreground hover:text-foreground")}>
                <motion.div animate={{ rotate: showCanvas ? 360 : 0, scale: showCanvas ? 1.1 : 1 }} whileHover={{ rotate: 15, scale: 1.1 }} transition={{ type: "spring", stiffness: 260, damping: 25 }} className="w-5 h-5 flex items-center justify-center">
                  <FolderCode className="w-4 h-4" />
                </motion.div>
                <AnimatePresence>{showCanvas && <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: "auto", opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="text-xs overflow-hidden whitespace-nowrap text-primary">Canvas</motion.span>}</AnimatePresence>
              </button>
            </div>
          </div>

          <PromptInputAction tooltip={isLoading ? "Stop" : isRecording ? "Stop recording" : hasContent ? "Send" : "Voice"}>
            <button
              className={cn("h-8 w-8 rounded-full flex items-center justify-center transition-all duration-200",
                isRecording ? "bg-transparent hover:bg-muted text-red-500" :
                hasContent ? "bg-primary hover:bg-primary/80 text-primary-foreground" :
                "bg-transparent hover:bg-muted text-muted-foreground"
              )}
              onClick={() => { if (isRecording) setIsRecording(false); else if (hasContent) handleSubmit(); else setIsRecording(true); }}
              disabled={isLoading && !hasContent}
            >
              {isLoading ? <Square className="h-4 w-4 fill-current animate-pulse" /> :
               isRecording ? <StopCircle className="h-5 w-5 text-red-500" /> :
               hasContent ? <ArrowUp className="h-4 w-4" /> :
               <Mic className="h-5 w-5" />}
            </button>
          </PromptInputAction>
        </PromptInputActions>
      </PromptInput>

      <ImageViewDialog imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
    </>
  );
});
PromptInputBox.displayName = "PromptInputBox";
