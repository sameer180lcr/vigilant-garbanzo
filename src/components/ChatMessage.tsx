import { motion } from "framer-motion";
import type { Message } from "@/hooks/useChat";
import { CodeBlock } from "@/components/CodeBlock";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { FileCode2, GraduationCap, BookOpen, Quote, Sparkles } from "lucide-react";
import leafLogo from "@/assets/leaf-logo.png";

interface ChatMessageProps {
  message: Message;
  index: number;
  isThinking?: boolean;
  journalistSource?: "scholar" | "arxiv" | "wiki" | null;
  onSuggestionClick?: (suggestion: string, messageId: string) => void;
}

export function ChatMessage({ message, index, isThinking, journalistSource, onSuggestionClick }: ChatMessageProps) {
  const isUser = message.role === "user";

  const getSourceIcon = () => {
    switch (journalistSource) {
      case "scholar": return <GraduationCap size={14} />;
      case "arxiv": return <BookOpen size={14} />;
      case "wiki": return <Quote size={14} />;
      default: return <Sparkles size={14} />;
    }
  };

  const getSourceColor = () => {
    if (journalistSource) return "bg-emerald-500 text-white";
    return "bg-primary text-primary-foreground";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex w-full ${isUser ? "flex-row-reverse" : "flex-row"} gap-4 mb-8`}
    >
      {/* Avatar Circle */}
      {!isUser && (
        <div className="flex flex-col items-center shrink-0 mt-1">
          <div className="relative">
            <div className="h-9 w-9 rounded-full bg-white border border-border shadow-sm flex items-center justify-center overflow-hidden">
              <img src={leafLogo} alt="AI" className="w-5 h-5 object-contain mix-blend-multiply" />
            </div>
            {journalistSource && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full ${getSourceColor()} flex items-center justify-center border-2 border-white shadow-sm z-10`}
              >
                {getSourceIcon()}
              </motion.div>
            )}
          </div>
        </div>
      )}

      <div
        className={`${isUser
          ? "max-w-[85%] rounded-[24px] rounded-tr-none bg-chat-user-bubble text-chat-user-foreground px-5 py-3.5 shadow-sm border border-black/5"
          : "max-w-full flex-1 text-chat-ai-foreground"
          }`}
      >
        {isUser ? (
          <p className="font-body text-[15px] leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        ) : (
          <div className="prose prose-stone prose-sm max-w-none prose-p:my-2 first:prose-p:mt-0 last:prose-p:mb-0">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                pre({ children }) {
                  return <>{children}</>;
                },
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const isInline = !className;

                  if (!isInline && message.isStreaming) {
                    return (
                      <div className="my-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between p-5 bg-card/60 backdrop-blur-sm border border-border rounded-2xl gap-4 group transition-all hover:bg-card/80">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background border border-border shadow-sm text-primary">
                              <div className="relative">
                                <FileCode2 size={22} className="opacity-80" />
                                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full animate-pulse border-2 border-background" />
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-foreground tracking-tight">
                                Muse Artifact Synth
                              </span>
                              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mt-0.5">
                                Stream · {match?.[1] || "Source"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-[9px] font-mono text-primary/60 uppercase tracking-[0.2em] hidden sm:block animate-pulse">
                              Synthesizing...
                            </div>
                            <button
                              disabled
                              className="px-4 py-1.5 rounded-lg border border-border bg-background text-[11px] font-bold text-muted-foreground transition-all flex items-center gap-2 cursor-wait"
                            >
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return !isInline ? (
                    <CodeBlock
                      code={String(children).replace(/\n$/, "")}
                      language={match ? match[1] : "text"}
                    />
                  ) : (
                    <code className="bg-muted px-1.5 py-0.5 rounded-md text-[13px] font-mono" {...props}>
                      {children}
                    </code>
                  );
                },
                p({ children }) {
                  return (
                    <p className="font-body text-[16px] leading-relaxed text-foreground my-4">
                      {children}
                    </p>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>

            <style>{`
              .katex-display {
                margin: 2.5rem 0 !important;
                padding: 1.5rem;
                background: white;
                border: 1px solid var(--border);
                border-radius: 1.25rem;
                font-size: 1.4em;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                overflow-x: auto;
                overflow-y: hidden;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              .katex {
                font-size: 1.15em;
                color: hsl(var(--foreground));
              }
              .katex-html {
                display: flex !important;
                align-items: center;
              }
            `}</style>

            {message.isStreaming && (
              <span className="inline-block w-[3px] h-[1.1em] rounded-full bg-primary ml-1.5 align-text-bottom translate-y-[2px]" />
            )}

            {isThinking && message.isStreaming && (
              <span className="text-[10px] text-primary/40 font-mono ml-3 uppercase tracking-tighter">
                Thinking
              </span>
            )}

            {!isUser && !message.isStreaming && message.suggestions && message.suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-8 flex flex-col gap-2 border-l border-primary/20 pl-4 py-1"
              >
                {message.suggestions.map((suggestion, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ x: 5, color: "var(--primary)" }}
                    onClick={() => onSuggestionClick?.(suggestion, message.id)}
                    className="flex items-center gap-3 text-[13px] text-muted-foreground font-medium text-left transition-colors group"
                  >
                    <span className="text-primary/40 group-hover:text-primary transition-colors italic tracking-tighter">↳</span>
                    {suggestion}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
