"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import { ArrowLeft, CheckCircle2, Terminal as TerminalIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CommandInjectionLesson() {
    const [step, setStep] = useState(0);
    const [completed, setCompleted] = useState(false);

    const steps = [
        {
            title: "Analyzing the Service",
            instruction: "We have a tool that pings an IP address. Run 'tool-ping 8.8.8.8' to see how it behaves.",
            expected: "tool-ping 8.8.8.8",
            validate: (cmd: string) => cmd === "tool-ping 8.8.8.8",
            response: (
                <div className="text-text-muted">
                    <div>Pinging 8.8.8.8 with 32 bytes of data:</div>
                    <div>Reply from 8.8.8.8: bytes=32 time=12ms TTL=118</div>
                    <div>Reply from 8.8.8.8: bytes=32 time=14ms TTL=118</div>
                </div>
            )
        },
        {
            title: "Chaining Commands",
            instruction: "The tool likely passes your input directly to a system shell. In Linux, ';', '|', or '&&' can be used to chain commands. Try injecting a second command: 'tool-ping 8.8.8.8; whoami'",
            expected: "tool-ping 8.8.8.8; whoami",
            validate: (cmd: string) => cmd.includes("; whoami") || cmd.includes("&& whoami") || cmd.includes("| whoami"),
            response: (
                <div className="text-text-muted">
                    <div>Pinging 8.8.8.8 with 32 bytes of data:</div>
                    <div>Reply from 8.8.8.8: bytes=32 time=12ms TTL=118</div>
                    <div className="mt-2 text-green-400 font-bold">root</div>
                </div>
            )
        },
        {
            title: "Reading Sensitive Files",
            instruction: "We are running as root! Now, escalate this to read the password file. Inject a command to read `/etc/passwd`: 'tool-ping 127.0.0.1; cat /etc/passwd'",
            expected: "tool-ping 127.0.0.1; cat /etc/passwd",
            validate: (cmd: string) => cmd.includes("cat /etc/passwd"),
            response: (
                <div className="text-text-muted">
                    <div>Pinging 127.0.0.1...</div>
                    <div className="mt-2 text-zinc-400">
                        <div>root:x:0:0:root:/root:/bin/bash</div>
                        <div>daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin</div>
                        <div>bin:x:2:2:bin:/bin:/usr/sbin/nologin</div>
                        <div>www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin</div>
                        <div>hacker:x:1001:1001::/home/hacker:/bin/bash</div>
                    </div>
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
                        completeModule("command-injection");
                    });
                }
            }, 3000);

            return (
                <div>
                    {currentTask.response}
                    <div className="mt-2 text-primary font-mono text-xs animate-pulse">
                        [✔] RCE_CONFIRMED. SYSTEM_COMPROMISED.
                    </div>
                </div>
            );
        }

        if (cmd === "help") return "Commands: tool-ping [ip_address]";

        return <span className="text-red-400 font-mono">unknown command: {cmd.split(" ")[0]}</span>;
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
                        <TerminalIcon size={20} />
                        <h1 className="text-2xl font-bold">Command Injection</h1>
                    </div>
                    <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step) / steps.length) * 100}%` }} />
                    </div>
                </div>
                {completed ? (
                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
                        <CheckCircle2 size={32} className="text-primary mb-4" />
                        <h3 className="text-xl font-bold text-primary mb-2">Root Shell Acquired</h3>
                        <p className="text-text-muted mb-4">You have successfully executed arbitrary system commands.</p>
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
                        welcomeMessage="Network utility tool v1.2 loaded..."
                        onCommand={handleCommand}
                        className="h-[600px] border-border shadow-2xl"
                    />
                </div>
            </div>
        </div>
    );
}
