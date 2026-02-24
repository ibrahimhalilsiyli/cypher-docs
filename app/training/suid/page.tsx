"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import { ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SUIDLesson() {
    const [step, setStep] = useState(0);
    const [completed, setCompleted] = useState(false);

    const steps = [
        {
            title: "Identifying SUID Binaries",
            instruction: "SUID (Set owner User ID up on execution) is a special file permission. If a binary has this bit set, it runs with the privileges of the file owner (often root). Find them using 'find / -perm -4000 2>/dev/null'.",
            expected: "find / -perm -4000 2>/dev/null",
            validate: (cmd: string) => cmd.includes("find / -perm -4000"),
            response: (
                <div className="text-text-muted">
                    <div>/usr/bin/passwd</div>
                    <div>/usr/bin/newgrp</div>
                    <div>/usr/bin/chsh</div>
                    <div className="text-red-400 font-bold">/usr/bin/vim</div>
                    <div>/usr/bin/sudo</div>
                </div>
            )
        },
        {
            title: "Exploiting SUID Vim",
            instruction: "The 'vim' text editor has the SUID bit set. This is a misconfiguration! It means we can use vim to execute commands as root. Try launching a shell from within vim: '/usr/bin/vim -c \":!/bin/sh\"'",
            expected: "/usr/bin/vim -c \":!/bin/sh\"",
            validate: (cmd: string) => cmd.includes("vim") && (cmd.includes(":!/bin/sh") || cmd.includes(":!/bin/bash")),
            response: (
                <div className="text-text-muted">
                    <div>Vim: Warning: Output is not to a terminal</div>
                    <div># whoami</div>
                    <div className="text-green-400 font-bold">root</div>
                </div>
            )
        },
        {
            title: "Confirming Access",
            instruction: "We have a root shell. Verify it by reading the shadow file (contains password hashes): 'cat /etc/shadow'",
            expected: "cat /etc/shadow",
            validate: (cmd: string) => cmd.includes("cat /etc/shadow"),
            response: (
                <div className="text-text-muted">
                    <div>root:$6$vHq...:18742:0:99999:7:::</div>
                    <div>daemon:*:18742:0:99999:7:::</div>
                    <div>bin:*:18742:0:99999:7:::</div>
                    <div className="text-zinc-500">...</div>
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
                        completeModule("suid");
                    });
                }
            }, 3000);

            return (
                <div>
                    {currentTask.response}
                    <div className="mt-2 text-primary font-mono text-xs animate-pulse">
                        [✔] PRIVILEGE_ESCALATED. EUID=0(root).
                    </div>
                </div>
            );
        }

        if (cmd === "help") return "Commands: find [path] [options], vim [options], cat [file]";

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
                        <ShieldAlert size={20} />
                        <h1 className="text-2xl font-bold">Privilege Escalation</h1>
                    </div>
                    <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step) / steps.length) * 100}%` }} />
                    </div>
                </div>
                {completed ? (
                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
                        <CheckCircle2 size={32} className="text-primary mb-4" />
                        <h3 className="text-xl font-bold text-primary mb-2">Got Root?</h3>
                        <p className="text-text-muted mb-4">You have successfully escalated privileges from a low-level user to root.</p>
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
                        welcomeMessage="Logged in as: user (uid=1000). Hostname: prod-db-01"
                        onCommand={handleCommand}
                        className="h-[600px] border-border shadow-2xl"
                    />
                </div>
            </div>
        </div>
    );
}
