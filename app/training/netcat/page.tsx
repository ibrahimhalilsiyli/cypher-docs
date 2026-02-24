"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import { ArrowLeft, CheckCircle2, Radio } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NetcatLesson() {
    const [step, setStep] = useState(0);
    const [completed, setCompleted] = useState(false);

    const steps = [
        {
            title: "Listening for Connections",
            instruction: "Netcat is the Swiss Army knife of networking. First, set up a listener on port 4444 to receive incoming connections: 'nc -lvnp 4444'",
            expected: "nc -lvnp 4444",
            validate: (cmd: string) => cmd === "nc -lvnp 4444",
            response: (
                <div className="text-text-muted">
                    <div>listening on [any] 4444 ...</div>
                </div>
            )
        },
        {
            title: "Catching a Reverse Shell",
            instruction: "A target server is executing a reverse shell payload pointing to our IP. Wait for the connection...",
            expected: "wait",
            validate: (cmd: string) => true, // Auto-advance simulation
            response: (
                <div className="text-text-muted">
                    <div>connect to [10.10.14.2] from (UNKNOWN) [10.10.10.5] 53211</div>
                    <div className="text-green-400 font-bold">$ whoami</div>
                    <div>www-data</div>
                </div>
            )
        },
        {
            title: "Upgrading to Interactive TTY",
            instruction: "We have a shell, but it's dumb (no tab completion, no history). Upgrade it using Python: 'python3 -c \"import pty; pty.spawn('/bin/bash')\"'",
            expected: "python3 -c \"import pty; pty.spawn('/bin/bash')\"",
            validate: (cmd: string) => cmd.includes("python3 -c"),
            response: (
                <div className="text-text-muted">
                    <div>www-data@target:/var/www/html$</div>
                    <div className="text-zinc-500">Shell stabilized.</div>
                </div>
            )
        }
    ];

    const handleCommand = (cmd: string) => {

        // Special auto-advance logic for step 1 (waiting for connection)
        if (step === 1) {
            setTimeout(() => {
                setStep(step + 1);
            }, 1500); // Simulate incoming connection delay
            return steps[step].response;
        }

        const currentTask = steps[step];

        if (currentTask.validate(cmd)) {
            setTimeout(() => {
                if (step < steps.length - 1) {
                    setStep(step + 1);
                } else {
                    setCompleted(true);
                    // Award XP
                    import("@/lib/gamification").then(({ completeModule }) => {
                        completeModule("netcat");
                    });
                }
            }, 2000);

            return (
                <div>
                    {currentTask.response}
                    {step === 2 && (
                        <div className="mt-2 text-primary font-mono text-xs animate-pulse">
                            [✔] LISTENER_ACTIVE. SHELL_CAUGHT.
                        </div>
                    )}
                </div>
            );
        }

        if (cmd === "help") return "Commands: nc [options]";

        return <span className="text-red-400 font-mono">zsh: command not found: {cmd.split(" ")[0]}</span>;
    };

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row font-mono">
            <div className="w-full md:w-1/3 bg-surface border-r border-border p-8 flex flex-col">
                <Link href="/training" className="inline-flex items-center text-text-muted hover:text-primary mb-8 transition-colors">
                    <ArrowLeft size={16} className="mr-2" />
                    Abort Mission
                </Link>
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2 text-primary">
                        <Radio size={20} />
                        <h1 className="text-2xl font-bold">Netcat Mastery</h1>
                    </div>
                    <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step) / steps.length) * 100}%` }} />
                    </div>
                </div>
                {completed ? (
                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
                        <CheckCircle2 size={32} className="text-primary mb-4" />
                        <h3 className="text-xl font-bold text-primary mb-2">Listener Ready</h3>
                        <p className="text-text-muted mb-4">You have successfully intercepted a reverse shell connection.</p>
                        <Link href="/training" className="block w-full py-2 bg-primary text-white font-bold text-center rounded hover:bg-primary-hover transition-colors">Return to Base</Link>
                    </div>
                ) : (
                    <div key={step} className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold text-primary mb-4">{steps[step].title}</h2>
                        <p className="text-text leading-relaxed mb-6">{steps[step].instruction}</p>
                        <div className="bg-background p-4 rounded border border-border">
                            <div className="text-xs text-text-muted mb-2">OPERATIONAL HINT:</div>
                            <div className="font-mono text-primary">
                                {step === 1 ? "Wait for connection..." : `Try: ${steps[step].expected}`}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex-1 bg-background p-8 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none" />
                <div className="w-full max-w-3xl z-10">
                    <InteractiveTerminal
                        welcomeMessage="Kali Linux v2024.1 - Terminal Ready"
                        onCommand={handleCommand}
                        className="h-[600px] border-border shadow-2xl"
                    />
                </div>
            </div>
        </div>
    );
}
