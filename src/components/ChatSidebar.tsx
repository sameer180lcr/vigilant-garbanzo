import { motion } from "framer-motion";
import { MessageSquare, Plus, Search, Trash2 } from "lucide-react";
import type { Conversation } from "@/hooks/useChat";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  isOpen: boolean;
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
}: ChatSidebarProps) {
  return (
    <motion.aside
      variants={sidebarVariants}
      animate={isOpen ? "open" : "closed"}
      className="flex h-full flex-col border-r border-sidebar-border bg-sidebar overflow-hidden"
    >
      {/* Top actions */}
      <div className="flex items-center gap-2 p-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewConversation}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          title="New conversation"
        >
          <Plus size={20} />
        </motion.button>

        {isOpen && (
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            title="Search"
          >
            <Search size={18} />
          </motion.button>
        )}
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto chat-scrollbar px-2 pb-4">
        {conversations.map((conv, i) => (
          <motion.div
            key={conv.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              delay: i * 0.03,
            }}
          >
            <button
              onClick={() => onSelectConversation(conv.id)}
              className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                activeConversationId === conv.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60"
              }`}
            >
              <MessageSquare size={16} className="shrink-0 opacity-60" />
              {isOpen && (
                <motion.span
                  variants={itemVariants}
                  className="truncate font-body text-sm"
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
                  <Trash2 size={14} className="text-muted-foreground hover:text-destructive transition-colors" />
                </motion.span>
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.aside>
  );
}
