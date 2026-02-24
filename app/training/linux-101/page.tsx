"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import LessonGuide from "@/components/training/LessonGuide";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LinuxLessonPage() {
    const [step, setStep] = useState(0);
    const [completed, setCompleted] = useState(false);

    // Lesson Logic
    const steps = [
        {
            title: "The List Command",
            instruction: "The 'ls' command lists directory contents. Try entering 'ls' to see what files are here.",
            concept: "Listing files is the fundamental way to orient yourself in a command-line interface. It reveals files, directories, and sometimes permissions.",
            hint: "Just type 'ls' and hit enter.",
            cmd: "ls",
            validate: (cmd: string) => cmd.trim() === "ls",
            response: (
                <div className="text-text-muted">
                    <span className="text-blue-400 font-bold">secret.txt</span>{" "}
                    <span className="text-green-400 font-bold">notes/</span>{" "}
                    <span>manual.md</span>
                </div>
            )
        },
        {
            title: "Who Am I?",
            instruction: "The 'whoami' command displays the current username. Type 'whoami'.",
            concept: "In Linux, your identity determines your power. Knowing if you are 'root' or a standard user is the first step in privilege escalation.",
            hint: "Type 'whoami'.",
            cmd: "whoami",
            validate: (cmd: string) => cmd.trim() === "whoami",
            response: <div className="text-text-muted">guest</div>
        },
        {
            title: "Print Working Directory",
            instruction: "The 'pwd' command shows your current path. Type 'pwd'.",
            concept: "It's easy to get lost in deep directory structures. 'pwd' confirms exactly where you are in the filesystem hierarchy.",
            hint: "Type 'pwd'.",
            cmd: "pwd",
            validate: (cmd: string) => cmd.trim() === "pwd",
            response: <div className="text-text-muted">/home/guest/workspace</div>
        }
    ];

    const handleCommand = (cmd: string) => {
        const currentTask = steps[step];

        if (currentTask.validate(cmd)) {
            // Success
            setTimeout(() => {
                if (step < steps.length - 1) {
                    setStep(step + 1);
                } else {
                    setCompleted(true);
                    // Award XP
                    import("@/lib/gamification").then(({ completeModule }) => {
                        completeModule("linux-101");
                    });
                }
            }, 1000);

            return (
                <div>
                    {currentTask.response}
                    <div className="mt-2 text-green-400 font-mono text-xs animate-pulse">
                        [✔] OBJECTIVE COMPLETE. PROCEEDING...
                    </div>
                </div>
            );
        }

        // Handle standard commands generically if they aren't the objective
        if (cmd === "ls") return <div className="text-text-muted"><span className="text-blue-400 font-bold">secret.txt</span> <span className="text-green-400 font-bold">notes/</span> <span>manual.md</span></div>;
        if (cmd === "whoami") return <div className="text-text-muted">guest</div>;
        if (cmd === "pwd") return <div className="text-text-muted">/home/guest/workspace</div>;

        return <span className="text-red-400 font-mono">zsh: command not found: {cmd}</span>;
    };

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row font-mono">
            {/* Left Panel: Instructions */}
            <div className="w-full md:w-1/3 bg-surface border-r border-border p-8 flex flex-col">
                <Link href="/training" className="inline-flex items-center text-text-muted hover:text-primary mb-8 transition-colors">
                    <ArrowLeft size={16} className="mr-2" />
                    Abort Mission
                </Link>

                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-2">Linux Basics 101</h1>
                    <div className="h-1 w-full bg-surface rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                        />
                    </div>
                    <div className="mt-2 text-xs font-mono text-text-muted">
                        PROGRESS: {step + 1} / {steps.length}
                    </div>
                </div>

                {completed ? (
                    <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
                        <CheckCircle2 size={32} className="text-green-500 mb-4" />
                        <h3 className="text-xl font-bold text-green-500 mb-2">Module Complete!</h3>
                        <p className="text-text-muted mb-4">You have successfully mastered the navigation basics.</p>
                        <Link href="/training" className="block w-full py-2 bg-green-500 text-black font-bold text-center rounded hover:bg-green-400 transition-colors">
                            Claim Badge & Return
                        </Link>
                    </div>
                ) : (
                    <LessonGuide
                        key={step}
                        title={steps[step].title}
                        instruction={steps[step].instruction}
                        concept={steps[step].concept}
                        hint={steps[step].hint}
                        cmd={steps[step].cmd}
                    />
                )}
            </div>

            {/* Right Panel: Terminal */}
            <div className="flex-1 bg-background p-8 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
                <div className="w-full max-w-3xl z-10">
                    <InteractiveTerminal
                        welcomeMessage="Initializing Linux Environment... Ready."
                        onCommand={handleCommand}
                        className="h-[600px] border-border"
                    />
                </div>
            </div>
        </div>
    );
}
