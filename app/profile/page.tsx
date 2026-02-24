"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");

    useEffect(() => {
        const userId = localStorage.getItem("cypher_auth");
        if (!userId) {
            router.push("/login");
            return;
        }

        const users = JSON.parse(localStorage.getItem("cypher_users") || "{}");

        // Find user by ID
        const userEmail = Object.keys(users).find(email => users[email].id === userId);

        if (userEmail) {
            setUser({ ...users[userEmail], email: userEmail });
            setUsername(users[userEmail].codename || users[userEmail].username || "Unknown Operative");
        } else {
            router.push("/login");
        }
        setIsLoading(false);
    }, [router]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        setTimeout(() => {
            if (currentPassword !== user.password) {
                alert("Incorrect current password!");
                setIsSaving(false);
                return;
            }

            const users = JSON.parse(localStorage.getItem("cypher_users") || "{}");

            // Update user object
            if (users[user.email]) {
                users[user.email] = {
                    ...users[user.email],
                    codename: username, // Update codename
                    password: password || user.password
                };

                localStorage.setItem("cypher_users", JSON.stringify(users));
                window.dispatchEvent(new Event("auth-change"));

                alert("Profile updated successfully!");
                setPassword("");
                setCurrentPassword("");
                setUser({ ...users[user.email], email: user.email }); // Update local state
            }
            setIsSaving(false);
        }, 1000);
    };

    if (isLoading || !user) return <div className="min-h-screen bg-background flex items-center justify-center text-primary animate-pulse font-mono">LOADING_PROFILE_DATA...</div>;

    return (
        <div className="min-h-screen bg-background p-6 font-mono text-text">
            <div className="max-w-2xl mx-auto">
                <header className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="text-text-muted hover:text-text transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold">/user/profile</h1>
                </header>

                <div className="bg-surface border border-border rounded-lg p-8 shadow-xl">
                    <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary ring-2 ring-primary/20">
                            <User size={40} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-text">{user.codename || user.username || "Operative"}</h2>
                            <p className="text-text-muted text-sm mb-2">{user.email}</p>
                            <div className="flex gap-2">
                                <div className="inline-flex items-center px-2 py-1 rounded bg-green-500/10 text-green-500 text-xs border border-green-500/20">
                                    OPERATIVE_ACTIVE
                                </div>
                                {user.team && (
                                    <div className="inline-flex items-center px-2 py-1 rounded bg-blue-500/10 text-blue-500 text-xs border border-blue-500/20 uppercase">
                                        {user.team}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-text-muted mb-2 uppercase flex items-center gap-2">
                                <User size={14} /> Codename
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-background border border-border rounded px-4 py-2 text-text focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-text-muted mb-2 uppercase flex items-center gap-2">
                                <Mail size={14} /> Secure Email (Read-Only)
                            </label>
                            <input
                                type="text"
                                value={user.email}
                                disabled
                                className="w-full bg-background/50 border border-border rounded px-4 py-2 text-text-muted cursor-not-allowed"
                            />
                        </div>

                        <div className="pt-4 border-t border-border">
                            <h3 className="text-sm font-bold text-text mb-4">Security Credentials</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-text-muted mb-2 uppercase flex items-center gap-2">
                                        <Lock size={14} /> New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Leave blank to keep current"
                                        className="w-full bg-background border border-border rounded px-4 py-2 text-text focus:outline-none focus:border-primary transition-colors placeholder:text-text-muted"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-text-muted mb-2 uppercase flex items-center gap-2">
                                        <Lock size={14} /> Confirm Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Required to save changes"
                                        className="w-full bg-background border border-border rounded px-4 py-2 text-text focus:outline-none focus:border-primary transition-colors placeholder:text-text-muted"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="bg-primary text-background font-bold px-6 py-2 rounded hover:bg-primary/90 transition-all flex items-center gap-2"
                            >
                                {isSaving ? (
                                    <>SAVING...</>
                                ) : (
                                    <>
                                        <Save size={16} /> SAVE CHANGES
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
