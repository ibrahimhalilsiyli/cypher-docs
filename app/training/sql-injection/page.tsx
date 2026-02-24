"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import LessonGuide from "@/components/training/LessonGuide";
import { ArrowLeft, CheckCircle2, Database } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SQLInjectionLesson() {
    const [step, setStep] = useState(0);
    const [completed, setCompleted] = useState(false);

    const steps = [
        {
            title: "Understanding Authentication",
            instruction: "This login form blindly concatenates your input into a SQL query. Try logging in as 'admin' with a random password to see the error.",
            concept: "Authentication forms usually check if the username AND password match a record. If we can manipulate the logic, we can bypass the check.",
            hint: "Type: login admin password123",
            cmd: "login admin password123",
            validate: (cmd: string) => cmd.startsWith("login admin"),
            response: (cmd: string) => (
                <div className="text-text-muted">
                    <div className="text-zinc-500 mb-1">Executing Query:</div>
                    <div className="font-mono text-xs text-blue-400 mb-2">
                        SELECT * FROM users WHERE username = 'admin' AND password = '{cmd.split(' ')[2] || ''}';
                    </div>
                    <span className="text-red-500 font-bold">Access Denied: Invalid credentials.</span>
                </div>
            )
        },
        {
            title: "The Injection Vector",
            instruction: "The query uses single quotes. If we input a quote, we can break the query syntax. Try entering a quote character as the password.",
            concept: "In SQL, single quotes delimit strings. Inserting a quote without escaping it closes the string early, confusing the database parser.",
            hint: "Type: login admin '",
            cmd: "login admin '",
            validate: (cmd: string) => cmd.includes("'"),
            response: (cmd: string) => (
                <div className="text-text-muted">
                    <div className="text-zinc-500 mb-1">Executing Query:</div>
                    <div className="font-mono text-xs text-blue-400 mb-2">
                        SELECT * FROM users WHERE username = 'admin' AND password = ''';
                    </div>
                    <span className="text-yellow-500 font-bold">SQL Syntax Error: Unclosed quotation mark after the character string ''.</span>
                </div>
            )
        },
        {
            title: "Authentication Bypass",
            instruction: "Now, let's inject a tautology (a statement that is always true). Enter a password that makes the condition 'OR 1=1' true, and comment out the rest of the query with '--'.",
            concept: "By injecting 'OR 1=1', the condition becomes (False OR True), which evaluates to True. The '--' comments out the original password check.",
            hint: "Type: login admin ' OR 1=1 --",
            cmd: "login admin ' OR 1=1 --",
            validate: (cmd: string) => cmd.includes("' OR 1=1 --") || cmd.includes("' or 1=1 --"),
            response: (cmd: string) => (
                <div className="text-text-muted">
                    <div className="text-zinc-500 mb-1">Executing Query:</div>
                    <div className="font-mono text-xs text-blue-400 mb-2">
                        SELECT * FROM users WHERE username = 'admin' AND password = '' OR 1=1 --';
                    </div>
                    <span className="text-green-500 font-bold">ACCESS GRANTED. Welcome, Administrator.</span>
                </div>
            )
        }
    ];

    const handleCommand = (cmd: string) => {
        const currentTask = steps[step];
        const isStepComplete = currentTask.validate(cmd);

        // Always show the query feedback
        const response = typeof currentTask.response === 'function'
            ? currentTask.response(cmd)
            : currentTask.response;

        if (isStepComplete) {
            setTimeout(() => {
                if (step < steps.length - 1) {
                    setStep(step + 1);
                } else {
                    setCompleted(true);
                    // Award XP
                    import("@/lib/gamification").then(({ completeModule }) => {
                        completeModule("sql-injection");
                    });
                }
            }, 2000);

            return (
                <div>
                    {response}
                    <div className="mt-2 text-primary font-mono text-xs animate-pulse">
                        [✔] OBJECTIVE COMPLETE. INITIALIZING NEXT PHASE...
                    </div>
                </div>
            );
        }

        return response;
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
                    <div className="flex items-center gap-2 mb-2 text-accent">
                        <Database size={20} />
                        <h1 className="text-2xl font-bold">SQL Injection (SQLi)</h1>
                    </div>

                    <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                        <div
                            className="h-full bg-accent transition-all duration-500"
                            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                        />
                    </div>
                    <div className="mt-2 text-xs text-text-muted">
                        PHASE: {step + 1} / {steps.length}
                    </div>
                </div>

                {completed ? (
                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
                        <CheckCircle2 size={32} className="text-primary mb-4" />
                        <h3 className="text-xl font-bold text-primary mb-2">System Compromised</h3>
                        <p className="text-text-muted mb-4">You have successfully bypassed the authentication mechanism.</p>
                        <Link href="/training" className="block w-full py-2 bg-primary text-white font-bold text-center rounded hover:bg-primary-hover transition-colors">
                            Return to Base
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
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none" />
                <div className="w-full max-w-3xl z-10">
                    <InteractiveTerminal
                        welcomeMessage="Connecting to secure_login_service_v1... Connected."
                        onCommand={handleCommand}
                        className="h-[600px] border-border shadow-2xl"
                    />
                </div>
            </div>
        </div>
    );
}
