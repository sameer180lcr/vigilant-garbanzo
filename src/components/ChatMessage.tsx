import { motion } from "framer-motion";
import type { Message } from "@/hooks/useChat";

interface ChatMessageProps {
  message: Message;
  index: number;
}

export function ChatMessage({ message, index }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 28,
        delay: index * 0.05,
      }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <motion.div
        layout
        className={`max-w-[70%] rounded-2xl px-5 py-3.5 ${
          isUser
            ? "bg-chat-user-bubble text-chat-user-foreground rounded-br-md"
            : "bg-transparent text-chat-ai-foreground"
        }`}
      >
        <p className="font-body text-[15px] leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
      </motion.div>
    </motion.div>
  );
}
