"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import { ArrowLeft, CheckCircle2, Globe } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function XSSLesson() {
    const [step, setStep] = useState(0);
    const [completed, setCompleted] = useState(false);

    const steps = [
        {
            title: "Understanding Input Reflection",
            instruction: "Reflected XSS occurs when an application receives data in an HTTP request and includes that data within the immediate response in an unsafe way. Let's test a search input. Type 'search hackers'.",
            expected: "search hackers",
            validate: (cmd: string) => cmd.trim() === "search hackers",
            response: (
                <div className="text-text-muted">
                    <div>GET /search?q=hackers HTTP/1.1</div>
                    <div className="text-zinc-500">...</div>
                    <div className="text-primary">&lt;div&gt;You searched for: <span className="text-white">hackers</span>&lt;/div&gt;</div>
                </div>
            )
        },
        {
            title: "Testing for XSS",
            instruction: "The application echoes our input back directly. Let's check if it sanitizes HTML tags. Try injecting a bold tag: 'search <b>hackers</b>'",
            expected: "search <b>hackers</b>",
            validate: (cmd: string) => cmd.includes("<b>") && cmd.includes("</b>"),
            response: (
                <div className="text-text-muted">
                    <div>GET /search?q=%3Cb%3Ehackers%3C%2Fb%3E HTTP/1.1</div>
                    <div className="text-zinc-500">...</div>
                    <div className="text-primary">&lt;div&gt;You searched for: <b>hackers</b>&lt;/div&gt;</div>
                    <div className="text-yellow-500 mt-2">Observation: The tags were rendered, not escaped!</div>
                </div>
            )
        },
        {
            title: "Executing JavaScript",
            instruction: "Since HTML tags are rendered, we can inject JavaScript. Perform a Proof of Concept (PoC) by triggering an alert using the image onerror handler: 'search <img src=x onerror=alert(1)>'",
            expected: "search <img src=x onerror=alert(1)>",
            validate: (cmd: string) => cmd.includes("onerror=alert(1)") || cmd.includes("<script>alert(1)</script>"),
            response: (
                <div className="text-text-muted">
                    <div>GET /search?q=... HTTP/1.1</div>
                    <div className="text-zinc-500">...</div>
                    <div className="text-primary">&lt;div&gt;You searched for: <img src="x" className="inline-block border border-red-500 w-4 h-4" />&lt;/div&gt;</div>
                    <div className="bg-white/10 p-2 mt-2 border border-white/20 rounded text-center">
                        <div className="text-xs text-zinc-400">browser_alert.js</div>
                        <div className="text-xl font-bold text-primary">1</div>
                        <div className="text-xs text-blue-400 cursor-pointer">OK</div>
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
                        completeModule("xss-reflected");
                    });
                }
            }, 3000);

            return (
                <div>
                    {currentTask.response}
                    <div className="mt-2 text-primary font-mono text-xs animate-pulse">
                        [✔] VULNERABILITY CONFIRMED. PAYLOAD_EXECUTED.
                    </div>
                </div>
            );
        }

        if (cmd.startsWith("search")) {
            return (
                <div className="text-text-muted">
                    <div>GET /search?q={cmd.replace("search ", "")} HTTP/1.1</div>
                    <div className="text-primary">&lt;div&gt;You searched for: {cmd.replace("search ", "")}&lt;/div&gt;</div>
                </div>
            )
        }

        if (cmd === "help") return "Commands: search [query]";

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
                        <Globe size={20} />
                        <h1 className="text-2xl font-bold">Reflected XSS</h1>
                    </div>

                    <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${((step) / steps.length) * 100}%` }}
                        />
                    </div>
                </div>

                {completed ? (
                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
                        <CheckCircle2 size={32} className="text-primary mb-4" />
                        <h3 className="text-xl font-bold text-primary mb-2">Payload Successful</h3>
                        <p className="text-text-muted mb-4">You have successfully injected and executed malicious JavaScript.</p>
                        <Link href="/training" className="block w-full py-2 bg-primary text-white font-bold text-center rounded hover:bg-primary-hover transition-colors">
                            Return to Base
                        </Link>
                    </div>
                ) : (
                    <div key={step} className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold text-primary mb-4">{steps[step].title}</h2>
                        <p className="text-text leading-relaxed mb-6">
                            {steps[step].instruction}
                        </p>
                        <div className="bg-background p-4 rounded border border-border">
                            <div className="text-xs text-text-muted mb-2">OPERATIONAL HINT:</div>
                            <div className="font-mono text-primary">
                                Try: {steps[step].expected}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 bg-background p-8 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none" />
                <div className="w-full max-w-3xl z-10">
                    <InteractiveTerminal
                        welcomeMessage="Connecting to web_server_v1... Connected. Type 'help' for options."
                        onCommand={handleCommand}
                        className="h-[600px] border-border shadow-2xl"
                    />
                </div>
            </div>
        </div>
    );
}
