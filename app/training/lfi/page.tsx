"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import { ArrowLeft, CheckCircle2, FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LFILesson() {
    const [step, setStep] = useState(0);
    const [completed, setCompleted] = useState(false);

    const steps = [
        {
            title: "Analyzing URL Parameters",
            instruction: "The application loads pages using a 'page' parameter. Type 'GET page=contact.html' to see how it retrieves content.",
            expected: "GET page=contact.html",
            validate: (cmd: string) => cmd === "GET page=contact.html",
            response: (
                <div className="text-text-muted">
                    <div>HTTP/1.1 200 OK</div>
                    <div>Content-Type: text/html</div>
                    <div className="mt-2 text-white bg-surface p-2 border border-border">
                        &lt;h1&gt;Contact Us&lt;/h1&gt;<br />
                        &lt;p&gt;Email us at support@cypher.test&lt;/p&gt;
                    </div>
                    <div className="mt-2 text-zinc-500">System read file: /var/www/html/contact.html</div>
                </div>
            )
        },
        {
            title: "Directory Traversal",
            instruction: "If the application doesn't sanitise input, we can use '../' sequences to move up directories. Try to escape the webroot: 'GET page=../../../../etc/passwd'",
            expected: "GET page=../../../../etc/passwd",
            validate: (cmd: string) => cmd.includes("../../../etc/passwd") || cmd.includes("..\\..\\..\\etc\\passwd"),
            response: (
                <div className="text-text-muted">
                    <div>HTTP/1.1 200 OK</div>
                    <div className="mt-2 text-zinc-400">
                        root:x:0:0:root:/root:/bin/bash<br />
                        bin:x:1:1:bin:/bin:/sbin/nologin<br />
                        daemon:x:2:2:daemon:/sbin:/sbin/nologin<br />
                        adm:x:3:4:adm:/var/adm:/sbin/nologin<br />
                        lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin<br />
                        sync:x:5:0:sync:/sbin:/bin/sync<br />
                        shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
                    </div>
                    <div className="mt-2 text-zinc-500">System read file: /etc/passwd</div>
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
                        completeModule("lfi");
                    });
                }
            }, 2000);

            return (
                <div>
                    {currentTask.response}
                    <div className="mt-2 text-primary font-mono text-xs animate-pulse">
                        [✔] FILE_LEAKAGE_DETECTED. SENSITIVE_DATA_EXPOSED.
                    </div>
                </div>
            );
        }

        if (cmd === "help") return "Commands: GET page=[filename]";

        return <span className="text-red-400 font-mono">Invalid Request Format: {cmd}</span>;
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
                        <FileText size={20} />
                        <h1 className="text-2xl font-bold">Local File Inclusion</h1>
                    </div>
                    <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step) / steps.length) * 100}%` }} />
                    </div>
                </div>
                {completed ? (
                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
                        <CheckCircle2 size={32} className="text-primary mb-4" />
                        <h3 className="text-xl font-bold text-primary mb-2">Files Exfiltrated</h3>
                        <p className="text-text-muted mb-4">You have successfully accessed system files outside the web root.</p>
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
                        welcomeMessage="HTTP Debugger v4.0. Connected."
                        onCommand={handleCommand}
                        className="h-[600px] border-border shadow-2xl"
                    />
                </div>
            </div>
        </div>
    );
}
