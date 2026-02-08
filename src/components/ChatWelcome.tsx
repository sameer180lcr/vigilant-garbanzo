import { motion } from "framer-motion";
import leafLogo from "@/assets/leaf-logo.png";

export function ChatWelcome() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-1 flex-col items-center justify-center px-4 gap-6"
    >
      <motion.img
        src={leafLogo}
        alt="Muse"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring" as const, stiffness: 200, damping: 20, delay: 0.1 }}
        className="w-16 h-16 object-contain"
      />
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring" as const, stiffness: 250, damping: 22, delay: 0.2 }}
        className="font-display text-3xl font-medium text-chat-welcome tracking-tight"
      >
        Ready when you are.
      </motion.h1>
    </motion.div>
  );
}
