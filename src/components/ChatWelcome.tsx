import { motion } from "framer-motion";

export function ChatWelcome() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
      className="flex flex-1 flex-col items-center justify-center px-4"
    >
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 250, damping: 22, delay: 0.2 }}
        className="font-display text-3xl font-medium text-chat-welcome tracking-tight"
      >
        Ready when you are.
      </motion.h1>
    </motion.div>
  );
}
