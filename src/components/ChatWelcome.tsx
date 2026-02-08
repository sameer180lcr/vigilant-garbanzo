import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import leafLogo from "@/assets/leaf-logo.png";

interface ChatWelcomeProps {
  isJournalistMode?: boolean;
  isTemporaryMode?: boolean;
}

export function ChatWelcome({ isJournalistMode, isTemporaryMode }: ChatWelcomeProps) {
  let targetText = "How may I assist your business today?";

  if (isJournalistMode) {
    targetText = "Investigative Intelligence Active.";
  } else if (isTemporaryMode) {
    targetText = "Secure Incognito Session.";
  }

  const [displayedText, setDisplayedText] = useState("");

  // Typing effect
  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < targetText.length) {
        setDisplayedText(targetText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [targetText]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-1 flex-col items-center justify-center px-4 gap-12"
    >
      <motion.div
        key={isJournalistMode ? "journalist" : isTemporaryMode ? "incognito" : "default"}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative">
          <motion.img
            src={leafLogo}
            alt="Muse"
            initial={{ opacity: 0, rotate: -15, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            className="w-20 h-20 object-contain mix-blend-multiply filter drop-shadow-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-1 -right-4 px-2 py-0.5 rounded-full bg-primary text-[8px] font-bold text-primary-foreground tracking-widest uppercase"
          >
            PRO
          </motion.div>
        </div>

        <div className="flex flex-col items-center gap-3 h-16">
          <motion.h1 className="font-display text-4xl font-semibold text-foreground/80 tracking-tight text-center italic">
            {displayedText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-1.5 h-8 bg-primary/20 ml-1 rounded-full align-middle translate-y-[-2px]"
            />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60"
          >
            MUSE EXECUTIVE • SECURE ENTERPRISE INFERENCE
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl"
      >
        <QuickActionCard title="Code Design" desc="Architect premium web experiences" icon="✨" />
        <QuickActionCard title="Research" desc="Journalist-grade deep search" icon="🔍" />
        <QuickActionCard title="Analyze" desc="Strategic inference processing" icon="📊" />
        <QuickActionCard title="Executive" desc="Professional communication sync" icon="💼" />
      </motion.div>
    </motion.div>
  );
}

function QuickActionCard({ title, desc, icon }: { title: string, desc: string, icon: string }) {
  return (
    <motion.button
      whileHover={{ y: -5, backgroundColor: "rgba(var(--primary-rgb), 0.05)" }}
      whileTap={{ scale: 0.98 }}
      className="flex flex-col items-center text-center p-5 rounded-[24px] bg-secondary/30 border border-border/20 transition-all hover:border-primary/20 group"
    >
      <div className="text-2xl mb-3 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xs font-bold text-foreground/80 mb-1">{title}</h3>
      <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2">{desc}</p>
    </motion.button>
  );
}

