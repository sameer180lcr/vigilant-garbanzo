import { motion } from "framer-motion";

interface StreamingWordProps {
  word: string;
  index: number;
}

export function StreamingWord({ word, index }: StreamingWordProps) {
  // Whitespace — render as-is, no animation
  if (/^\s+$/.test(word)) {
    return <>{word}</>;
  }

  return (
    <motion.span
      initial={{ opacity: 0, y: 4, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        type: "spring" as const,
        stiffness: 500,
        damping: 30,
        mass: 0.4,
      }}
      className="inline"
    >
      {word}
    </motion.span>
  );
}
