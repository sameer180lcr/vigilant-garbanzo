import { useState, useCallback, useRef, useEffect } from "react";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  suggestions?: string[];
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  isTemporary?: boolean;
};

export type UserSettings = {
  userName: string;
  userAvatar: string;
  model: string;
  temperature: number;
  contextLength: number;
  systemPromptOverride: string;
  apiEndpoint: string;
  isPro: boolean;
};

const DEFAULT_SETTINGS: UserSettings = {
  userName: "Guest User",
  userAvatar: "",
  model: "qwen2.5-coder:3b",
  temperature: 0.2,
  contextLength: 2048,
  systemPromptOverride: "",
  apiEndpoint: import.meta.env.VITE_OLLAMA_API || "http://localhost:11434",
  isPro: true, // Marking as Pro by default for "Professional" feel
};

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [temporaryConversation, setTemporaryConversation] = useState<Conversation | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const [researchStatus, setResearchStatus] = useState("");
  const [researchIcon, setResearchIcon] = useState<"scholar" | "arxiv" | "wiki" | null>(null);
  const [ideCode, setIdeCode] = useState("");
  const [ideLanguage, setIdeLanguage] = useState("");
  const [isTemporaryMode, setIsTemporaryMode] = useState(false);
  const [isJournalistMode, setIsJournalistMode] = useState(false);
  const [journalistSource, setJournalistSource] = useState<"scholar" | "arxiv" | "wiki" | null>(null);
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem("muse-settings");
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem("muse-settings", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const toggleJournalistMode = useCallback(() => {
    setIsJournalistMode(prev => {
      const next = !prev;
      if (next) {
        setIsTemporaryMode(false);
      } else {
        setJournalistSource(null);
      }
      return next;
    });
  }, []);

  const toggleJournalistSource = useCallback((source: "scholar" | "arxiv" | "wiki") => {
    setJournalistSource(prev => {
      const next = prev === source ? null : source;
      if (next) {
        setIsJournalistMode(true);
        setIsTemporaryMode(false);
      }
      return next;
    });
  }, []);

  const activeConversation = isTemporaryMode
    ? temporaryConversation
    : conversations.find((c) => c.id === activeConversationId) || null;

  const toggleTemporaryMode = useCallback(() => {
    setIsTemporaryMode(prev => {
      const next = !prev;
      if (next) {
        setTemporaryConversation(null);
        setActiveConversationId(null);
        setIsJournalistMode(false);
        setJournalistSource(null);
      }
      return next;
    });
  }, []);

  const extractCode = (text: string) => {
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)(?:```|$)/g;
    let match;
    let lastCode = "";
    let lastLang = "";

    while ((match = codeBlockRegex.exec(text)) !== null) {
      lastLang = match[1] || "text";
      lastCode = match[2].trim();
    }
    return { code: lastCode, language: lastLang };
  };

  const parseSuggestions = (text: string) => {
    const parts = text.split("[SUGGESTIONS]");
    const content = parts[0].trim();
    let suggestions: string[] = [];

    if (parts.length >= 2) {
      suggestions = parts[1]
        .split("|")
        .map(s => s.trim().replace(/^Q\d+[:.]\s*/i, ""))
        .filter(s => s.length > 0 && s.length < 100)
        .slice(0, 3);
    }

    return { content, suggestions };
  };

  const createConversation = useCallback(() => {
    if (isTemporaryMode) {
      setTemporaryConversation(null);
      setIdeCode("");
      setIdeLanguage("");
      return "temp";
    }

    const newConv: Conversation = {
      id: crypto.randomUUID(),
      title: "New conversation",
      messages: [],
      createdAt: new Date(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setIdeCode("");
    setIdeLanguage("");
    return newConv.id;
  }, [isTemporaryMode]);

  const thinkingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      let targetConvId = activeConversationId;
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      const aiMsgId = crypto.randomUUID();
      const aiMsg: Message = {
        id: aiMsgId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      };

      // 1. Setup Conversation State
      if (isTemporaryMode) {
        targetConvId = "temp";
        setTemporaryConversation(prev => {
          if (!prev) {
            return {
              id: "temp",
              title: content.slice(0, 30),
              messages: [userMsg, aiMsg],
              createdAt: new Date(),
            };
          }
          return {
            ...prev,
            messages: [...prev.messages, userMsg, aiMsg],
          };
        });
      } else {
        if (!targetConvId) {
          targetConvId = crypto.randomUUID();
          const newConv: Conversation = {
            id: targetConvId,
            title: content.slice(0, 30),
            messages: [userMsg, aiMsg],
            createdAt: new Date(),
          };
          setConversations((prev) => [newConv, ...prev]);
          setActiveConversationId(targetConvId);
        } else {
          setConversations((prev) =>
            prev.map((c) =>
              c.id === targetConvId ? { ...c, messages: [...c.messages, userMsg, aiMsg] } : c
            )
          );
        }
      }

      setIsTyping(true);
      setIdeCode("");
      setIdeLanguage("");

      // 2. Prepare AI Logic
      const currentConv = isTemporaryMode ? temporaryConversation : conversations.find(c => c.id === targetConvId);
      const previousMessages = currentConv ? currentConv.messages.slice(0, -1) : [];

      let systemPrompt = settings.systemPromptOverride || "You are Muse, a luxury AI. Answer with extreme speed. Use plain text unless asked for code. For math, use LaTeX ($...$). Elite aesthetics only.";
      systemPrompt += "\n\nIMPORTANT: At the very end of your response, provide exactly 3 brief follow-up questions for the user, prefixed with [SUGGESTIONS] and separated by |. Example: [SUGGESTIONS] Q1 | Q2 | Q3";

      if (isJournalistMode) {
        const sourceName = journalistSource === 'wiki' ? 'Wikipedia' : journalistSource === 'arxiv' ? 'ArXiv' : journalistSource === 'scholar' ? 'Scholar' : 'Global Research Databases';
        systemPrompt = `Elite Investigative Journalist. Summarize abstracts from 3-5 results from ${sourceName}. Focus on speed. Provide 3+ direct links.`;
      }

      const ollamaMessages = [
        { role: "system", content: systemPrompt },
        ...previousMessages.map(m => ({ role: m.role, content: m.content })),
        { role: "user", content: content }
      ];

      // 3. Research Simulation
      if (isJournalistMode) {
        setIsResearching(true);
        const sources: ("wiki" | "scholar" | "arxiv")[] = journalistSource ? [journalistSource] : ["wiki", "scholar", "arxiv"];

        for (const src of sources) {
          setResearchIcon(src);
          const name = src === 'wiki' ? 'Wikipedia' : src === 'arxiv' ? 'ArXiv' : 'Google Scholar';
          setResearchStatus(`Searching ${name}...`);
          await new Promise(resolve => setTimeout(resolve, 1500));
          setResearchStatus(`Scraping ${name} data...`);
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
        setResearchIcon(null);
        setResearchStatus("Synthesizing report...");
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsResearching(false);
      }

      // 4. API Call
      try {
        const response = await fetch(`${settings.apiEndpoint}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: settings.model,
            messages: ollamaMessages,
            stream: true,
            options: {
              temperature: settings.temperature,
              num_thread: 6,
              num_ctx: settings.contextLength,
              top_k: 20,
              top_p: 0.9,
              repeat_penalty: 1.1,
              f16_kv: true
            }
          }),
        });

        if (!response.ok) throw new Error("Connection failed");
        if (!response.body) throw new Error("No body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = "";
        let displayedText = "";
        let isStreamDone = false;

        const processSmoothing = () => {
          if (!isStreamDone && displayedText.length === fullText.length) {
            if (!thinkingTimeoutRef.current) {
              thinkingTimeoutRef.current = setTimeout(() => setIsThinking(true), 400);
            }
          } else {
            if (thinkingTimeoutRef.current) {
              clearTimeout(thinkingTimeoutRef.current);
              thinkingTimeoutRef.current = null;
            }
            setIsThinking(false);
          }

          if (displayedText.length < fullText.length) {
            const batchSize = Math.max(1, Math.min(64, Math.ceil((fullText.length - displayedText.length) / 2)));
            displayedText += fullText.slice(displayedText.length, displayedText.length + batchSize);

            // Hide suggestions during streaming
            const streamContent = displayedText.split("[SUGGESTIONS]")[0];

            if (isTemporaryMode) {
              setTemporaryConversation(prev => prev ? {
                ...prev,
                messages: prev.messages.map(m => m.id === aiMsgId ? { ...m, content: streamContent } : m)
              } : null);
            } else {
              setConversations(prev => prev.map(c =>
                c.id === targetConvId
                  ? { ...c, messages: c.messages.map(m => m.id === aiMsgId ? { ...m, content: streamContent } : m) }
                  : c
              ));
            }

            const { code, language } = extractCode(streamContent);
            if (code) { setIdeCode(code); setIdeLanguage(language); }
          }

          if (!isStreamDone || displayedText.length < fullText.length) {
            requestAnimationFrame(processSmoothing);
          } else {
            setIsTyping(false);
            setIsThinking(false);

            const { content: finalContent, suggestions } = parseSuggestions(displayedText);

            if (isTemporaryMode) {
              setTemporaryConversation(prev => prev ? {
                ...prev,
                messages: prev.messages.map(m => m.id === aiMsgId ? { ...m, content: finalContent, suggestions, isStreaming: false } : m)
              } : null);
            } else {
              setConversations(prev => prev.map(c =>
                c.id === targetConvId
                  ? { ...c, messages: c.messages.map(m => m.id === aiMsgId ? { ...m, content: finalContent, suggestions, isStreaming: false } : m) }
                  : c
              ));
            }
          }
        };

        requestAnimationFrame(processSmoothing);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const json = JSON.parse(line);
              if (json.message?.content) fullText += json.message.content;
            } catch (e) { }
          }
        }
        isStreamDone = true;
      } catch (error) {
        console.error("Chat error:", error);
        setIsTyping(false);
        setIsThinking(false);
        setIsResearching(false);
      }
    },
    [activeConversationId, isTemporaryMode, isJournalistMode, journalistSource, conversations, temporaryConversation]
  );

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConversationId === id) {
        setActiveConversationId(null);
        setIdeCode("");
        setIdeLanguage("");
      }
    },
    [activeConversationId]
  );

  const removeMessageSuggestions = useCallback((messageId: string) => {
    if (isTemporaryMode) {
      setTemporaryConversation(prev => prev ? {
        ...prev,
        messages: prev.messages.map(m => m.id === messageId ? { ...m, suggestions: [] } : m)
      } : null);
    } else {
      setConversations(prev => prev.map(c => ({
        ...c,
        messages: c.messages.map(m => m.id === messageId ? { ...m, suggestions: [] } : m)
      })));
    }
  }, [isTemporaryMode]);

  return {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    createConversation,
    sendMessage,
    deleteConversation,
    removeMessageSuggestions,
    isTyping,
    isThinking,
    isResearching,
    researchStatus,
    researchIcon,
    ideCode,
    ideLanguage,
    isTemporaryMode,
    toggleTemporaryMode,
    isJournalistMode,
    toggleJournalistMode,
    journalistSource,
    toggleJournalistSource,
    settings,
    updateSettings
  };
}
