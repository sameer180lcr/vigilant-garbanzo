import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Code2, Monitor, X, ChevronRight, Terminal, FileCode, RefreshCw } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { ghcolors } from "react-syntax-highlighter/dist/esm/styles/prism";

interface IDEPanelProps {
    code: string;
    language: string;
    isOpen: boolean;
    onClose: () => void;
    isSyncing?: boolean;
}

export function IDEPanel({ code, language, isOpen, onClose, isSyncing }: IDEPanelProps) {
    const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
    const [previewContent, setPreviewContent] = useState("");
    const codeContainerRef = useRef<HTMLDivElement>(null);
    const prevSyncingRef = useRef(isSyncing);

    // Auto-scroll code while generating
    useEffect(() => {
        if (isSyncing && codeContainerRef.current) {
            codeContainerRef.current.scrollTo({
                top: codeContainerRef.current.scrollHeight,
                behavior: "auto"
            });
        }
    }, [code, isSyncing]);

    // Auto-switch to preview when complete
    useEffect(() => {
        if (prevSyncingRef.current === true && isSyncing === false && code && activeTab === "code") {
            setActiveTab("preview");
        }
        prevSyncingRef.current = isSyncing;
    }, [isSyncing, code, activeTab]);

    useEffect(() => {
        if (activeTab === "preview") {
            setPreviewContent(code);
        }
    }, [code, activeTab]);

    const isWebCode = ["html", "css", "javascript", "typescript", "jsx", "tsx"].includes(language.toLowerCase());

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    layout
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "45vw", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25, mass: 1 }}
                    className="relative h-full bg-card border-l border-border shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)] z-50 flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/10 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Code2 size={20} />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-display font-semibold text-sm text-foreground tracking-tight">Design Lab</h3>
                                {isSyncing && (
                                    <div className="flex items-center gap-1.5 text-[10px] text-primary font-mono uppercase tracking-widest mt-0.5">
                                        <RefreshCw size={10} />
                                        Syncing
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                            <div className="flex bg-muted p-1 rounded-xl">
                                <button
                                    onClick={() => setActiveTab("code")}
                                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === "code" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    <FileCode size={14} />
                                    Code
                                </button>
                                <button
                                    onClick={() => setActiveTab("preview")}
                                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === "preview" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    <Monitor size={14} />
                                    Preview
                                </button>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-muted rounded-xl text-muted-foreground transition-colors"
                                aria-label="Close Design Lab"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden relative flex flex-col bg-background">
                        {activeTab === "code" ? (
                            <>
                                <div className="flex items-center justify-between px-6 py-2.5 bg-secondary/5 text-[11px] font-mono text-muted-foreground border-b border-border/40">
                                    <div className="flex items-center gap-2">
                                        <ChevronRight size={12} />
                                        main.{language || "html"}
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-border" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-border" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-border" />
                                    </div>
                                </div>
                                <div
                                    ref={codeContainerRef}
                                    className="flex-1 overflow-auto chat-scrollbar"
                                >
                                    <SyntaxHighlighter
                                        language={language.toLowerCase() === "html" ? "html" : language.toLowerCase()}
                                        style={ghcolors}
                                        customStyle={{
                                            margin: 0,
                                            padding: "32px",
                                            fontSize: "14px",
                                            lineHeight: "1.7",
                                            background: "transparent",
                                        }}
                                        wrapLines={true}
                                        codeTagProps={{
                                            style: {
                                                fontFamily: '"JetBrains Mono", monospace',
                                            }
                                        }}
                                    >
                                        {code}
                                    </SyntaxHighlighter>
                                </div>
                                <div className="p-6 border-t border-border bg-card/50 backdrop-blur-sm">
                                    <motion.button
                                        whileHover={{ scale: 1.01, backgroundColor: "hsl(var(--primary))", color: "white" }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => setActiveTab("preview")}
                                        className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-foreground text-background font-bold text-sm shadow-xl transition-all"
                                    >
                                        <Play size={18} fill="currentColor" />
                                        Live Render in Host
                                    </motion.button>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col bg-white">
                                {isWebCode ? (
                                    <iframe
                                        title="Live Preview"
                                        srcDoc={language === "html" ? previewContent : `<html><head><style>body{margin:0;font-family:sans-serif;}</style></head><body><script>${previewContent}</script></body></html>`}
                                        className="flex-1 w-full border-none"
                                    />
                                ) : (
                                    <div className="flex-1 flex flex-col bg-card p-12 font-mono text-[13px]">
                                        <div className="flex items-center gap-3 text-primary mb-8 border-l-2 border-primary pl-4">
                                            <Terminal size={22} />
                                            <span className="font-bold tracking-tight uppercase text-base">Execution Engine</span>
                                        </div>
                                        <div className="text-muted-foreground mb-4 font-mono bg-muted/30 p-4 rounded-xl border border-border">
                                            <span className="text-primary mr-2">$</span> run {language} main.{language}
                                        </div>
                                        <div className="text-secondary-foreground opacity-80 animate-pulse mb-8 pl-4">
                                            Establishing handshake with Muse local host...
                                        </div>
                                        <div className="p-8 rounded-3xl bg-secondary/30 border border-border text-sm text-foreground/60 leading-relaxed italic shadow-inner">
                                            Muse is synthesizing your local environment. Your project files are being prepared for high-fidelity preview.
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
