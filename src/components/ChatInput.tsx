import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, ArrowUp } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="w-full max-w-3xl mx-auto px-4 pb-6"
    >
      <div className="relative flex items-end gap-2 rounded-2xl border border-border bg-chat-input-bg px-4 py-3 shadow-sm focus-within:border-primary/40 focus-within:shadow-md transition-all duration-300">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors mb-0.5"
          title="Attach"
        >
          <Plus size={20} />
        </motion.button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything"
          rows={1}
          className="flex-1 resize-none bg-transparent font-body text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none leading-relaxed max-h-40"
        />

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-200 mb-0.5 ${
            value.trim()
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <ArrowUp size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}
