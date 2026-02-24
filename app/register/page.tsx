"use client";

import Link from "next/link";
import { useState } from "react";
import { Terminal, Lock, ArrowRight, User, Globe, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API delay
        setTimeout(() => {
            // Get existing users
            const users = JSON.parse(localStorage.getItem("cypher_users") || "{}");

            // Extract values from new form structure
            const target: any = e.target;
            const codename = target[0].value;
            const team = target[1].value;
            const email = target[2].value;
            const password = target[3].value;
            // index 4 is clearance key

            if (users[email]) {
                alert("Operative ID already exists in the system.");
                setIsLoading(false);
                return;
            }

            // Create new user
            const userId = crypto.randomUUID();
            users[email] = {
                id: userId,
                email,
                password,
                codename,
                team,
                joinedAt: Date.now()
            };

            // Save users
            localStorage.setItem("cypher_users", JSON.stringify(users));

            // Auto-login
            localStorage.setItem("cypher_auth", userId);
            window.dispatchEvent(new Event("auth-change"));

            setIsLoading(false);
            router.push("/dashboard");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />

            <div className="w-full max-w-md bg-surface border border-border p-8 rounded-xl shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-300">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 text-primary">
                        <ShieldCheck size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-text mb-2">Join the Elite</h1>
                    <p className="text-text-muted">Create your agent identity to begin operations.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Codename</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-background border border-border rounded px-3 py-2 pl-9 focus:outline-none focus:border-primary transition-colors text-sm"
                                    placeholder="Ghost"
                                />
                                <div className="absolute left-3 top-2.5 text-text-muted">
                                    <User size={14} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Team</label>
                            <div className="relative">
                                <select
                                    className="w-full bg-background border border-border rounded px-3 py-2 pl-9 focus:outline-none focus:border-primary transition-colors text-sm appearance-none"
                                >
                                    <option>Red Team</option>
                                    <option>Blue Team</option>
                                    <option>Intel</option>
                                </select>
                                <div className="absolute left-3 top-2.5 text-text-muted">
                                    <Globe size={14} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Operative ID (Email)</label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                className="w-full bg-background border border-border rounded px-3 py-2 pl-9 focus:outline-none focus:border-primary transition-colors text-sm"
                                placeholder="operative@cypher.net"
                            />
                            <div className="absolute left-3 top-2.5 text-text-muted">
                                <Terminal size={14} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Secure Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                required
                                className="w-full bg-background border border-border rounded px-3 py-2 pl-9 focus:outline-none focus:border-primary transition-colors text-sm"
                                placeholder="••••••••"
                            />
                            <div className="absolute left-3 top-2.5 text-text-muted">
                                <Lock size={14} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Clearance Key (Optional)</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full bg-background border border-border rounded px-3 py-2 pl-9 focus:outline-none focus:border-primary transition-colors text-sm"
                                placeholder="XXXX-XXXX-XXXX"
                            />
                            <div className="absolute left-3 top-2.5 text-text-muted">
                                <ShieldCheck size={14} />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-background font-bold py-2 rounded hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-6"
                    >
                        {isLoading ? "ENCRYPTING PROFILE..." : (
                            <>
                                INITIALIZE PROTOCOL <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-text-muted">
                    Already an operative?{" "}
                    <Link href="/login" className="text-primary hover:underline font-bold">
                        Sign In
                    </Link>
                </div>
            </div >
        </div >
    );
}
