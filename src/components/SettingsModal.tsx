import { motion, AnimatePresence } from "framer-motion";
import { X, Settings2, User, Cpu, ShieldCheck, Globe, Zap, Save, RefreshCw } from "lucide-react";
import { useState } from "react";
import type { UserSettings } from "@/hooks/useChat";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: UserSettings;
    onUpdate: (settings: Partial<UserSettings>) => void;
}

export function SettingsModal({ isOpen, onClose, settings, onUpdate }: SettingsModalProps) {
    const [activeTab, setActiveTab] = useState<"profile" | "model" | "api">("profile");
    const [localSettings, setLocalSettings] = useState(settings);

    const handleSave = () => {
        onUpdate(localSettings);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-md"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-background/80 backdrop-blur-2xl border border-border/50 rounded-[32px] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.3)] overflow-hidden"
                >
                    <div className="flex h-[500px]">
                        {/* Sidebar Tabs */}
                        <div className="w-48 border-r border-border/50 bg-secondary/20 p-4 flex flex-col gap-2">
                            <div className="flex items-center gap-2 px-3 py-4 mb-2">
                                <Settings2 size={20} className="text-primary" />
                                <span className="font-display font-bold text-sm uppercase tracking-wider italic">Settings</span>
                            </div>

                            <TabButton
                                active={activeTab === "profile"}
                                onClick={() => setActiveTab("profile")}
                                icon={<User size={18} />}
                                label="Identity"
                            />
                            <TabButton
                                active={activeTab === "model"}
                                onClick={() => setActiveTab("model")}
                                icon={<Cpu size={18} />}
                                label="Inference"
                            />
                            <TabButton
                                active={activeTab === "api"}
                                onClick={() => setActiveTab("api")}
                                icon={<Globe size={18} />}
                                label="Commercial"
                            />

                            <div className="mt-auto p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                <div className="flex items-center gap-2 text-primary mb-1">
                                    <ShieldCheck size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-tight text-primary/80">Pro License</span>
                                </div>
                                <p className="text-[9px] text-muted-foreground leading-tight">Your executive tier is active and verified.</p>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 flex flex-col">
                            <div className="flex items-center justify-between p-6 border-b border-border/30">
                                <h3 className="font-display text-lg font-bold text-foreground/80">
                                    {activeTab === "profile" && "Personalization"}
                                    {activeTab === "model" && "Inference Settings"}
                                    {activeTab === "api" && "Commercial Deployment"}
                                </h3>
                                <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                                    <X size={20} className="text-muted-foreground" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                                {activeTab === "profile" && (
                                    <>
                                        <InputGroup label="Display Name" description="How Muse addresses you.">
                                            <input
                                                type="text"
                                                value={localSettings.userName}
                                                onChange={(e) => setLocalSettings({ ...localSettings, userName: e.target.value })}
                                                className="w-full bg-secondary/50 border border-border/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                                placeholder="Master"
                                            />
                                        </InputGroup>
                                        <InputGroup label="Inference Personality" description="Custom system instructions for specialized tasks.">
                                            <textarea
                                                value={localSettings.systemPromptOverride}
                                                onChange={(e) => setLocalSettings({ ...localSettings, systemPromptOverride: e.target.value })}
                                                className="w-full bg-secondary/50 border border-border/30 rounded-xl px-4 py-3 text-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                                placeholder="Enter custom instructions..."
                                            />
                                        </InputGroup>
                                    </>
                                )}

                                {activeTab === "model" && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputGroup label="Model ID" description="Ollama model string.">
                                                <input
                                                    type="text"
                                                    value={localSettings.model}
                                                    onChange={(e) => setLocalSettings({ ...localSettings, model: e.target.value })}
                                                    className="w-full bg-secondary/50 border border-border/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                />
                                            </InputGroup>
                                            <InputGroup label="Temperature" description="Creativity vs Precision.">
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={localSettings.temperature}
                                                    onChange={(e) => setLocalSettings({ ...localSettings, temperature: parseFloat(e.target.value) })}
                                                    className="w-full bg-secondary/50 border border-border/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                />
                                            </InputGroup>
                                        </div>
                                        <InputGroup label="Context Window" description="Token memory length (Lower = Faster).">
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="range"
                                                    min="1024" max="32768" step="1024"
                                                    value={localSettings.contextLength}
                                                    onChange={(e) => setLocalSettings({ ...localSettings, contextLength: parseInt(e.target.value) })}
                                                    className="flex-1 h-1.5 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
                                                />
                                                <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded-md min-w-[60px] text-center">
                                                    {localSettings.contextLength}
                                                </span>
                                            </div>
                                        </InputGroup>
                                    </>
                                )}

                                {activeTab === "api" && (
                                    <>
                                        <InputGroup label="API Gateway" description="Commercial or Local Ollama endpoint.">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={localSettings.apiEndpoint}
                                                    onChange={(e) => setLocalSettings({ ...localSettings, apiEndpoint: e.target.value })}
                                                    className="flex-1 bg-secondary/50 border border-border/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                />
                                                <button className="p-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors">
                                                    <RefreshCw size={18} />
                                                </button>
                                            </div>
                                        </InputGroup>
                                        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-3">
                                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0">
                                                <Zap size={18} />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-emerald-600 mb-1 tracking-tight">Enterprise Infrastructure</h4>
                                                <p className="text-[11px] text-muted-foreground leading-normal">
                                                    By switching to a cloud endpoint, your Muse becomes accessible from anywhere. Ensure your commercial API keys are managed securely.
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="p-6 border-t border-border/30 flex justify-end gap-3 bg-secondary/10">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground transition-all"
                                >
                                    Discard
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    <Save size={18} />
                                    Authorize Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${active
                    ? "bg-white/10 text-primary shadow-sm border border-white/5"
                    : "text-muted-foreground hover:bg-secondary/50"
                }`}
        >
            <div className={`${active ? "text-primary" : "text-muted-foreground/60"}`}>{icon}</div>
            {label}
        </button>
    );
}

function InputGroup({ label, description, children }: { label: string, description: string, children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <div className="flex flex-col">
                <label className="text-sm font-bold text-foreground/80 tracking-tight">{label}</label>
                <span className="text-[11px] text-muted-foreground italic mb-2">{description}</span>
            </div>
            {children}
        </div>
    );
}
