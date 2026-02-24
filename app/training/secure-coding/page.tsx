"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import { ArrowLeft, CheckCircle2, Code2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SecureCodingLesson() {
    const [step, setStep] = useState(0);
    const [completed, setCompleted] = useState(false);

    const steps = [
        {
            title: "Analyzing Vulnerable Code",
            instruction: "We have a Python script 'login.py'. Read it to find SQL injection vulnerabilities: 'cat login.py'",
            expected: "cat login.py",
            validate: (cmd: string) => cmd === "cat login.py",
            response: (
                <div className="text-text-muted">
                    <div>query = "SELECT * FROM users WHERE user='" + user_input + "'"</div>
                    <div>cursor.execute(query)</div>
                    <div className="text-red-400 font-bold">// CRITICAL: String concatenation detected!</div>
                </div>
            )
        },
        {
            title: "Applying a Patch",
            instruction: "Fix the vulnerability by using parameterized queries. Apply the patch: 'patch login.py params.patch'",
            expected: "patch login.py params.patch",
            validate: (cmd: string) => cmd.includes("patch"),
            response: (
                <div className="text-text-muted">
                    <div>patching file login.py...</div>
                    <div>Hunk #1 succeeded.</div>
                    <div className="mt-2 text-green-400">
                        - query = "SELECT ... WHERE user='" + user_input + "'"<br />
                        + query = "SELECT ... WHERE user=%s", (user_input,)
                    </div>
                </div>
            )
        },
        {
            title: "Running Static Analysis (Linting)",
            instruction: "Verify the fix using a linter like 'bandit'. Run: 'bandit -r login.py'",
            expected: "bandit -r login.py",
            validate: (cmd: string) => cmd.includes("bandit"),
            response: (
                <div className="text-text-muted">
                    <div>Run started:2023-10-10 14:05:00</div>
                    <div>Test results:</div>
                    <div className="text-green-400">No issues identified.</div>
                    <div>Code Score: 10.00/10.00</div>
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
                        completeModule("secure-coding");
                    });
                }
            }, 2000);

            return (
                <div>
                    {currentTask.response}
                    <div className="mt-2 text-primary font-mono text-xs animate-pulse">
                        [✔] CODE_HARDENED. VULNERABILITY_PATCHED.
                    </div>
                </div>
            );
        }

        if (cmd === "help") return "Commands: cat [file], patch [file] [patchfile], bandit [options]";

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
                        <Code2 size={20} />
                        <h1 className="text-2xl font-bold">Secure Coding</h1>
                    </div>
                    <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step) / steps.length) * 100}%` }} />
                    </div>
                </div>
                {completed ? (
                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
                        <CheckCircle2 size={32} className="text-primary mb-4" />
                        <h3 className="text-xl font-bold text-primary mb-2">Code Secured</h3>
                        <p className="text-text-muted mb-4">You replaced dangerous SQL concatenation with parameterized queries.</p>
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
                        welcomeMessage="DevSecOps Pipeline v9. Linter ready."
                        onCommand={handleCommand}
                        className="h-[600px] border-border shadow-2xl"
                    />
                </div>
            </div>
        </div>
    );
}
