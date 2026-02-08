import { motion } from "framer-motion";
import type { Message } from "@/hooks/useChat";
import { CodeBlock } from "@/components/CodeBlock";
import { useMemo } from "react";

interface ChatMessageProps {
  message: Message;
  index: number;
}

interface ContentPart {
  type: "text" | "code";
  content: string;
  language?: string;
}

function parseContent(content: string): ContentPart[] {
  const parts: ContentPart[] = [];
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Text before code block
    if (match.index > lastIndex) {
      const text = content.slice(lastIndex, match.index).trim();
      if (text) parts.push({ type: "text", content: text });
    }
    // Code block
    parts.push({
      type: "code",
      language: match[1] || "text",
      content: match[2].trimEnd(),
    });
    lastIndex = match.index + match[0].length;
  }

  // Remaining text
  if (lastIndex < content.length) {
    const text = content.slice(lastIndex).trim();
    if (text) parts.push({ type: "text", content: text });
  }

  if (parts.length === 0) {
    parts.push({ type: "text", content });
  }

  return parts;
}

export function ChatMessage({ message, index }: ChatMessageProps) {
  const isUser = message.role === "user";
  const parts = useMemo(() => parseContent(message.content), [message.content]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring" as const,
        stiffness: 380,
        damping: 30,
      }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`${
          isUser
            ? "max-w-[75%] rounded-2xl rounded-br-md bg-chat-user-bubble text-chat-user-foreground px-5 py-3"
            : "max-w-full w-full text-chat-ai-foreground"
        }`}
      >
        {isUser ? (
          <p className="font-body text-[15px] leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        ) : (
          <div className="space-y-4">
            {parts.map((part, i) =>
              part.type === "code" ? (
                <CodeBlock key={i} code={part.content} language={part.language || "text"} />
              ) : (
                <p
                  key={i}
                  className="font-body text-[15px] leading-relaxed whitespace-pre-wrap"
                >
                  {part.content}
                  {message.isStreaming && i === parts.length - 1 && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                      className="inline-block w-[2px] h-[1em] bg-foreground ml-0.5 align-text-bottom"
                    />
                  )}
                </p>
              )
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
