import { motion } from "framer-motion";
import type { Message } from "@/hooks/useChat";
import { CodeBlock } from "@/components/CodeBlock";
import { StreamingWord } from "@/components/StreamingWord";
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
    if (match.index > lastIndex) {
      const text = content.slice(lastIndex, match.index).trim();
      if (text) parts.push({ type: "text", content: text });
    }
    parts.push({
      type: "code",
      language: match[1] || "text",
      content: match[2].trimEnd(),
    });
    lastIndex = match.index + match[0].length;
  }

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
                  className="font-body text-[15px] leading-relaxed whitespace-pre-wrap inline"
                >
                  {message.isStreaming ? (
                    <StreamingText text={part.content} isLast={i === parts.length - 1} />
                  ) : (
                    part.content
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

function StreamingText({ text, isLast }: { text: string; isLast: boolean }) {
  const words = text.split(/(\s+)/);

  return (
    <>
      {words.map((word, i) => (
        <StreamingWord key={i} word={word} index={i} />
      ))}
      {isLast && (
        <motion.span
          animate={{
            opacity: [1, 0.2, 1],
            scaleY: [1, 0.8, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="inline-block w-[2.5px] h-[1.1em] rounded-full bg-primary ml-0.5 align-text-bottom"
        />
      )}
    </>
  );
}
