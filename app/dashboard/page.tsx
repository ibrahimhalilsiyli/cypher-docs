"use client";

import Link from "next/link";
import { Plus, Search, Trash2, FileText, Save, LayoutDashboard, Notebook, Award, Activity, CheckCircle, Clock, Target, Trophy, Zap, Shield, Crown, Code, Bug, Eye, Lock, Terminal, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { getRank, getNextRank, getProgressToNextRank, RANKS, BADGES, TRAINING_MODULES, ActivityLog } from "@/lib/gamification";
import { formatDistanceToNow } from "date-fns"; // We might need this, or just write a simple helper

interface Note {
    id: string;
    title: string;
    content: string;
    date: string;
}

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState("overview");
    const [notes, setNotes] = useState<Note[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("Operative");
    const [userXP, setUserXP] = useState(0);
    const [completedModules, setCompletedModules] = useState<string[]>([]);
    const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]); // Dynamic Log
    const [showModulesModal, setShowModulesModal] = useState(false);
    const router = useRouter();

    const { data: session, status } = useSession();

    useEffect(() => {
        // Wait for NextAuth to load
        if (status === "loading") return;

        // Check authentication
        const userId = localStorage.getItem("cypher_auth");

        // If no local auth but we have a session, let SessionSync handle it (wait a bit)
        if (!userId && status === "authenticated") {
            // Tiny delay to allow SessionSync to write to localStorage
            const checkSync = setInterval(() => {
                if (localStorage.getItem("cypher_auth")) {
                    clearInterval(checkSync);
                    setIsAuthenticated(true);
                    window.location.reload(); // Reload to pick up the new user state
                }
            }, 100);
            return;
        }

        if (!userId && status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (userId) {
            setIsAuthenticated(true);

            // Get User Details
            const users = JSON.parse(localStorage.getItem("cypher_users") || "{}");
            const userEmail = Object.keys(users).find(email => users[email].id === userId);
            if (userEmail) {
                setUsername(users[userEmail].username || users[userEmail].codename);
            }

            // Load XP
            const xp = parseInt(localStorage.getItem(`cypher_xp_${userId}`) || "0");
            setUserXP(xp);

            // Load Completed Modules
            const savedModules = JSON.parse(localStorage.getItem(`cypher_completed_modules_${userId}`) || "[]");
            setCompletedModules(savedModules);

            // Load Activity Log
            const logs: ActivityLog[] = JSON.parse(localStorage.getItem(`cypher_activity_${userId}`) || "[]");
            setRecentActivity(logs);

            // Load Notes
            const storageKey = `cypher_notes_${userId}`;
            const savedNotes = localStorage.getItem(storageKey);

            if (savedNotes) {
                setNotes(JSON.parse(savedNotes));
            } else {
                // Default welcome note
                setNotes([{
                    id: "1",
                    title: "Mission Briefing",
                    content: "Welcome to your workspace agent. Use this encrypted storage to keep track of your findings during training missions.",
                    date: new Date().toLocaleDateString()
                }]);
            }
        }
    }, [router, status]);

    // Save notes to localStorage whenever they change
    useEffect(() => {
        const userId = localStorage.getItem("cypher_auth");
        if (notes.length > 0 && isAuthenticated && userId) {
            const storageKey = `cypher_notes_${userId}`;
            localStorage.setItem(storageKey, JSON.stringify(notes));
        }
    }, [notes, isAuthenticated]);

    if (!isAuthenticated) {
        return null; // Or a loading spinner
    }

    const addNote = () => {
        const newNote: Note = {
            id: Date.now().toString(),
            title: "New Operation",
            content: "Enter mission details...",
            date: new Date().toLocaleDateString()
        };
        setNotes([newNote, ...notes]);
        setActiveTab("notes"); // Switch to notes tab on new note
    };

    const deleteNote = (id: string) => {
        setNotes(notes.filter(note => note.id !== id));
    };

    const updateNote = (id: string, field: 'title' | 'content', value: string) => {
        setNotes(notes.map(note =>
            note.id === id ? { ...note, [field]: value } : note
        ));
    };

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentRank = getRank(userXP);
    const nextRank = getNextRank(userXP);
    const progress = getProgressToNextRank(userXP);

    // Calculate Completion Rate
    const completionRate = Math.round((completedModules.length / TRAINING_MODULES.length) * 100);

    // Helper for simple time ago (without external lib to keep it zero dep if possible, but simplest is usually just string)
    // Actually, let's just use a simple formatter since we can't install deps mid-flight easily without verify.
    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return "Just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const stats = [
        {
            label: "Modules Completed",
            value: `${completedModules.length}/${TRAINING_MODULES.length}`,
            icon: CheckCircle,
            color: "text-green-500",
            onClick: () => setShowModulesModal(true)
        },
        { label: "Current Rank", value: currentRank.name, icon: Trophy, color: "text-yellow-500" },
        { label: "Total XP", value: userXP, icon: Zap, color: "text-purple-500" },
        { label: "Completion Rate", value: `${completionRate}%`, icon: BarChart3, color: "text-blue-500" }, // Replaced Accuracy with Completion Rate
    ];

    return (
        <div className="min-h-screen p-6 font-mono text-text">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, <span className="text-primary">{username}</span>.</h1>
                    <p className="text-text-muted">System Status: <span className="text-green-500">ONLINE</span> // Security Level: <span className="text-yellow-500">ELEVATED</span></p>
                </header>

                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-border mb-8">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={clsx(
                            "pb-4 flex items-center gap-2 transition-all hover:text-primary",
                            activeTab === "overview" ? "border-b-2 border-primary text-primary font-bold" : "text-text-muted"
                        )}
                    >
                        <LayoutDashboard size={18} /> Mission Control
                    </button>
                    <button
                        onClick={() => setActiveTab("notes")}
                        className={clsx(
                            "pb-4 flex items-center gap-2 transition-all hover:text-primary",
                            activeTab === "notes" ? "border-b-2 border-primary text-primary font-bold" : "text-text-muted"
                        )}
                    >
                        <Notebook size={18} /> Operative Notes
                    </button>
                    <button
                        onClick={() => setActiveTab("achievements")}
                        className={clsx(
                            "pb-4 flex items-center gap-2 transition-all hover:text-primary",
                            activeTab === "achievements" ? "border-b-2 border-primary text-primary font-bold" : "text-text-muted"
                        )}
                    >
                        <Award size={18} /> Achievements
                    </button>
                </div>

                {/* OVERVIEW TAB */}
                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Stats Row */}
                        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {stats.map((stat, i) => (
                                <div
                                    key={i}
                                    onClick={stat.onClick}
                                    className={clsx(
                                        "bg-surface border border-border p-6 rounded-lg flex items-center gap-4 transition-all",
                                        stat.onClick ? "cursor-pointer hover:border-primary/50 hover:bg-surface/80" : ""
                                    )}
                                >
                                    <div className={clsx("p-3 rounded-full bg-white/5", stat.color)}>
                                        <stat.icon size={24} />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <div className="text-xs text-text-muted uppercase">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* COMPLETED MODULES MODAL */}
                        {showModulesModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                                <div className="bg-surface border border-white/10 rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl relative">
                                    <button
                                        onClick={() => setShowModulesModal(false)}
                                        className="absolute top-4 right-4 text-text-muted hover:text-text"
                                    >
                                        <span className="sr-only">Close</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>

                                    <div className="p-6 border-b border-border">
                                        <h2 className="text-2xl font-bold flex items-center gap-2">
                                            <CheckCircle className="text-green-500" /> Completed Modules
                                        </h2>
                                        <p className="text-text-muted mt-1">
                                            {completedModules.length} / {TRAINING_MODULES.length} modules mastered.
                                        </p>
                                    </div>

                                    <div className="overflow-y-auto p-6 space-y-3">
                                        {completedModules.length === 0 ? (
                                            <div className="text-center py-12 text-text-muted">
                                                <Target size={48} className="mx-auto mb-4 opacity-20" />
                                                <p>No modules completed yet.</p>
                                                <Link href="/training" className="text-primary hover:underline mt-2 inline-block">Start Training</Link>
                                            </div>
                                        ) : (
                                            TRAINING_MODULES.filter(m => completedModules.includes(m.id)).map(mod => (
                                                <div key={mod.id} className="flex items-center justify-between p-4 bg-green-500/5 rounded-lg border border-green-500/20 shadow-sm">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-green-500/10 text-green-500 rounded">
                                                            <mod.icon size={20} />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-text">{mod.title}</div>
                                                            <div className="text-xs text-text-muted">{mod.id}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className={clsx(
                                                            "text-[10px] uppercase px-2 py-1 rounded border",
                                                            mod.difficulty === "Beginner" ? "border-green-500/20 text-green-500 bg-green-500/10" :
                                                                mod.difficulty === "Intermediate" ? "border-yellow-500/20 text-yellow-500 bg-yellow-500/10" :
                                                                    "border-red-500/20 text-red-500 bg-red-500/10"
                                                        )}>
                                                            {mod.difficulty}
                                                        </span>
                                                        <div className="text-green-500 font-mono text-xs flex items-center gap-1">
                                                            <CheckCircle size={14} /> DONE
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <div className="p-4 border-t border-border bg-surface/50 flex justify-end">
                                        <button
                                            onClick={() => setShowModulesModal(false)}
                                            className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary/80 transition-colors"
                                        >
                                            Close Record
                                        </button>
                                    </div>

                                </div>
                            </div>
                        )}

                        {/* Recent Activity */}
                        <div className="lg:col-span-2 bg-surface border border-border rounded-lg p-6">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Activity size={20} className="text-primary" /> Activity Log
                            </h3>
                            <div className="space-y-6">
                                {recentActivity.length === 0 ? (
                                    <p className="text-text-muted text-sm italic">No recent activity to display. Start a module to begin tracking.</p>
                                ) : (
                                    recentActivity.map((activity) => (
                                        <div key={activity.id} className="flex items-start gap-4 pb-6 border-b border-border last:border-0 last:pb-0">
                                            <div className="mt-1 text-primary">
                                                <CheckCircle size={16} />
                                            </div>
                                            <div>
                                                <p className="font-bold">{activity.action}: <span className="text-primary">{activity.target}</span></p>
                                                <p className="text-xs text-text-muted">{timeAgo(activity.timestamp)}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Recommended Next Step */}
                        <div className="bg-surface border border-border rounded-lg p-6 flex flex-col">
                            <h3 className="text-xl font-bold mb-4">Recommended Mission</h3>
                            <div className="flex-1 flex flex-col justify-center items-center text-center p-6 border border-dashed border-border rounded bg-black/20">
                                <Target size={48} className="text-red-500 mb-4" />
                                <h4 className="text-lg font-bold mb-2">Network Reconnaissance</h4>
                                <p className="text-sm text-text-muted mb-6">Master Nmap scanning to identify potential targets in the network.</p>
                                <Link href="/training/network-recon" className="px-6 py-2 bg-primary text-black font-bold rounded hover:bg-primary-hover transition-colors w-full">
                                    START_MISSION
                                </Link>
                            </div>
                        </div>
                    </div>
                )}


                {/* NOTES TAB */}
                {activeTab === "notes" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                            <div className="relative flex-1 md:max-w-md w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <input
                                    type="text"
                                    placeholder="Filter classified docs..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-sm text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-zinc-700"
                                />
                            </div>
                            <button
                                onClick={addNote}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold rounded-sm hover:bg-primary-hover transition-colors w-full md:w-auto justify-center"
                            >
                                <Plus size={16} />
                                NEW_FILE
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredNotes.length === 0 ? (
                                <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-lg bg-surface/50">
                                    <p className="text-text-muted mb-4 opacity-70">No encrypted notes found.</p>
                                    <button onClick={addNote} className="text-primary hover:underline">Initialize new dossier</button>
                                </div>
                            ) : (
                                filteredNotes.map(note => (
                                    <div key={note.id} className="group bg-surface border border-border p-4 rounded-sm hover:border-primary/50 transition-all shadow-sm hover:shadow-md relative">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1 mr-2">
                                                <input
                                                    value={note.title}
                                                    onChange={(e) => updateNote(note.id, 'title', e.target.value)}
                                                    className="w-full bg-transparent font-bold text-lg focus:outline-none focus:text-primary placeholder:text-zinc-600"
                                                    placeholder="Untitled"
                                                />
                                                <div className="text-xs text-text-muted mt-1">{note.date}</div>
                                            </div>
                                            <button
                                                onClick={() => deleteNote(note.id)}
                                                className="text-text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                                title="Delete Note"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        <textarea
                                            value={note.content}
                                            onChange={(e) => updateNote(note.id, 'content', e.target.value)}
                                            className="w-full h-32 bg-background/50 border border-border/50 rounded-sm p-2 text-sm resize-none focus:outline-none focus:border-primary/30 text-text-muted/90"
                                            placeholder="Start typing..."
                                        />
                                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="flex items-center gap-1 text-[10px] text-primary">
                                                <Save size={10} />
                                                SAVED
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* ACHIEVEMENTS TAB */}
                {activeTab === "achievements" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Career Progression - Rank */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Crown className="text-yellow-500" /> Career Progression
                            </h2>
                            <div className="bg-surface border border-border p-8 rounded-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                                    <div className={clsx("p-6 rounded-full bg-black/40 border-4 border-dashed", currentRank.color.replace('text-', 'border-'))}>
                                        <currentRank.icon size={64} className={currentRank.color} />
                                    </div>
                                    <div className="flex-1 w-full text-center md:text-left">
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <div className="text-sm text-text-muted mb-1">CURRENT RANK</div>
                                                <div className={clsx("text-4xl font-bold", currentRank.color)}>{currentRank.name}</div>
                                            </div>
                                            <div className="text-right hidden md:block">
                                                <div className="text-xs text-text-muted mb-1">TOTAL EXPERIENCE</div>
                                                <div className="text-3xl font-bold text-white flex items-center justify-end gap-2">
                                                    <Zap className="text-yellow-500" size={24} /> {userXP}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-text-muted mb-4 max-w-lg text-sm">
                                            {nextRank
                                                ? `Earn ${nextRank.minXP - userXP} more XP to reach ${nextRank.name}.`
                                                : "You have reached the pinnacle of cyber excellence."}
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="relative mb-2">
                                            <div className="flex justify-between text-xs font-mono text-text-muted mb-1">
                                                <span>PROGRESS</span>
                                                <span className="text-primary">{Math.floor(progress)}%</span>
                                            </div>
                                            <div className="w-full h-4 bg-black/50 rounded-full overflow-hidden border border-white/5 relative">
                                                <div
                                                    className="h-full bg-gradient-to-r from-primary/50 to-primary transition-all duration-1000 relative"
                                                    style={{ width: `${progress}%` }}
                                                >
                                                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mobile Only Total XP */}
                                        <div className="md:hidden mt-4 flex items-center justify-center gap-2 text-xl font-bold text-white">
                                            <Zap className="text-yellow-500" size={20} /> {userXP} XP
                                        </div>

                                        <div className="mt-6 border-t border-white/10 pt-4 flex justify-end">
                                            <button
                                                onClick={() => {
                                                    if (confirm("WARNING: This will reset all your XP and Badge progress. Are you sure?")) {
                                                        const userId = localStorage.getItem("cypher_auth");
                                                        if (userId) {
                                                            localStorage.removeItem(`cypher_xp_${userId}`);
                                                            localStorage.removeItem(`cypher_completed_modules_${userId}`);
                                                            localStorage.removeItem(`cypher_activity_${userId}`); // Clear activity log too
                                                            setUserXP(0);
                                                            setCompletedModules([]);
                                                            window.location.reload();
                                                        }
                                                    }
                                                }}
                                                className="text-[10px] text-red-500 hover:text-red-400 flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={10} /> RESET_CAREER_PROGRESS
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Badges Grid */}
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Award className="text-primary" /> Certifications & Badges
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...BADGES].sort((a, b) => a.xpReq - b.xpReq).map((badge) => {
                                const isUnlocked = userXP >= badge.xpReq;

                                // Determine difficulty label based on XP
                                let difficulty = "Beginner";
                                let difficultyColor = "text-green-500 bg-green-500/10 border-green-500/20";
                                if (badge.xpReq >= 5000) {
                                    difficulty = "Advanced";
                                    difficultyColor = "text-red-500 bg-red-500/10 border-red-500/20";
                                } else if (badge.xpReq >= 1000) {
                                    difficulty = "Intermediate";
                                    difficultyColor = "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
                                }

                                return (
                                    <div
                                        key={badge.id}
                                        className={clsx(
                                            "bg-surface border p-6 rounded-lg text-center relative overflow-hidden group transition-all",
                                            isUnlocked
                                                ? "border-green-500/30 shadow-[0_0_15px_-5px_rgba(34,197,94,0.3)]"
                                                : "border-border opacity-60 grayscale hover:opacity-80 hover:grayscale-0"
                                        )}
                                    >
                                        <div className={clsx(
                                            "absolute inset-0 transition-opacity duration-500",
                                            isUnlocked ? "bg-green-500/5 group-hover:bg-green-500/10 opacity-100" : "bg-transparent opacity-0"
                                        )} />

                                        {/* Difficulty Tag */}
                                        <div className="absolute top-2 right-2">
                                            <span className={clsx("text-[10px] font-mono px-2 py-0.5 rounded border uppercase", difficultyColor)}>
                                                {difficulty}
                                            </span>
                                        </div>

                                        <div className="relative z-10 pt-2">
                                            <badge.icon
                                                size={48}
                                                className={clsx(
                                                    "mx-auto mb-4 transition-colors duration-300",
                                                    isUnlocked ? "text-green-500" : "text-zinc-600 group-hover:text-zinc-400"
                                                )}
                                            />
                                            <h3 className={clsx("font-bold mb-2", isUnlocked ? "text-white" : "text-zinc-400")}>
                                                {badge.name}
                                            </h3>
                                            <p className="text-xs text-text-muted mb-4 h-8 flex items-center justify-center">
                                                {badge.desc}
                                            </p>

                                            {isUnlocked ? (
                                                <div className="flex justify-center flex-col items-center gap-2">
                                                    <div className="text-[10px] font-mono text-green-500 flex items-center gap-1">
                                                        <CheckCircle size={12} /> ACQUIRED
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mt-2 text-left">
                                                    <div className="flex justify-between text-[10px] text-text-muted mb-1 px-1">
                                                        <span>LOCKED</span>
                                                        <span>{Math.floor((userXP / badge.xpReq) * 100)}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-black/50 rounded-full overflow-hidden w-full">
                                                        <div
                                                            className="h-full bg-zinc-600 transition-all duration-500"
                                                            style={{ width: `${Math.min(100, (userXP / badge.xpReq) * 100)}%` }}
                                                        />
                                                    </div>
                                                    <div className="mt-1 text-[10px] font-mono text-zinc-500 text-center">
                                                        Req: {badge.xpReq} XP
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
