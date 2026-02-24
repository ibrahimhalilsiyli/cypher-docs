"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import { ArrowLeft, CheckCircle2, Network } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function WiresharkLesson() {
    const [step, setStep] = useState(0);
    const [completed, setCompleted] = useState(false);

    const steps = [
        {
            title: "Loading a PCAP",
            instruction: "Network traffic is captured in PCAP files. Load 'suspicious.pcap' into the analyzer: 'load-pcap suspicious.pcap'",
            expected: "load-pcap suspicious.pcap",
            validate: (cmd: string) => cmd === "load-pcap suspicious.pcap",
            response: (
                <div className="text-text-muted">
                    <div>[+] Loaded 15,420 packets.</div>
                    <div>[+] Time duration: 42s</div>
                    <div>[+] Protocols: TCP, UDP, HTTP, DNS</div>
                </div>
            )
        },
        {
            title: "Filtering HTTP Traffic",
            instruction: "There's too much noise. Filter for HTTP POST requests to find login attempts: 'filter http.request.method == \"POST\"'",
            expected: "filter http.request.method == \"POST\"",
            validate: (cmd: string) => cmd.includes("filter http.request.method") && cmd.includes("POST"),
            response: (
                <div className="text-text-muted">
                    <div>Applying filter...</div>
                    <div className="mt-2 text-xs">
                        <span>No.     Time           Source                Destination           Protocol Length Info</span><br />
                        <span className="text-yellow-300">429     14.230112      192.168.1.105         104.21.55.2           HTTP     452    POST /login.php HTTP/1.1</span>
                    </div>
                </div>
            )
        },
        {
            title: "Following the Stream",
            instruction: "We found a POST request. Let's inspect the payload. Follow the TCP stream for packet #429: 'follow-stream tcp 429'",
            expected: "follow-stream tcp 429",
            validate: (cmd: string) => cmd.includes("follow-stream"),
            response: (
                <div className="text-text-muted">
                    <div className="text-red-400">POST /login.php HTTP/1.1</div>
                    <div className="text-red-400">Host: insecure-admin.net</div>
                    <div className="text-red-400">User-Agent: Mozilla/5.0...</div>
                    <div className="text-red-400">Content-Length: 38</div>
                    <div className="text-red-400 mt-2">username=admin&password=SuperSecret123</div>
                    <div className="text-blue-300 mt-2">HTTP/1.1 200 OK</div>
                    <div className="text-blue-300">Set-Cookie: PHPSESSID=7a8b9...</div>
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
                        completeModule("wireshark");
                    });
                }
            }, 3000);

            return (
                <div>
                    {currentTask.response}
                    <div className="mt-2 text-primary font-mono text-xs animate-pulse">
                        [✔] PACKET_DECODED. CREDENTIALS_SNIFFED.
                    </div>
                </div>
            );
        }

        if (cmd === "help") return "Commands: load-pcap [file], filter [expression], follow-stream [proto] [id]";

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
                        <Network size={20} />
                        <h1 className="text-2xl font-bold">Wireshark Analysis</h1>
                    </div>
                    <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step) / steps.length) * 100}%` }} />
                    </div>
                </div>
                {completed ? (
                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
                        <CheckCircle2 size={32} className="text-primary mb-4" />
                        <h3 className="text-xl font-bold text-primary mb-2">Packets Analyzed</h3>
                        <p className="text-text-muted mb-4">You extracted cleartext credentials from unencrypted network traffic.</p>
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
                        welcomeMessage="TShark (Wireshark) v4.0.0. Term-UI mode."
                        onCommand={handleCommand}
                        className="h-[600px] border-border shadow-2xl"
                    />
                </div>
            </div>
        </div>
    );
}
