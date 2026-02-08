import { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { PanelLeftClose, PanelLeft, Code2, Ghost, Newspaper, LayoutGrid, Check, GraduationCap, BookOpen, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useChat } from "@/hooks/useChat";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ChatWelcome } from "@/components/ChatWelcome";
import { TypingIndicator } from "@/components/TypingIndicator";
import { IDEPanel } from "@/components/IDEPanel";
import { SettingsModal } from "@/components/SettingsModal";
import leafLogo from "@/assets/leaf-logo.png";

const Index = () => {
  const {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    createConversation,
    sendMessage,
    deleteConversation,
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
    updateSettings,
    removeMessageSuggestions
  } = useChat();

  const handleSuggestionClick = (suggestion: string, messageId: string) => {
    removeMessageSuggestions(messageId);
    sendMessage(suggestion);
  };

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [ideOpen, setIdeOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isAutoScrolling = useRef(true);

  // Auto-scroll logic
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (isAutoScrolling.current) {
      const isStreaming = activeConversation?.messages.some(m => m.isStreaming);
      container.scrollTo({
        top: container.scrollHeight,
        behavior: isStreaming ? "auto" : "smooth"
      });
    }
  }, [activeConversation?.messages.length, activeConversation?.messages[activeConversation?.messages.length - 1]?.content]);

  // Track if user is at bottom to decide whether to auto-scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    isAutoScrolling.current = isAtBottom;
  };

  // Auto-open IDE when code is generated
  useEffect(() => {
    if (ideCode && !ideOpen) {
      setIdeOpen(true);
    }
  }, [ideCode]);

  const hasMessages = activeConversation && activeConversation.messages.length > 0;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onNewConversation={createConversation}
        onDeleteConversation={deleteConversation}
        isOpen={sidebarOpen}
        onOpenSettings={() => setSettingsOpen(true)}
        settings={settings}
      />

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0 glass-blur relative">
        {/* Header - minimal */}
        <header className="flex items-center gap-3 px-6 py-4 border-b border-border/50 shrink-0 bg-background/50 backdrop-blur-md z-[100]">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
          </motion.button>

          {hasMessages && (
            <div className="flex flex-1 min-w-0 items-center gap-2">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-display text-sm font-semibold text-foreground/80 truncate"
              >
                {activeConversation?.title}
              </motion.h2>
              <div className="flex items-center gap-1.5 overflow-hidden">
                {isTemporaryMode && (
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-[10px] font-bold text-primary uppercase tracking-widest border border-primary/20 shrink-0">
                    Temporary
                  </span>
                )}
                {isJournalistMode && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-[10px] font-bold text-emerald-600 uppercase tracking-widest border border-emerald-500/20 shrink-0">
                    Journalist {journalistSource && `(${journalistSource})`}
                  </span>
                )}
              </div>
            </div>
          )}

          {!hasMessages && (
            <div className="flex-1 flex items-center">
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] italic opacity-40"
              >
                Welcome back, {settings.userName}.
              </motion.span>
            </div>
          )}

          <div className="flex items-center gap-2 relative">
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMenuOpen(!menuOpen)}
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all border ${menuOpen || isJournalistMode || isTemporaryMode
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_-5px_hsl(var(--primary))]"
                  : "bg-secondary/40 text-muted-foreground border-transparent hover:border-border"
                  }`}
              >
                <LayoutGrid size={18} className={isJournalistMode || isTemporaryMode ? "animate-pulse" : ""} />
              </motion.button>

              <AnimatePresence>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-3 w-64 rounded-[28px] bg-background/90 backdrop-blur-3xl border border-border shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] overflow-hidden z-50 p-2"
                    >
                      <div className="px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] mb-1 opacity-60">
                        Expert Modes
                      </div>

                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            toggleJournalistMode();
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-[20px] text-[14px] font-semibold transition-all hover:bg-secondary group ${isJournalistMode ? "text-emerald-600 bg-emerald-500/5" : "text-foreground/70"}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isJournalistMode ? "bg-emerald-500/20" : "bg-muted"}`}>
                              <Newspaper size={18} />
                            </div>
                            Journalist
                          </div>
                          {isJournalistMode && <Check size={18} strokeWidth={3} />}
                        </button>

                        {isJournalistMode && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="pl-6 pr-2 py-1 space-y-1"
                          >
                            <button
                              onClick={() => {
                                toggleJournalistSource("scholar");
                                setMenuOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-medium transition-all ${journalistSource === "scholar" ? "text-emerald-600 bg-emerald-500/10" : "text-foreground/60 hover:bg-secondary"}`}
                            >
                              <div className="flex items-center gap-2">
                                <GraduationCap size={14} />
                                Scholar
                              </div>
                              {journalistSource === "scholar" && <Check size={12} strokeWidth={3} />}
                            </button>

                            <button
                              onClick={() => {
                                toggleJournalistSource("arxiv");
                                setMenuOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-medium transition-all ${journalistSource === "arxiv" ? "text-emerald-600 bg-emerald-500/10" : "text-foreground/60 hover:bg-secondary"}`}
                            >
                              <div className="flex items-center gap-2">
                                <BookOpen size={14} />
                                ArXiv
                              </div>
                              {journalistSource === "arxiv" && <Check size={12} strokeWidth={3} />}
                            </button>

                            <button
                              onClick={() => {
                                toggleJournalistSource("wiki");
                                setMenuOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-medium transition-all ${journalistSource === "wiki" ? "text-emerald-600 bg-emerald-500/10" : "text-foreground/60 hover:bg-secondary"}`}
                            >
                              <div className="flex items-center gap-2">
                                <Quote size={14} />
                                Wiki
                              </div>
                              {journalistSource === "wiki" && <Check size={12} strokeWidth={3} />}
                            </button>
                          </motion.div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          toggleTemporaryMode();
                          setMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-[20px] text-[14px] font-semibold transition-all hover:bg-secondary group ${isTemporaryMode ? "text-primary bg-primary/5" : "text-foreground/70"}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isTemporaryMode ? "bg-primary/20" : "bg-muted"}`}>
                            <Ghost size={18} />
                          </div>
                          Incognito
                        </div>
                        {isTemporaryMode && <Check size={18} strokeWidth={3} />}
                      </button>

                      <div className="mt-2 p-4 rounded-[20px] bg-secondary/30 border border-border/40">
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          Modes change how Muse thinks and remembers. Personalize your session.
                        </p>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {ideCode && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIdeOpen((prev) => !prev)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-tight transition-all ${ideOpen
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                  }`}
              >
                <Code2 size={14} />
                Design Lab
              </motion.button>
            )}
          </div>
        </header>

        {/* Chat body */}
        <div className="flex flex-1 flex-col overflow-hidden relative">
          <AnimatePresence>
            {isResearching && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
              >
                <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 shadow-[0_10px_40px_-10px_rgba(16,185,129,0.3)]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={researchIcon || 'muse'}
                      initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0.5, opacity: 0, rotate: 10 }}
                      className="h-6 w-6 rounded-full bg-white flex items-center justify-center p-1 border border-emerald-500/20 shadow-sm overflow-hidden"
                    >
                      {researchIcon === 'scholar' && <GraduationCap size={16} className="text-emerald-600" />}
                      {researchIcon === 'arxiv' && <BookOpen size={16} className="text-emerald-600" />}
                      {researchIcon === 'wiki' && <Quote size={16} className="text-emerald-600" />}
                      {!researchIcon && <img src={leafLogo} alt="Muse" className="w-full h-full object-contain mix-blend-multiply" />}
                    </motion.div>
                  </AnimatePresence>
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest min-w-[180px]">
                    {researchStatus || 'Initiating Research...'}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!hasMessages ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <ChatWelcome
                isJournalistMode={isJournalistMode}
                isTemporaryMode={isTemporaryMode}
              />
            </div>
          ) : (
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto chat-scrollbar"
            >
              <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
                {activeConversation.messages.map((msg, i) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    index={i}
                    isThinking={isThinking && msg.isStreaming}
                    journalistSource={journalistSource}
                    onSuggestionClick={handleSuggestionClick}
                  />
                ))}
                <AnimatePresence>
                  {isTyping && !activeConversation.messages.some(m => m.isStreaming) && (
                    <TypingIndicator />
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} className="h-4" />
              </div>
            </div>
          )}

          {/* Input Area - Pinned to bottom */}
          <div className="w-full shrink-0 bg-gradient-to-t from-background via-background/95 to-transparent pt-10 pb-4">
            <ChatInput onSend={sendMessage} disabled={isTyping} />
          </div>
        </div>
      </div>

      {/* IDE Panel */}
      <AnimatePresence mode="wait">
        {ideOpen && (
          <IDEPanel
            code={ideCode}
            language={ideLanguage}
            isOpen={ideOpen}
            onClose={() => setIdeOpen(false)}
            isSyncing={isTyping}
          />
        )}
      </AnimatePresence>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdate={updateSettings}
      />
    </div>
  );
};

export default Index;
