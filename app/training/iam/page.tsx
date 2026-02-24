"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import { ArrowLeft, CheckCircle2, UserCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function IAMLesson() {
    const [step, setStep] = useState(0);
    const [completed, setCompleted] = useState(false);

    const steps = [
        {
            title: "Auditing Permissions",
            instruction: "Check the permissions for 'intern_user'. We need to see what groups they belong to: 'id intern_user'",
            expected: "id intern_user",
            validate: (cmd: string) => cmd === "id intern_user",
            response: (
                <div className="text-text-muted">
                    <div>uid=1002(intern) gid=1002(intern) groups=1002(intern), <span className="text-red-400 font-bold">27(sudo)</span>, <span className="text-red-400 font-bold">0(root)</span></div>
                </div>
            )
        },
        {
            title: "Leats Privilege Violation",
            instruction: "The intern has 'sudo' and 'root' access! This violates the Principle of Least Privilege. Remove them from the sudo group: 'deluser intern_user sudo'",
            expected: "deluser intern_user sudo",
            validate: (cmd: string) => cmd.includes("deluser intern_user sudo"),
            response: (
                <div className="text-text-muted">
                    <div>Removing user `intern_user' from group `sudo' ...</div>
                    <div>Done.</div>
                </div>
            )
        },
        {
            title: "Verifying Access",
            instruction: "Verify the changes. The user should only have the 'intern' group now. 'id intern_user'",
            expected: "id intern_user",
            validate: (cmd: string) => cmd === "id intern_user",
            response: (
                <div className="text-text-muted">
                    <div>uid=1002(intern) gid=1002(intern) groups=1002(intern)</div>
                    <div className="text-green-400">Compliance Check: PASSED</div>
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
                        completeModule("iam");
                    });
                }
            }, 2000);

            return (
                <div>
                    {currentTask.response}
                    <div className="mt-2 text-primary font-mono text-xs animate-pulse">
                        [✔] PERMISSIONS_UPDATED. POLICY_ENFORCED.
                    </div>
                </div>
            );
        }

        if (cmd === "help") return "Commands: id [user], deluser [user] [group], usermod [options]";

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
                        <UserCheck size={20} />
                        <h1 className="text-2xl font-bold">IAM Basics</h1>
                    </div>
                    <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step) / steps.length) * 100}%` }} />
                    </div>
                </div>
                {completed ? (
                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
                        <CheckCircle2 size={32} className="text-primary mb-4" />
                        <h3 className="text-xl font-bold text-primary mb-2">Access Revoked</h3>
                        <p className="text-text-muted mb-4">You enforced the Principle of Least Privilege by removing excessive permissions.</p>
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
                        welcomeMessage="Active Directory Console. Admin session."
                        onCommand={handleCommand}
                        className="h-[600px] border-border shadow-2xl"
                    />
                </div>
            </div>
        </div>
    );
}
