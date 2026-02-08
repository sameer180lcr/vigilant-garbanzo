import { useState, useRef, useEffect, useCallback } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

const MOCK_RESPONSES = [
  "That's a wonderful question. Let me think about it carefully — the beauty of ideas is in how they unfold when you give them room to breathe.",
  "I love that you brought this up. There's a certain elegance to approaching problems from unexpected angles, don't you think?",
  "Here's how I see it: every great conversation starts with curiosity. You're already on the right track.\n\n```python\ndef explore(idea):\n    while idea.has_depth():\n        idea = idea.dig_deeper()\n    return idea.insight()\n```\n\nSometimes the code writes itself when the thinking is clear.",
  "The universe is full of patterns waiting to be noticed. What you're describing reminds me of something deeply fascinating.\n\nHere's a small example:\n\n```javascript\nconst pattern = observations\n  .filter(o => o.isInteresting)\n  .map(o => o.meaning)\n  .reduce((a, b) => synthesize(a, b));\n```",
  "Let me offer a perspective — sometimes the simplest framing reveals the most profound truth.",
  "That's the kind of thinking that leads somewhere interesting. Let me build on it with you.\n\n```typescript\ninterface Thought {\n  premise: string;\n  depth: number;\n  connections: Thought[];\n}\n\nfunction evolve(thought: Thought): Thought {\n  return {\n    ...thought,\n    depth: thought.depth + 1,\n    connections: thought.connections.map(evolve)\n  };\n}\n```",
];

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const wordIntervalRef = useRef<NodeJS.Timeout>();

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || null;

  const createConversation = useCallback(() => {
    const newConv: Conversation = {
      id: crypto.randomUUID(),
      title: "New conversation",
      messages: [],
      createdAt: new Date(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    return newConv.id;
  }, []);

  const sendMessage = useCallback(
    (content: string) => {
      let convId = activeConversationId;

      if (!convId) {
        convId = crypto.randomUUID();
        const newConv: Conversation = {
          id: convId,
          title: content.slice(0, 30) + (content.length > 30 ? "…" : ""),
          messages: [],
          createdAt: new Date(),
        };
        setConversations((prev) => [newConv, ...prev]);
        setActiveConversationId(convId);
      }

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === convId) {
            const updated = { ...c, messages: [...c.messages, userMsg] };
            if (c.messages.length === 0) {
              updated.title = content.slice(0, 30) + (content.length > 30 ? "…" : "");
            }
            return updated;
          }
          return c;
        })
      );

      setIsTyping(true);

      const capturedConvId = convId;
      const fullResponse = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
      const words = fullResponse.split(/(\s+)/); // preserve whitespace
      const aiMsgId = crypto.randomUUID();

      // Start streaming after a brief delay
      typingTimeoutRef.current = setTimeout(() => {
        // Add empty streaming message
        const aiMsg: Message = {
          id: aiMsgId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
          isStreaming: true,
        };

        setConversations((prev) =>
          prev.map((c) =>
            c.id === capturedConvId ? { ...c, messages: [...c.messages, aiMsg] } : c
          )
        );

        let wordIndex = 0;
        wordIntervalRef.current = setInterval(() => {
          if (wordIndex < words.length) {
            const nextWord = words[wordIndex];
            wordIndex++;
            setConversations((prev) =>
              prev.map((c) => {
                if (c.id !== capturedConvId) return c;
                return {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === aiMsgId
                      ? { ...m, content: m.content + nextWord }
                      : m
                  ),
                };
              })
            );
          } else {
            // Done streaming
            clearInterval(wordIntervalRef.current);
            setConversations((prev) =>
              prev.map((c) => {
                if (c.id !== capturedConvId) return c;
                return {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === aiMsgId ? { ...m, isStreaming: false } : m
                  ),
                };
              })
            );
            setIsTyping(false);
          }
        }, 40); // ~40ms per word for smooth typing
      }, 600);
    },
    [activeConversationId]
  );

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConversationId === id) {
        setActiveConversationId(null);
      }
    },
    [activeConversationId]
  );

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (wordIntervalRef.current) clearInterval(wordIntervalRef.current);
    };
  }, []);

  return {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    createConversation,
    sendMessage,
    deleteConversation,
    isTyping,
  };
}
