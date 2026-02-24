"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import { ArrowLeft, CheckCircle2, Eye, Key } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function StegoLesson() {
    const [step, setStep] = useState(0);
    const [completed, setCompleted] = useState(false);

    const steps = [
        {
            title: "Analyzing Image Metadata",
            instruction: "We suspect 'evidence.jpg' contains hidden data. First, check its metadata using 'exiftool evidence.jpg'.",
            expected: "exiftool evidence.jpg",
            validate: (cmd: string) => cmd.includes("exiftool"),
            response: (
                <div className="text-text-muted">
                    <div>File Name: evidence.jpg</div>
                    <div>File Size: 1.2 MB</div>
                    <div>Comment: "Check the Strings"</div>
                </div>
            )
        },
        {
            title: "Extracting Strings",
            instruction: "Sometimes data is just appended to the file. Use the 'strings' command to look for readable text: 'strings evidence.jpg | tail -n 3'",
            expected: "strings evidence.jpg | tail -n 3",
            validate: (cmd: string) => cmd.includes("strings"),
            response: (
                <div className="text-text-muted">
                    <div>...</div>
                    <div>h3ll0_w0rld</div>
                    <div>pass: 123456</div>
                    <div>END_OF_FILE</div>
                </div>
            )
        },
        {
            title: "Steghide Extraction",
            instruction: "We found a potential password: '123456'. Try to use it to extract hidden data with steghide: 'steghide extract -sf evidence.jpg -p 123456'",
            expected: "steghide extract -sf evidence.jpg -p 123456",
            validate: (cmd: string) => cmd.includes("steghide extract"),
            response: (
                <div className="text-text-muted">
                    <div>wrote extracted data to "secret.txt".</div>
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
                        completeModule("stego");
                    });
                }
            }, 2000);

            return (
                <div>
                    {currentTask.response}
                    <div className="mt-2 text-primary font-mono text-xs animate-pulse">
                        [✔] ARTIFACT_ANALYZED. HIDDEN_DATA_EXTRACTED.
                    </div>
                </div>
            );
        }

        if (cmd === "help") return "Commands: exiftool [file], strings [file], steghide [options]";

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
                        <Eye size={20} />
                        <h1 className="text-2xl font-bold">Steganography</h1>
                    </div>
                    <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step) / steps.length) * 100}%` }} />
                    </div>
                </div>
                {completed ? (
                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
                        <CheckCircle2 size={32} className="text-primary mb-4" />
                        <h3 className="text-xl font-bold text-primary mb-2">Hidden in Plain Sight</h3>
                        <p className="text-text-muted mb-4">You successfully extracted secret messages from a digital image.</p>
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
                        welcomeMessage="Digital Forensics Kit v3.0 loaded..."
                        onCommand={handleCommand}
                        className="h-[600px] border-border shadow-2xl"
                    />
                </div>
            </div>
        </div>
    );
}
