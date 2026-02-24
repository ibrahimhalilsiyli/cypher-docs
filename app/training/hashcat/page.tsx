"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import { ArrowLeft, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function HashcatLesson() {
    const [step, setStep] = useState(0);
    const [completed, setCompleted] = useState(false);

    const steps = [
        {
            title: "Identifying the Hash",
            instruction: "We found a leaked password hash: '5f4dcc3b5aa765d61d8327deb882cf99'. We need to identify its type. Use 'hash-id 5f4dcc3b5aa765d61d8327deb882cf99'.",
            expected: "hash-id 5f4dcc3b5aa765d61d8327deb882cf99",
            validate: (cmd: string) => cmd.includes("hash-id") || cmd.includes("hashid"),
            response: (
                <div className="text-text-muted">
                    <div>Analyzing '5f4dcc3b5aa765d61d8327deb882cf99'...</div>
                    <div className="text-green-400 font-bold">[+] MD5 (Raw)</div>
                    <div className="text-zinc-500">[-] SHA-1</div>
                    <div className="text-zinc-500">[-] NTLM</div>
                </div>
            )
        },
        {
            title: "Dictionary Attack",
            instruction: "It's an MD5 hash. Let's try to crack it using a wordlist. The mode for MD5 in hashcat is 0. Run: 'hashcat -m 0 hash.txt rockyou.txt'",
            expected: "hashcat -m 0 hash.txt rockyou.txt",
            validate: (cmd: string) => cmd.includes("hashcat -m 0"),
            response: (
                <div className="text-text-muted">
                    <div>hashcat (v6.2.5) starting...</div>
                    <div>OpenCL API (OpenCL 2.1 CUDA 11.4.94) - Platform #1 [NVIDIA CUDA]</div>
                    <div className="text-zinc-500">...</div>
                    <div className="mt-2">
                        <span className="text-yellow-500">5f4dcc3b5aa765d61d8327deb882cf99:password</span>
                    </div>
                    <div className="mt-2 text-green-400 font-bold">Status: Cracked</div>
                </div>
            )
        },
        {
            title: "Rule-Based Attack",
            instruction: "Simple dictionary attacks often fail against complex passwords. Let's add rules (like appending numbers) using the 'best64' rule set: 'hashcat -m 0 hash.txt rockyou.txt -r best64.rule'",
            expected: "hashcat -m 0 hash.txt rockyou.txt -r best64.rule",
            validate: (cmd: string) => cmd.includes("-r best64.rule") || cmd.includes("-r best64"),
            response: (
                <div className="text-text-muted">
                    <div>Initializing rule engine...</div>
                    <div className="text-zinc-500">...</div>
                    <div>[+] Rule: $1 (Append '1') matched</div>
                    <div className="mt-2">
                        <span className="text-yellow-500">21232f297a57a5a743894a0e4a801fc3:admin1</span>
                    </div>
                    <div className="mt-2 text-green-400 font-bold">Status: Cracked</div>
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
                        completeModule("hashcat");
                    });
                }
            }, 3000);

            return (
                <div>
                    {currentTask.response}
                    <div className="mt-2 text-primary font-mono text-xs animate-pulse">
                        [✔] HASH_CRACKED. CREDENTIALS_RECOVERED.
                    </div>
                </div>
            );
        }

        if (cmd === "help") return "Commands: hash-id [hash], hashcat [options] [hashfile] [wordlist]";

        return <span className="text-red-400 font-mono">zsh: command not found: {cmd}</span>;
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
                        <Lock size={20} />
                        <h1 className="text-2xl font-bold">Password Cracking</h1>
                    </div>
                    <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step) / steps.length) * 100}%` }} />
                    </div>
                </div>
                {completed ? (
                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
                        <CheckCircle2 size={32} className="text-primary mb-4" />
                        <h3 className="text-xl font-bold text-primary mb-2">Hashes Cracked</h3>
                        <p className="text-text-muted mb-4">You successfully recovered plain-text passwords from cryptographic hashes.</p>
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
                        welcomeMessage="GPU Cluster Online. Ready for cracking."
                        onCommand={handleCommand}
                        className="h-[600px] border-border shadow-2xl"
                    />
                </div>
            </div>
        </div>
    );
}
