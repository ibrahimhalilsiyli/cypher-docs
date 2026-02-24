"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import { ArrowLeft, CheckCircle2, Key } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CryptoLesson() {
    const [step, setStep] = useState(0);
    const [completed, setCompleted] = useState(false);

    const steps = [
        {
            title: "Base64 Encoding",
            instruction: "We found a strange string: 'SGVsbG8gV29ybGQ='. This looks like Base64. Decode it using the base64 tool: 'echo \"SGVsbG8gV29ybGQ=\" | base64 -d'",
            expected: "echo \"SGVsbG8gV29ybGQ=\" | base64 -d",
            validate: (cmd: string) => cmd.includes("base64 -d"),
            response: (
                <div className="text-text-muted">
                    <div>Hello World</div>
                </div>
            )
        },
        {
            title: "Rot13 Cipher",
            instruction: "Caesar ciphers rotate characters. 'Rot13' rotates by 13 places. Decrypt 'Uryyb Jbeyq' using the 'rot13' tool: 'rot13 -d \"Uryyb Jbeyq\"'",
            expected: "rot13 -d \"Uryyb Jbeyq\"",
            validate: (cmd: string) => cmd.includes("rot13"),
            response: (
                <div className="text-text-muted">
                    <div>Hello World</div>
                </div>
            )
        },
        {
            title: "Identifying Keys",
            instruction: "Private SSH keys start with a distinct header. Search for one in the current directory: 'grep -r \"BEGIN OPENSSH PRIVATE KEY\" .'",
            expected: "grep -r \"BEGIN OPENSSH PRIVATE KEY\" .",
            validate: (cmd: string) => cmd.includes("grep") && cmd.includes("PRIVATE KEY"),
            response: (
                <div className="text-text-muted">
                    <div>./.ssh/id_rsa:-----BEGIN OPENSSH PRIVATE KEY-----</div>
                    <div className="text-red-400">Match found in ./.ssh/id_rsa</div>
                </div>
            )
        }
    ];

    const handleCommand = (cmd: string) => {
        const currentTask = steps[step];

        if (currentTask.validate(cmd)) {
            setTimeout(() => {
                if (step < steps.length - 1) {
                    setStep(step + 1);
                } else {
                    setCompleted(true);
                    // Award XP
                    import("@/lib/gamification").then(({ completeModule }) => {
                        completeModule("crypto");
                    });
                }
            }, 2000);

            return (
                <div>
                    {currentTask.response}
                    <div className="mt-2 text-primary font-mono text-xs animate-pulse">
                        [✔] DECRYPTION_SUCCESSFUL. DATA_REVEALED.
                    </div>
                </div>
            );
        }

        if (cmd === "help") return "Commands: echo [string], base64 [options], rot13 [options], grep [options]";

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
                        <Key size={20} />
                        <h1 className="text-2xl font-bold">Cryptography 101</h1>
                    </div>
                    <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step) / steps.length) * 100}%` }} />
                    </div>
                </div>
                {completed ? (
                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
                        <CheckCircle2 size={32} className="text-primary mb-4" />
                        <h3 className="text-xl font-bold text-primary mb-2">Secrets Unlocked</h3>
                        <p className="text-text-muted mb-4">You have mastered the basics of encoding and legacy encryption.</p>
                        <Link href="/training" className="block w-full py-2 bg-primary text-white font-bold text-center rounded hover:bg-primary-hover transition-colors">Return to Base</Link>
                    </div>
                ) : (
                    <div key={step} className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold text-primary mb-4">{steps[step].title}</h2>
                        <p className="text-text leading-relaxed mb-6">{steps[step].instruction}</p>
                        <div className="bg-background p-4 rounded border border-border">
                            <div className="text-xs text-text-muted mb-2">OPERATIONAL HINT:</div>
                            <div className="font-mono text-primary">Try: {steps[step].expected}</div>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex-1 bg-background p-8 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none" />
                <div className="w-full max-w-3xl z-10">
                    <InteractiveTerminal
                        welcomeMessage="CryptoUtils v2.1 initialized..."
                        onCommand={handleCommand}
                        className="h-[600px] border-border shadow-2xl"
                    />
                </div>
            </div>
        </div>
    );
}
