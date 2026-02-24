"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import { ArrowLeft, CheckCircle2, UserX } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SocialEngineeringLesson() {
    const [step, setStep] = useState(0);
    const [completed, setCompleted] = useState(false);

    const steps = [
        {
            title: "Analyzing Email Headers",
            instruction: "We received a suspicious email from 'CEO <ceo@company.com>'. Let's check the header details to spot spoofing: 'analyze-header email.eml'",
            expected: "analyze-header email.eml",
            validate: (cmd: string) => cmd === "analyze-header email.eml",
            response: (
                <div className="text-text-muted">
                    <div>From: CEO &lt;ceo@company.com&gt;</div>
                    <div className="text-red-400">Return-Path: &lt;hacker@evil.com&gt;</div>
                    <div>Received-SPF: Fail (domain evil.com does not designate...)</div>
                    <div>Subject: URGENT: WIRE TRANSFER NOW</div>
                </div>
            )
        },
        {
            title: "Checking Links",
            instruction: "The email contains a link: 'Click here to approve'. Check where it actually points: 'scan-link --url \"http://login-company.com\"'",
            expected: "scan-link --url \"http://login-company.com\"",
            validate: (cmd: string) => cmd.includes("scan-link") || cmd.includes("http://login-company.com"),
            response: (
                <div className="text-text-muted">
                    <div>Scanning URL...</div>
                    <div className="text-red-400">Typosquatting Detected!</div>
                    <div>Real Domain: company.com</div>
                    <div>Fake Domain: login-company.com (Created 2 days ago)</div>
                    <div className="text-red-400 font-bold">Verdict: MALICIOUS PHISHING SITE</div>
                </div>
            )
        },
        {
            title: "Reporting the Threat",
            instruction: "This is a confirmed phishing attempt. Report it to the SOC: 'report-phish --id email.eml --verdict malicious'",
            expected: "report-phish --id email.eml --verdict malicious",
            validate: (cmd: string) => cmd.includes("report-phish"),
            response: (
                <div className="text-text-muted">
                    <div>Submitting report...</div>
                    <div className="text-green-400">Success: Email quarantined network-wide.</div>
                    <div>Sender blocked.</div>
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
                        completeModule("social-engineering");
                    });
                }
            }, 2000);

            return (
                <div>
                    {currentTask.response}
                    <div className="mt-2 text-primary font-mono text-xs animate-pulse">
                        [✔] PHISHING_ATTEMPT_NEUTRALIZED.
                    </div>
                </div>
            );
        }

        if (cmd === "help") return "Commands: analyze-header [file], scan-link [url], report-phish [options]";

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
                        <UserX size={20} />
                        <h1 className="text-2xl font-bold">Social Engineering</h1>
                    </div>
                    <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step) / steps.length) * 100}%` }} />
                    </div>
                </div>
                {completed ? (
                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
                        <CheckCircle2 size={32} className="text-primary mb-4" />
                        <h3 className="text-xl font-bold text-primary mb-2">Scam Busted</h3>
                        <p className="text-text-muted mb-4">You identified the spoofed sender and TYPOSQUATTING domain.</p>
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
                        welcomeMessage="Email Threat Analyzer v2.0. Inbox loaded."
                        onCommand={handleCommand}
                        className="h-[600px] border-border shadow-2xl"
                    />
                </div>
            </div>
        </div>
    );
}
