"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import { ArrowLeft, CheckCircle2, Activity } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LinuxProcessesLesson() {
	const [step, setStep] = useState(0);
	const [completed, setCompleted] = useState(false);

	const steps = [
		{
			title: "Viewing Processes (ps)",
			instruction: "See what's running. Use 'ps aux' to list all processes. Look for 'python3'.",
			expected: "ps aux",
			validate: (cmd: string) => cmd.trim() === "ps aux",
			response: (
				<div className="text-text-muted">
					<div>USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND</div>
					<div>root         1  0.0  0.1 166416  9600 ?        Ss   Oct10   0:01 /sbin/init</div>
					<div>root       420  0.0  0.0  14500  4200 ?        S    Oct10   0:00 nginx: master</div>
					<div>user      1337 99.0  0.5 250000 50000 pts/0    R    Oct10  10:00 python3 miner.py</div>
				</div>
			)
		},
		{
			title: "Dynamic Monitoring (top)",
			instruction: "Use 'top' to see processes updating in real-time.",
			expected: "top",
			validate: (cmd: string) => cmd.trim() === "top",
			response: (
				<div className="text-text-muted">
					<div className="bg-zinc-800 text-white p-2">
						<div>top - 14:00:01 up 1 day,  1 user,  load average: 1.05, 0.42, 0.12</div>
						<div>Tasks: 120 total,   1 running, 119 sleeping,   0 stopped</div>
						<div>%Cpu(s): 25.0 us,  2.0 sy,  0.0 ni, 73.0 id</div>
						<div className="mt-2">  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND</div>
						<div> 1337 user      20   0  250000  50000   1200 R  99.9  0.5  10:00.00 python3</div>
					</div>
				</div>
			)
		},
		{
			title: "Killing a Process",
			instruction: "The python process (PID 1337) is using high CPU. Kill it using 'kill': 'kill 1337'",
			expected: "kill 1337",
			validate: (cmd: string) => cmd.trim() === "kill 1337" || cmd.trim() === "kill -9 1337",
			response: (
				<div className="text-zinc-500">
					[1]  + terminated  python3 miner.py
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
						completeModule("linux-processes");
					});
				}
			}, 1000);

			return (
				<div>
					{currentTask.response}
					<div className="mt-2 text-green-400 font-mono text-xs animate-pulse">
						[✔] PROCESS ELIMINATED.
					</div>
				</div>
			);
		}

		if (cmd === "help") return "Commands: ps aux, top, kill [PID]";

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
						<Activity size={20} />
						<h1 className="text-2xl font-bold">Process Management</h1>
					</div>
					<div className="h-1 w-full bg-border rounded-full overflow-hidden">
						<div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step) / steps.length) * 100}%` }} />
					</div>
				</div>
				{completed ? (
					<div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
						<CheckCircle2 size={32} className="text-primary mb-4" />
						<h3 className="text-xl font-bold text-primary mb-2">Resource Optimized</h3>
						<p className="text-text-muted mb-4">You have successfully identified and terminated a rogue process.</p>
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
						welcomeMessage="Task Manager Active."
						onCommand={handleCommand}
						className="h-[600px] border-border shadow-2xl"
					/>
				</div>
			</div>
		</div>
	);
}
