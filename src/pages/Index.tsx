import { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useChat } from "@/hooks/useChat";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ChatWelcome } from "@/components/ChatWelcome";
import { TypingIndicator } from "@/components/TypingIndicator";

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
  } = useChat();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages.length, activeConversation?.messages[activeConversation.messages.length - 1]?.content]);

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
      />

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header - minimal */}
        <header className="flex items-center gap-3 px-4 py-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
          </motion.button>
          {hasMessages && (
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-display text-sm font-medium text-muted-foreground truncate"
            >
              {activeConversation?.title}
            </motion.h2>
          )}
        </header>

        {/* Chat body */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {!hasMessages ? (
            <ChatWelcome />
          ) : (
            <div className="flex-1 overflow-y-auto chat-scrollbar">
              <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
                {activeConversation.messages.map((msg, i) => (
                  <ChatMessage key={msg.id} message={msg} index={i} />
                ))}
                <AnimatePresence>
                  {isTyping && !activeConversation.messages.some(m => m.isStreaming) && (
                    <TypingIndicator />
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* Input */}
          <ChatInput onSend={sendMessage} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
};

export default Index;
