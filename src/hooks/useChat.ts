import { useState, useRef, useEffect, useCallback } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
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
  "Here's how I see it: every great conversation starts with curiosity. You're already on the right track.",
  "The universe is full of patterns waiting to be noticed. What you're describing reminds me of something deeply fascinating.",
  "Let me offer a perspective — sometimes the simplest framing reveals the most profound truth.",
  "That's the kind of thinking that leads somewhere interesting. Let me build on it with you.",
];

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

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
      typingTimeoutRef.current = setTimeout(() => {
        const aiMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)],
          timestamp: new Date(),
        };

        setConversations((prev) =>
          prev.map((c) =>
            c.id === capturedConvId ? { ...c, messages: [...c.messages, aiMsg] } : c
          )
        );
        setIsTyping(false);
      }, 1200 + Math.random() * 800);
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
