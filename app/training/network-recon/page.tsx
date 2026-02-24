"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import LessonGuide from "@/components/training/LessonGuide";
import { ArrowLeft, CheckCircle2, Cpu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NetworkReconLesson() {
    const [step, setStep] = useState(0);
    const [completed, setCompleted] = useState(false);

    const steps = [
        {
            title: "Host Discovery",
            instruction: "Before attacking, we must confirm the target is active. Use the 'ping' command to check connectivity to 'target.corp'.",
            concept: "ICMP Echo Requests (Ping) are the simplest way to check if a host is alive. However, firewalls often block this protocol.",
            hint: "Run: ping target.corp",
            cmd: "ping target.corp",
            validate: (cmd: string) => cmd.trim() === "ping target.corp",
            response: (
                <div className="text-text-muted">
                    <div>PING target.corp (192.168.1.55): 56 data bytes</div>
                    <div>64 bytes from 192.168.1.55: icmp_seq=0 ttl=64 time=0.045 ms</div>
                    <div>64 bytes from 192.168.1.55: icmp_seq=1 ttl=64 time=0.038 ms</div>
                    <div className="text-zinc-500">--- target.corp ping statistics ---</div>
                    <div>2 packets transmitted, 2 packets received, 0.0% packet loss</div>
                </div>
            )
        },
        {
            title: "Port Scanning",
            instruction: "Now that we know the host is up, let's find open ports. Run 'nmap target.corp' to scan for running services.",
            concept: "Nmap (Network Mapper) sends packets to various ports to see how they respond. An 'Open' port means a service is listening.",
            hint: "Run: nmap target.corp",
            cmd: "nmap target.corp",
            validate: (cmd: string) => cmd.trim() === "nmap target.corp",
            response: (
                <div className="text-text-muted">
                    <div>Starting Nmap 7.94 ( https://nmap.org )</div>
                    <div>Nmap scan report for target.corp (192.168.1.55)</div>
                    <div>Host is up (0.00045s latency).</div>
                    <div className="mt-2">
                        <div className="font-bold underline mb-1">PORT     STATE SERVICE</div>
                        <div>22/tcp   <span className="text-green-500">open</span>  ssh</div>
                        <div>80/tcp   <span className="text-green-500">open</span>  http</div>
                        <div>443/tcp  <span className="text-green-500">open</span>  https</div>
                        <div>3306/tcp <span className="text-green-500">open</span>  mysql</div>
                    </div>
                    <div className="mt-2">Nmap done: 1 IP address (1 host up) scanned in 0.15 seconds</div>
                </div>
            )
        },
        {
            title: "Service Enumeration",
            instruction: "We see port 80 is open. Let's try to identify the web server version. Run 'nmap -sV -p 80 target.corp'.",
            concept: "Service Version Detection (-sV) probes open ports to query the application for its banner or version string.",
            hint: "Run: nmap -sV -p 80 target.corp",
            cmd: "nmap -sV -p 80 target.corp",
            validate: (cmd: string) => cmd.includes("-sV") && cmd.includes("80"),
            response: (
                <div className="text-text-muted">
                    <div>Starting Nmap...</div>
                    <div className="mt-2">
                        <div className="font-bold underline mb-1">PORT   STATE SERVICE VERSION</div>
                        <div>80/tcp <span className="text-green-500">open</span>  http    Apache httpd 2.4.49 <span className="text-red-500">(Vulnerable)</span></div>
                    </div>
                    <div className="mt-2 text-yellow-500">Host appears vulnerable to CVE-2021-41773 (Path Traversal).</div>
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
                        completeModule("network-recon");
                    });
                }
            }, 3000);

            return (
                <div>
                    {currentTask.response}
                    <div className="mt-2 text-secondary font-mono text-xs animate-pulse">
                        [✔] SCAN_COMPLETE. DATA_ACQUIRED.
                    </div>
                </div>
            );
        }

        if (cmd === "help") return "Commands: ping [host], nmap [options] [host]";

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
                    <div className="flex items-center gap-2 mb-2 text-secondary">
                        <Cpu size={20} />
                        <h1 className="text-2xl font-bold">Network Recon</h1>
                    </div>

                    <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                        <div
                            className="h-full bg-secondary transition-all duration-500"
                            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                        />
                    </div>
                    <div className="mt-2 text-xs text-text-muted">
                        PHASE: {step + 1} / {steps.length}
                    </div>
                </div>

                {completed ? (
                    <div className="bg-secondary/10 border border-secondary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
                        <CheckCircle2 size={32} className="text-secondary mb-4" />
                        <h3 className="text-xl font-bold text-secondary mb-2">Target Mapped</h3>
                        <p className="text-text-muted mb-4">You have successfully identified the attack surface.</p>
                        <Link href="/training" className="block w-full py-2 bg-secondary text-white font-bold text-center rounded hover:bg-secondary/80 transition-colors">
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
                        welcomeMessage="Initializing Nmap v7.94... Ready."
                        onCommand={handleCommand}
                        className="h-[600px] border-border shadow-2xl"
                    />
                </div>
            </div>
        </div>
    );
}
