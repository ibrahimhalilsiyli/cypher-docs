"use client";

import Link from "next/link";
import { Terminal, LogOut, User, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

    const navLinks = [
        { href: "/docs", label: "Documentation" },
        { href: "/training", label: "Training" },
        { href: "/tools", label: "Cyber Tools" },
        { href: "/workspace", label: "Workspace" },
        { href: "/ctf-radar", label: "CTF Radar" },
    ];

    return (
        <nav className="border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-mono font-bold text-lg text-primary hover:opacity-80 transition-opacity">
                    <Terminal size={20} />
                    <span>CypherDocs</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                    {navLinks.map(link => (
                        <Link key={link.href} href={link.href} className="hover:text-primary transition-colors">
                            {link.label}
                        </Link>
                    ))}

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

                {/* Mobile Controls */}
                <div className="flex md:hidden items-center gap-4">
                    <ThemeToggle />
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-text hover:text-primary transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-border bg-surface overflow-hidden"
                    >
                        <div className="flex flex-col p-4 gap-4">
                            {navLinks.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-lg font-medium hover:text-primary transition-colors py-2"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="h-px bg-border my-2" />
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 text-lg font-medium py-2"
                                    >
                                        <Terminal size={18} /> Dashboard
                                    </Link>
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 text-lg font-medium py-2"
                                    >
                                        <User size={18} /> Profile ({username || "USER"})
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="flex items-center gap-3 text-lg font-medium text-red-400 py-2"
                                    >
                                        <LogOut size={18} /> Sign Out
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full text-center py-3 rounded-md bg-primary text-white font-bold"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
