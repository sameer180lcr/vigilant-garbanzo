import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Plus, Search, Trash2, Settings, Moon, Sun } from "lucide-react";
import type { Conversation, UserSettings } from "@/hooks/useChat";
import leafLogo from "@/assets/leaf-logo.png";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  isOpen: boolean;
  onOpenSettings: () => void;
  settings: UserSettings;
}

const sidebarVariants = {
  open: {
    width: 280,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
  closed: {
    width: 60,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
};

const itemVariants = {
  open: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 400, damping: 25, delay: 0.05 },
  },
  closed: {
    opacity: 0,
    x: -10,
    transition: { type: "spring" as const, stiffness: 400, damping: 25 },
  },
};

export function ChatSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isOpen,
  onOpenSettings,
  settings,
}: ChatSidebarProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Apply theme to document
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={isOpen ? "open" : "closed"}
      className="flex h-full flex-col border-r border-sidebar-border bg-sidebar overflow-hidden"
    >
      {/* Logo & actions */}
      <div className="flex items-center gap-2 p-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center">
          <img src={leafLogo} alt="Muse" className="w-7 h-7 object-contain mix-blend-multiply" />
        </div>
        {isOpen && (
          <motion.span
            variants={itemVariants}
            className="font-display text-base font-semibold text-sidebar-foreground tracking-tight"
          >
            Muse
          </motion.span>
        )}
        <div className="flex-1" />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewConversation}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          title="New conversation"
        >
          <Plus size={18} />
        </motion.button>
        {isOpen && (
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            title="Search"
          >
            <Search size={16} />
          </motion.button>
        )}
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto chat-scrollbar px-2 pb-4 mt-1">
        {conversations.map((conv, i) => (
          <motion.div
            key={conv.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring" as const,
              stiffness: 400,
              damping: 25,
              delay: i * 0.03,
            }}
          >
            <button
              onClick={() => onSelectConversation(conv.id)}
              className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${activeConversationId === conv.id
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                }`}
            >
              <MessageSquare size={15} className="shrink-0 opacity-50" />
              {isOpen && (
                <motion.span
                  variants={itemVariants}
                  className="truncate font-body text-[13px]"
                >
                  {conv.title}
                </motion.span>
              )}
              {isOpen && (
                <motion.span
                  variants={itemVariants}
                  className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conv.id);
                  }}
                >
                  <Trash2 size={13} className="text-muted-foreground hover:text-destructive transition-colors" />
                </motion.span>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Bottom Actions - Settings & Theme */}
      <div className="p-3 border-t border-sidebar-border relative">
        <AnimatePresence>
          {isOpen && showSettings && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-16 left-3 w-48 rounded-2xl bg-sidebar-accent border border-sidebar-border shadow-xl p-1.5 z-50 overflow-hidden"
            >
              <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-50">
                Appearance
              </div>
              <button
                onClick={() => setTheme("light")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all hover:bg-white/10 ${theme === "light" ? "text-primary" : "text-muted-foreground"}`}
              >
                <Sun size={16} />
                Cream Mode
                {theme === "light" && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all hover:bg-white/10 ${theme === "dark" ? "text-primary" : "text-muted-foreground"}`}
              >
                <Moon size={16} />
                Deep Dark
                {theme === "dark" && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenSettings}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${showSettings ? "bg-sidebar-accent text-primary" : "text-muted-foreground hover:bg-sidebar-accent"}`}
          >
            <Settings size={20} className={showSettings ? "rotate-45" : ""} />
          </motion.button>

          {isOpen && (
            <motion.div
              variants={itemVariants}
              className="flex flex-col min-w-0"
            >
              <span className="text-xs font-bold text-sidebar-foreground truncate uppercase tracking-tighter opacity-80">{settings.userName}</span>
              <div className="flex items-center gap-1">
                <span className="text-[9px] text-primary font-bold uppercase tracking-widest shrink-0">PRO</span>
                <span className="text-[9px] text-muted-foreground truncate italic opacity-60">Executive Mode</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
