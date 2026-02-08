import { motion } from "framer-motion";
import leafLogo from "@/assets/leaf-logo.png";

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.95 }}
      transition={{ type: "spring" as const, stiffness: 400, damping: 25 }}
      className="flex justify-start gap-4"
    >
      {/* Bot Avatar */}
      <div className="flex flex-col items-center shrink-0">
        <div className="h-9 w-9 rounded-full bg-white border border-border shadow-sm flex items-center justify-center overflow-hidden">
          <img src={leafLogo} alt="AI" className="w-5 h-5 object-contain mix-blend-multiply" />
        </div>
      </div>

      <div className="flex items-center gap-2 px-2 py-3 bg-secondary/20 rounded-2xl rounded-tl-none border border-border/30">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-[6px] w-[6px] rounded-full bg-primary/60"
            animate={{
              y: [0, -5, 0],
              scale: [1, 1.2, 1],
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
