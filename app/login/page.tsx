"use client";

import Link from "next/link";
import { useState } from "react";
import { Terminal, Lock, ArrowRight, Github } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (status === "authenticated") {
            toast.success("Identity verified. Redirecting...");
            router.push("/dashboard");
        }
    }, [status, router]);

    useEffect(() => {
        if (error) {
            toast.error(`Authentication Error: ${error}`);
        }
    }, [error]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // Simulate API delay
        setTimeout(() => {
            // Get existing users
            const users = JSON.parse(localStorage.getItem("cypher_users") || "{}");

            // Check credentials
            const user = users[email] || users[email.toLowerCase()];

            // Hardcoded admin for dev
            if ((email === "admin@gmail.com" && password === "admin") || (user && user.password === password)) {
                // Login success
                const userId = user ? user.id : "admin-dev-id";
                if (!user) {
                    // create makeshift admin user in local storage if not exists for profile name
                    localStorage.setItem("cypher_users", JSON.stringify({
                        ...users,
                        "admin@gmail.com": {
                            id: "admin-dev-id",
                            email: "admin@gmail.com",
                            password: "admin",
                            codename: "Admin",
                            team: "Red Team",
                            joinedAt: Date.now()
                        }
                    }));
                }
                localStorage.setItem("cypher_auth", userId);
                window.dispatchEvent(new Event("auth-change"));
                router.push("/dashboard");
            } else {
                // Login failed
                alert("Invalid credentials!");
            }

            setIsLoading(false);
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
                        <Terminal size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-text mb-2">Welcome Back</h1>
                    <p className="text-text-muted">Enter your credentials to access the terminal.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Operative ID (Email)</label>
                        <div className="relative">
                            <input
                                name="email"
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
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Access Code</label>
                        <div className="relative">
                            <input
                                name="password"
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

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-background font-bold py-2 rounded hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-6"
                    >
                        {isLoading ? "AUTHENTICATING..." : (
                            <>
                                ACCESS SYSTEM <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                <div className="my-6 flex items-center gap-4 opacity-50">
                    <div className="h-px bg-border flex-1" />
                    <span className="text-[10px] text-text-muted uppercase tracking-widest">OR</span>
                    <div className="h-px bg-border flex-1" />
                </div>

                <button
                    onClick={() => {
                        setIsLoading(true);
                        signIn("google", { callbackUrl: "/dashboard" });
                    }}
                    disabled={isLoading}
                    className="w-full bg-white text-black font-bold py-2 rounded hover:bg-gray-200 transition-all flex items-center justify-center gap-2 mb-4"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.2z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    SIGN IN WITH GOOGLE
                </button>


                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-surface px-2 text-text-muted">Or continue with</span>
                    </div>
                </div>

                <button className="w-full bg-background border border-border text-text py-2.5 rounded-md hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 font-medium">
                    <Github size={18} />
                    GitHub
                </button>

                <div className="mt-8 text-center text-sm text-text-muted">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-primary hover:underline font-bold">
                        Initialize Protocol
                    </Link>
                </div>
            </div >
        </div >
    );
}
