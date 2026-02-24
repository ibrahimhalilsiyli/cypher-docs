"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import { ArrowLeft, CheckCircle2, Flame } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function MetasploitLesson() {
    const [step, setStep] = useState(0);
    const [completed, setCompleted] = useState(false);

    const steps = [
        {
            title: "Searching for Exploits",
            instruction: "Metasploit is a powerful exploitation framework. We need to find an exploit for 'vsftpd 2.3.4'. Use the search command: 'search vsftpd 2.3.4'",
            expected: "search vsftpd 2.3.4",
            validate: (cmd: string) => cmd.includes("search vsftpd"),
            response: (
                <div className="text-text-muted">
                    <div>Matching Modules</div>
                    <div>================</div>
                    <div className="mt-2 text-xs">
                        <span className="font-bold">#  Name</span><br />
                        <span>0  exploit/unix/ftp/vsftpd_234_backdoor</span>
                    </div>
                </div>
            )
        },
        {
            title: "Selecting the Exploit",
            instruction: "Select the backdoor module using the 'use' command. Type: 'use exploit/unix/ftp/vsftpd_234_backdoor'",
            expected: "use exploit/unix/ftp/vsftpd_234_backdoor",
            validate: (cmd: string) => cmd.includes("use exploit/unix/ftp/vsftpd_234_backdoor") || cmd === "use 0",
            response: (
                <div className="text-text-muted">
                    <div>[*] No payload configured, defaulting to cmd/unix/interact</div>
                    <div className="text-primary">msf6 exploit(unix/ftp/vsftpd_234_backdoor) &gt;</div>
                </div>
            )
        },
        {
            title: "Configuring & Exploiting",
            instruction: "Set the target remote host (RHOSTS) and run the exploit. 'set RHOSTS 10.10.10.5' then 'run'",
            expected: "set RHOSTS 10.10.10.5",
            validate: (cmd: string) => cmd.includes("set RHOSTS") || cmd === "run" || cmd === "exploit",
            response: (cmd: string) => {
                if (cmd.includes("set RHOSTS")) return <div className="text-text-muted">RHOSTS =&gt; 10.10.10.5</div>;
                if (cmd === "run" || cmd === "exploit") return (
                    <div className="text-text-muted">
                        <div>[*] 10.10.10.5:21 - Banner: 220 (vsFTPd 2.3.4)</div>
                        <div>[+] 10.10.10.5:21 - Backdoor found</div>
                        <div>[*] Found shell.</div>
                        <div className="text-green-400 font-bold">root@metasploitable:~#</div>
                    </div>
                );
                return null;
            }
        }
    ];

    const handleCommand = (cmd: string) => {
        const currentTask = steps[step];

        // Special handling for step 2 (requires two commands or order check)
        // Simplifying for demo: if step 2, we need set RHOSTS first, then Run.
        // Let's just validate the specific command requested in the instruction.

        if (step === 2) {
            if (cmd.includes("set RHOSTS")) {
                return typeof currentTask.response === 'function' ? currentTask.response(cmd) : currentTask.response;
            }
            if (cmd === "run" || cmd === "exploit") {
                // Checking if they set RHOSTS ideally, but for simplicity let's allow it if it matches expectation
                setTimeout(() => {
                    setCompleted(true);
                    // Award XP
                    import("@/lib/gamification").then(({ completeModule }) => {
                        completeModule("metasploit");
                    });
                }, 3000);
                return (
                    <div>
                        {typeof currentTask.response === 'function' ? currentTask.response(cmd) : currentTask.response}
                        <div className="mt-2 text-primary font-mono text-xs animate-pulse">
                            [✔] SHELL_OPENED. SESSION_1_ESTABLISHED.
                        </div>
                    </div>
                );
            }
        }

        if (currentTask.validate(cmd)) {
            setTimeout(() => {
                if (step < steps.length - 1) {
                    setStep(step + 1);
                }
            }, 2000); // Shorter delay

            // Handle function response or static
            const resp = typeof currentTask.response === 'function' ? currentTask.response(cmd) : currentTask.response;
            return resp ? resp : <div className="text-text-muted">Command accepted.</div>;
        }

        if (cmd === "help") return "Commands: search, use, set, run, exploit";

        return <span className="text-red-400 font-mono">Unknown command: {cmd.split(" ")[0]}</span>;
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
                        <Flame size={20} />
                        <h1 className="text-2xl font-bold">Metasploit Intro</h1>
                    </div>
                    <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step) / steps.length) * 100}%` }} />
                    </div>
                </div>
                {completed ? (
                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
                        <CheckCircle2 size={32} className="text-primary mb-4" />
                        <h3 className="text-xl font-bold text-primary mb-2">System Pwned</h3>
                        <p className="text-text-muted mb-4">You successfully weaponized an exploit to gain a root shell.</p>
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
                        welcomeMessage={`
  ______________________________________________________________________________
  |                                                                            |
  |                                METASPLOIT                                  |
  |                                                                            |
  |____________________________________________________________________________|
       \\ #
        \\ ##
         \\ ###
          \\ ###
           \\ ###
            \\ ###
             \\ ###
              \\ ###
               \\ ###
                \\ ###
                 \\ ##
                  \\ #
                   \\

       =[ metasploit v6.0.30-dev                          ]
+ -- --=[ 2049 exploits - 1108 auxiliary - 344 post       ]
+ -- --=[ 562 payloads - 49 encoders - 11 nops            ]
+ -- --=[ 7 evasion                                       ]
                `}
                        onCommand={handleCommand}
                        className="h-[650px] border-border shadow-2xl"
                    />
                </div>
            </div>
        </div>
    );
}
