"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import { ArrowLeft, CheckCircle2, Bug } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function BurpSuiteLesson() {
    const [step, setStep] = useState(0);
    const [completed, setCompleted] = useState(false);

    const steps = [
        {
            title: "Intercepting Requests",
            instruction: "Burp Proxy sits between your browser and the server. We have captured a login request. View it using 'view-request #129'.",
            expected: "view-request #129",
            validate: (cmd: string) => cmd === "view-request #129",
            response: (
                <div className="text-text-muted">
                    <div>POST /api/login HTTP/1.1</div>
                    <div>Host: bank.test</div>
                    <div>Content-Type: application/json</div>
                    <div className="mt-2 text-yellow-300">
                        {"{"}<br />
                        &nbsp;&nbsp;"username": "user",<br />
                        &nbsp;&nbsp;"password": "password123"<br />
                        {"}"}
                    </div>
                </div>
            )
        },
        {
            title: "Send to Repeater",
            instruction: "Repeater allows us to modify and resend requests. Let's tamper with this. Move it to Repeater: 'send-to-repeater #129'",
            expected: "send-to-repeater #129",
            validate: (cmd: string) => cmd.includes("send-to-repeater"),
            response: (
                <div className="text-text-muted">
                    <div>Request #129 copied to Repeater Tab 1.</div>
                </div>
            )
        },
        {
            title: "Modifying Parameters",
            instruction: "The server might rely on the 'Host' header for redirects. Change the Host header to your attacker server: 'set-header Host attacker.com' then 'send'",
            expected: "set-header Host attacker.com",
            validate: (cmd: string) => cmd.includes("set-header Host attacker.com") || cmd === "send",
            response: (cmd: string) => {
                if (cmd.includes("set-header")) return <div className="text-text-muted">Header Updated: Host: attacker.com</div>;
                if (cmd === "send") return (
                    <div className="text-text-muted">
                        <div>HTTP/1.1 302 Found</div>
                        <div>Location: http://attacker.com/reset-password</div>
                        <div className="text-green-400 font-bold">Poisoning Successful</div>
                    </div>
                );
                return null;
            }
        }
    ];

    const handleCommand = (cmd: string) => {
        const currentTask = steps[step];

        if (step === 2) {
            if (cmd.includes("set-header")) return typeof currentTask.response === 'function' ? currentTask.response(cmd) : currentTask.response;
            if (cmd === "send") {
                setTimeout(() => {
                    setCompleted(true);
                }, 3000);
                return (
                    <div>
                        {typeof currentTask.response === 'function' ? currentTask.response(cmd) : currentTask.response}
                        <div className="mt-2 text-primary font-mono text-xs animate-pulse">
                            [✔] RESPONSE_MANIPULATED. TRAFFIC_REDIRECTED.
                        </div>
                    </div>
                )
            }
        }

        if (currentTask.validate(cmd)) {
            setTimeout(() => {
                if (step < steps.length - 1) {
                    setStep(step + 1);
                } else {
                    setCompleted(true);
                }
            }, 2000);

            return typeof currentTask.response === 'function' ? currentTask.response(cmd) : currentTask.response;
        }

        if (cmd === "help") return "Commands: view-request [id], send-to-repeater [id], set-header [key] [value], send";

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
                        <Bug size={20} />
                        <h1 className="text-2xl font-bold">Burp Suite Proxy</h1>
                    </div>
                    <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step) / steps.length) * 100}%` }} />
                    </div>
                </div>
                {completed ? (
                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
                        <CheckCircle2 size={32} className="text-primary mb-4" />
                        <h3 className="text-xl font-bold text-primary mb-2">Request Mocked</h3>
                        <p className="text-text-muted mb-4">You successfully manipulated web traffic in transit.</p>
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
                        welcomeMessage="Burp Suite Professional v2023.9.1... Proxy Running on 127.0.0.1:8080"
                        onCommand={handleCommand}
                        className="h-[600px] border-border shadow-2xl"
                    />
                </div>
            </div>
        </div>
    );
}
