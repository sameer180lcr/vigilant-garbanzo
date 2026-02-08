import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.95 }}
      transition={{ type: "spring" as const, stiffness: 400, damping: 25 }}
      className="flex justify-start"
    >
      <div className="flex items-center gap-2 px-2 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-[7px] w-[7px] rounded-full bg-primary/50"
            animate={{
              y: [0, -8, 0],
              scale: [1, 1.3, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.18,
              ease: [0.45, 0, 0.55, 1],
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
