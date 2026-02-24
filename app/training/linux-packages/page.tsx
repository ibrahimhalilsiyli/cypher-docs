"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import { ArrowLeft, CheckCircle2, Database } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LinuxPackagesLesson() {
	const [step, setStep] = useState(0);
	const [completed, setCompleted] = useState(false);

	const steps = [
		{
			title: "Updating Repositories",
			instruction: "Before installing software, update the local package list. Run: 'sudo apt update'",
			expected: "sudo apt update",
			validate: (cmd: string) => cmd.trim() === "sudo apt update" || cmd.trim() === "apt update",
			response: (
				<div className="text-text-muted">
					<div>Get:1 http://security.ubuntu.com/ubuntu jammy-security InRelease [110 kB]</div>
					<div>Hit:2 http://archive.ubuntu.com/ubuntu jammy InRelease</div>
					<div>Fetched 110 kB in 1s (112 kB/s)</div>
					<div>Reading package lists... Done</div>
				</div>
			)
		},
		{
			title: "Installing Software",
			instruction: "Now install the 'nmap' network scanner. Run: 'sudo apt install nmap'",
			expected: "sudo apt install nmap",
			validate: (cmd: string) => cmd.trim() === "sudo apt install nmap" || cmd.trim() === "apt install nmap" || cmd.includes("install nmap"),
			response: (
				<div className="text-text-muted">
					<div>Reading package lists... Done</div>
					<div>The following NEW packages will be installed: nmap</div>
					<div>Unpacking nmap...</div>
					<div>Setting up nmap...</div>
					<div className="text-green-400">Processing triggers for man-db...</div>
				</div>
			)
		},
		{
			title: "Removing Software",
			instruction: "Clean up by removing a package. Identify 'vlc' is installed and remove it: 'sudo apt remove vlc'",
			expected: "sudo apt remove vlc",
			validate: (cmd: string) => cmd.includes("remove vlc"),
			response: (
				<div className="text-text-muted">
					<div>Removing vlc...</div>
					<div>Removing vlc-bin...</div>
					<div>Processing triggers for mime-support...</div>
					<div className="text-green-400">Done.</div>
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
						completeModule("linux-packages");
					});
				}
			}, 1000);

			return (
				<div>
					{currentTask.response}
					<div className="mt-2 text-green-400 font-mono text-xs animate-pulse">
						[✔] PACKAGES MANAGED.
					</div>
				</div>
			);
		}

		if (cmd === "help") return "Commands: sudo apt update, sudo apt install [pkg], sudo apt remove [pkg]";

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
						<Database size={20} />
						<h1 className="text-2xl font-bold">Package Management</h1>
					</div>
					<div className="h-1 w-full bg-border rounded-full overflow-hidden">
						<div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step) / steps.length) * 100}%` }} />
					</div>
				</div>
				{completed ? (
					<div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
						<CheckCircle2 size={32} className="text-primary mb-4" />
						<h3 className="text-xl font-bold text-primary mb-2">Systems Updated</h3>
						<p className="text-text-muted mb-4">You have learned how to keep system software up to date.</p>
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
						welcomeMessage="APT Package Manager Initialized."
						onCommand={handleCommand}
						className="h-[600px] border-border shadow-2xl"
					/>
				</div>
			</div>
		</div>
	);
}
