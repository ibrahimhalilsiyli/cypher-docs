import Link from "next/link";
import { Terminal, Shield, BookOpen, Users, ChevronRight, Lock } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col">

            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-20 md:py-32 px-6 border-b border-border bg-grid-pattern relative overflow-hidden">
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-6">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            v2.0 RELEASED
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-text">
                            Master the Art of <br />
                            <span className="text-primary">Cybersecurity</span>
                        </h1>

                        <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
                            The premier platform for security professionals.
                            Interactive labs, structured documentation, and a community of elite hackers.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/training"
                                className="px-8 py-4 rounded-md bg-primary text-white font-bold hover:bg-primary-hover transition-all flex items-center gap-2"
                            >
                                Start Training <ChevronRight size={16} />
                            </Link>
                            <Link
                                href="/docs"
                                className="px-8 py-4 rounded-md bg-surface border border-border hover:border-primary/50 transition-all font-mono"
                            >
                                Read the Docs
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Feature Grid */}
                <section className="py-24 px-6 max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
                        <p className="text-text-muted">Everything you need to advance your career.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Link href="/training" className="block p-8 rounded-lg bg-surface border border-border hover:border-primary/50 transition-all group hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                                <Terminal size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Interactive Labs</h3>
                            <p className="text-text-muted leading-relaxed">
                                Practice in real browser-based terminal environments. No VPN or VM setup required.
                            </p>
                        </Link>

                        <Link href="/docs" className="block p-8 rounded-lg bg-surface border border-border hover:border-secondary/50 transition-all group hover:shadow-lg hover:shadow-secondary/5 cursor-pointer">
                            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6 text-secondary group-hover:scale-110 transition-transform">
                                <BookOpen size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-secondary transition-colors">Structured Knowledge</h3>
                            <p className="text-text-muted leading-relaxed">
                                Curated documentation and cheat sheets for every major vulnerability class.
                            </p>
                        </Link>

                        <Link href="/dashboard" className="block p-8 rounded-lg bg-surface border border-border hover:border-accent/50 transition-all group hover:shadow-lg hover:shadow-accent/5 cursor-pointer">
                            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-6 text-accent group-hover:scale-110 transition-transform">
                                <Users size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">Community Driven</h3>
                            <p className="text-text-muted leading-relaxed">
                                Share notes, contribute to the knowledge base, and collaborate with teams.
                            </p>
                        </Link>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-6 border-t border-border bg-surface/50">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8 text-primary">
                            <Lock size={32} />
                        </div>
                        <h2 className="text-4xl font-bold mb-6">Ready to break in?</h2>
                        <p className="text-text-muted mb-10 text-lg">
                            Join thousands of security professionals leveling up their skills on CypherDocs.
                        </p>
                        <Link href="/register" className="inline-block px-8 py-4 rounded-md bg-primary text-white font-bold hover:bg-primary-hover transition-colors">
                            Create Free Account
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-border py-12 px-6 bg-background">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-text-muted">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <Terminal size={16} />
                        <span className="font-mono">CypherDocs © 2024</span>
                    </div>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-primary">Privacy</Link>
                        <Link href="#" className="hover:text-primary">Terms</Link>
                        <Link href="#" className="hover:text-primary">Status</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
