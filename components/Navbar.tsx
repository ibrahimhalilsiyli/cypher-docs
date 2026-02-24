"use client";

import Link from "next/link";
import { Terminal, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        const checkAuth = () => {
            const auth = localStorage.getItem("cypher_auth");
            setIsAuthenticated(!!auth);

            if (auth) {
                const users = JSON.parse(localStorage.getItem("cypher_users") || "{}");
                const userEmail = Object.keys(users).find(email => users[email].id === auth);
                if (userEmail) {
                    setUsername(users[userEmail].username);
                }
            }
        };

        checkAuth();

        window.addEventListener("storage", checkAuth);
        window.addEventListener("auth-change", checkAuth);

        return () => {
            window.removeEventListener("storage", checkAuth);
            window.removeEventListener("auth-change", checkAuth);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("cypher_auth");
        setIsAuthenticated(false);
        window.dispatchEvent(new Event("auth-change"));
        router.push("/");
    };

    return (
        <nav className="border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-mono font-bold text-lg text-primary hover:opacity-80 transition-opacity">
                    <Terminal size={20} />
                    <span>CypherDocs</span>
                </Link>
                <div className="flex items-center gap-6 text-sm font-medium">
                    <Link href="/docs" className="hover:text-primary transition-colors">Documentation</Link>
                    <Link href="/training" className="hover:text-primary transition-colors">Training</Link>
                    <Link href="/tools" className="hover:text-primary transition-colors">Cyber Tools</Link>
                    <Link href="/workspace" className="hover:text-primary transition-colors">Workspace</Link>
                    <Link href="/ctf-radar" className="hover:text-primary transition-colors">CTF Radar</Link>


                    <ThemeToggle />
                    <div className="w-px h-6 bg-border mx-2" />

                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="flex items-center gap-2 hover:text-primary transition-colors">
                                <Terminal size={16} />
                                Dashboard
                            </Link>
                            <Link href="/profile" className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border hover:border-primary/50 hover:text-primary transition-all text-xs font-mono">
                                <User size={14} />
                                {username || session?.user?.name?.split(" ")[0] || "USER"}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors ml-2"
                                title="Sign Out"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-hover transition-colors">
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
