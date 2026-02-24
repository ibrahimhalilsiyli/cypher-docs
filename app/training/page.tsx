"use client";

import Link from "next/link";
import { Terminal, Shield, Cpu, Lock, Database, Globe, FileText, Repeat, ShieldAlert, Key, Eye, Flame, Bug, Network, Radio, FileSearch, Bomb, UserX, Code2, UserCheck, Zap, CheckCircle, ChevronDown, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { TRAINING_MODULES, ModuleCategory } from "@/lib/gamification";
import { useState, useEffect } from "react";

export default function TrainingPage() {
    const [completedModules, setCompletedModules] = useState<string[]>([]);
    const [userId, setUserId] = useState<string>("");
    // Track expanded state for each category. Defaulting all to false (collapsed).
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // Load user ID and completed modules
        const storedUserId = localStorage.getItem("cypher_auth");
        if (storedUserId) {
            setUserId(storedUserId);
            const savedModules = JSON.parse(localStorage.getItem(`cypher_completed_modules_${storedUserId}`) || "[]");
            setCompletedModules(savedModules);
        }
    }, []);

    const modules = TRAINING_MODULES;

    // Sorting Logic: Beginner (1) < Intermediate (2) < Advanced (3)
    const difficultyOrder: Record<string, number> = {
        "Beginner": 1,
        "Intermediate": 2,
        "Advanced": 3
    };

    const categories: ModuleCategory[] = ["Linux Systems", "Web Security", "Network Defense", "System Exploitation"];

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-4">
                        <Shield size={12} />
                        TRAINING_MODULES // V1.1
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Skill Acquisition</h1>
                    <p className="text-zinc-400 max-w-2xl">
                        Interactive scenarios designed to build practical security skills.
                        Select a category below to expand available modules.
                    </p>
                </header>

                <div className="space-y-6">
                    {categories.map((category) => {
                        const categoryModules = modules.filter(m => m.category === category).sort((a, b) => {
                            return (difficultyOrder[a.difficulty] || 99) - (difficultyOrder[b.difficulty] || 99);
                        });

                        if (categoryModules.length === 0) return null;

                        const isExpanded = expandedCategories[category];

                        return (
                            <section key={category} className="border border-border rounded-lg bg-surface/50 overflow-hidden transition-all">
                                <button
                                    onClick={() => toggleCategory(category)}
                                    className="w-full flex items-center justify-between p-6 hover:bg-surface transition-colors text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={clsx("p-2 rounded-lg bg-primary/10 text-primary transition-transform duration-300", isExpanded && "rotate-90")}>
                                            <ChevronRight size={20} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-text">{category}</h2>
                                            <p className="text-text-muted text-sm">{categoryModules.length} Modules Available</p>
                                        </div>
                                    </div>
                                    <div className="text-text-muted text-sm font-mono">
                                        {isExpanded ? "COLLAPSE [-]" : "EXPAND [+]"}
                                    </div>
                                </button>

                                <div className={clsx(
                                    "grid transition-all duration-300 ease-in-out",
                                    isExpanded ? "grid-rows-[1fr] opacity-100 p-6 pt-0" : "grid-rows-[0fr] opacity-0"
                                )}>
                                    <div className="overflow-hidden">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6 border-t border-border">
                                            {categoryModules.map((mod) => {
                                                const isCompleted = completedModules.includes(mod.id);

                                                return (
                                                    <Link
                                                        key={mod.id}
                                                        href={mod.href}
                                                        className={clsx(
                                                            "group relative p-6 rounded-lg border bg-background transition-all overflow-hidden flex flex-col h-full",
                                                            mod.status === "Locked"
                                                                ? "border-border opacity-50 cursor-not-allowed"
                                                                : isCompleted
                                                                    ? "border-green-500 shadow-[0_0_30px_-5px_rgba(34,197,94,0.3)] bg-green-500/5 scale-[1.02]"
                                                                    : "border-border hover:border-primary/50 hover:bg-surface hover:shadow-lg hover:shadow-primary/5"
                                                        )}
                                                    >
                                                        {isCompleted && (
                                                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent pointer-events-none" />
                                                        )}
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div className={clsx(
                                                                "p-3 rounded-lg",
                                                                mod.status === "Locked" ? "bg-surface text-text-muted" :
                                                                    isCompleted ? "bg-green-500/20 text-green-500" : "bg-primary/10 text-primary"
                                                            )}>
                                                                {isCompleted ? <CheckCircle size={24} /> : <mod.icon size={24} />}
                                                            </div>
                                                            <div className="flex flex-col items-end gap-1">
                                                                <span className={clsx(
                                                                    "text-[10px] font-mono px-2 py-0.5 rounded border uppercase",
                                                                    mod.difficulty === "Beginner" ? "border-green-500/20 text-green-500 bg-green-500/10" :
                                                                        mod.difficulty === "Intermediate" ? "border-yellow-500/20 text-yellow-500 bg-yellow-500/10" :
                                                                            "border-red-500/20 text-red-500 bg-red-500/10"
                                                                )}>
                                                                    {mod.difficulty}
                                                                </span>
                                                                <span className="text-[10px] font-mono text-text-muted flex items-center gap-1">
                                                                    <Zap size={10} className="text-yellow-500" /> +{mod.xp}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <h3 className={clsx("text-lg font-bold mb-2 transition-colors", isCompleted ? "text-green-500" : "text-text group-hover:text-primary")}>
                                                            {mod.title}
                                                        </h3>
                                                        <p className="text-text-muted text-xs mb-6 leading-relaxed line-clamp-2">
                                                            {mod.description}
                                                        </p>

                                                        <div className={clsx("flex items-center justify-between mt-auto pt-4 border-t", isCompleted ? "border-green-500/20" : "border-border")}>
                                                            <span className="text-[10px] font-mono text-zinc-500">
                                                                ID: {mod.id.toUpperCase()}
                                                            </span>
                                                            <span className={clsx(
                                                                "text-[10px] font-bold",
                                                                mod.status === "Locked" ? "text-zinc-600" :
                                                                    isCompleted ? "text-green-500" : "text-primary"
                                                            )}>
                                                                {mod.status === "Locked" ? "LOCKED" : isCompleted ? "COMPLETE" : "START ->"}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
