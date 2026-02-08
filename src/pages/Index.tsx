import { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
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
  }, [activeConversation?.messages, isTyping]);

  const hasMessages = activeConversation && activeConversation.messages.length > 0;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onNewConversation={() => {
          createConversation();
        }}
        onDeleteConversation={deleteConversation}
        isOpen={sidebarOpen}
      />

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-border px-4 py-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground hover:bg-secondary transition-colors"
          >
            <Menu size={20} />
          </motion.button>
          <h2 className="font-display text-lg font-medium text-foreground truncate">
            {activeConversation?.title || "Muse"}
          </h2>
        </header>

        {/* Chat body */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {!hasMessages ? (
            <ChatWelcome />
          ) : (
            <div className="flex-1 overflow-y-auto chat-scrollbar">
              <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
                {activeConversation.messages.map((msg, i) => (
                  <ChatMessage key={msg.id} message={msg} index={i} />
                ))}
                <AnimatePresence>
                  {isTyping && <TypingIndicator />}
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
