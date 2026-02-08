import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, FileCode2, Download } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `muse-artifact.${language || "txt"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="my-8 overflow-hidden rounded-[1.25rem] border border-border bg-card shadow-sm group transition-all hover:shadow-md"
    >
      {/* File Card Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-secondary/30 border-b border-border transition-colors group-hover:bg-secondary/40">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background border border-border text-primary shadow-sm">
            <FileCode2 size={22} className="opacity-80" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground tracking-tight">Project Artifact</span>
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mt-0.5">
              Source · {language || "text"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-muted-foreground hover:text-foreground transition-all"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-background hover:bg-secondary text-[11px] font-bold text-foreground transition-all shadow-sm shadow-black/[0.02]"
          >
            <Download size={14} />
            Download
          </motion.button>
        </div>
      </div>

      {/* Code Area */}
      <div className="relative">
        <pre className="p-6 overflow-x-auto chat-scrollbar bg-transparent">
          <code className="text-[13px] font-mono leading-relaxed text-foreground/80 whitespace-pre">
            {code}
          </code>
        </pre>
      </div>
    </motion.div>
  );
}
