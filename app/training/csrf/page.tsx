"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import { ArrowLeft, CheckCircle2, Repeat } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CSRFLesson() {
    const [step, setStep] = useState(0);
    const [completed, setCompleted] = useState(false);

    const steps = [
        {
            title: "Analyzing the Request",
            instruction: "The admin is logged in. A state-changing request to change the password looks like this: `POST /change-password body='new_pass=123'`. Simulate this request.",
            expected: "POST /change-password body='new_pass=123'",
            validate: (cmd: string) => cmd.includes("POST /change-password"),
            response: (
                <div className="text-text-muted">
                    <div>HTTP/1.1 200 OK</div>
                    <div>Set-Cookie: session_id=abc123admin</div>
                    <div className="text-green-500">Password changed successfully!</div>
                </div>
            )
        },
        {
            title: "Building the Trap",
            instruction: "To exploit this via CSRF, we need to create a malicious link/form that submits this request automatically when the admin views it. Create a hidden form: `generate-csrf-form --url /change-password --value 'hacked'`",
            expected: "generate-csrf-form --url /change-password --value 'hacked'",
            validate: (cmd: string) => cmd.includes("generate-csrf-form"),
            response: (
                <div className="text-text-muted">
                    <div>Generating Payload...</div>
                    <div className="text-blue-400 font-mono text-xs">
                        &lt;form action="/change-password" method="POST"&gt;<br />
                        &nbsp;&nbsp;&lt;input type="hidden" name="new_pass" value="hacked" /&gt;<br />
                        &lt;/form&gt;<br />
                        &lt;script&gt;document.forms[0].submit()&lt;/script&gt;
                    </div>
                    <div className="mt-2">Payload saved to: exploit.html</div>
                </div>
            )
        },
        {
            title: "Delivering the Payload",
            instruction: "Now simulate sending this link to the admin. Type: `send-link exploit.html --target admin`",
            expected: "send-link exploit.html --target admin",
            validate: (cmd: string) => cmd.includes("send-link"),
            response: (
                <div className="text-text-muted">
                    <div>Status: Link sent.</div>
                    <div>Waiting for target interaction...</div>
                    <div className="text-zinc-500 italic">User 'admin' clicked the link.</div>
                    <div className="text-zinc-500 italic">Browser executed POST /change-password automatically with cookies.</div>
                    <div className="text-green-500 font-bold">SUCCESS: Admin password forcibly changed to 'hacked'.</div>
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
                        completeModule("csrf");
                    });
                }
            }, 3000);

            return (
                <div>
                    {currentTask.response}
                    <div className="mt-2 text-primary font-mono text-xs animate-pulse">
                        [✔] STATE_CHANGE_FORCED. SESSION_HIJACKED.
                    </div>
                </div>
            );
        }

        if (cmd === "help") return "Commands: POST [url], generate-csrf-form [options], send-link [file]";

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
                        <Repeat size={20} />
                        <h1 className="text-2xl font-bold">CSRF</h1>
                    </div>
                    <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step) / steps.length) * 100}%` }} />
                    </div>
                </div>
                {completed ? (
                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
                        <CheckCircle2 size={32} className="text-primary mb-4" />
                        <h3 className="text-xl font-bold text-primary mb-2">Action Forged</h3>
                        <p className="text-text-muted mb-4">You successfully forced a state change on behalf of the victim.</p>
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
                        welcomeMessage="Network Traffic Interceptor v0.9... Listening."
                        onCommand={handleCommand}
                        className="h-[600px] border-border shadow-2xl"
                    />
                </div>
            </div>
        </div>
    );
}
