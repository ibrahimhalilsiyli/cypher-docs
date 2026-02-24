"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import { ArrowLeft, CheckCircle2, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LinuxFirewallLesson() {
	const [step, setStep] = useState(0);
	const [completed, setCompleted] = useState(false);

	const steps = [
		{
			title: "Check Status",
			instruction: "Check the status of the Uncomplicated Firewall (UFW). Run: 'sudo ufw status'",
			expected: "sudo ufw status",
			validate: (cmd: string) => cmd.trim() === "sudo ufw status" || cmd.trim() === "ufw status",
			response: (
				<div className="text-text-muted">
					<div>Status: active</div>
					<div className="mt-2">To                         Action      From</div>
					<div>--                         ------      ----</div>
					<div>22/tcp                     ALLOW       Anywhere</div>
				</div>
			)
		},
		{
			title: "Allow HTTP",
			instruction: "We need to host a web server. Allow traffic on port 80 (HTTP). Run: 'sudo ufw allow 80/tcp'",
			expected: "sudo ufw allow 80/tcp",
			validate: (cmd: string) => cmd.trim() === "sudo ufw allow 80/tcp" || cmd.trim() === "ufw allow 80/tcp" || cmd.trim() === "ufw allow 80",
			response: (
				<div className="text-text-muted">
					<div>Rule added</div>
					<div>Rule added (v6)</div>
				</div>
			)
		},
		{
			title: "Deny Traffic",
			instruction: "Block traffic for a specific suspicious port, say 23 (Telnet). Run: 'sudo ufw deny 23'",
			expected: "sudo ufw deny 23",
			validate: (cmd: string) => cmd.trim() === "sudo ufw deny 23" || cmd.trim() === "ufw deny 23",
			response: (
				<div className="text-text-muted">
					<div>Rule added</div>
					<div>Rule added (v6)</div>
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
						completeModule("linux-firewall");
					});
				}
			}, 1000);

			return (
				<div>
					{currentTask.response}
					<div className="mt-2 text-green-400 font-mono text-xs animate-pulse">
						[✔] FIREWALL RULES UPDATED.
					</div>
				</div>
			);
		}

		if (cmd === "help") return "Commands: ufw status, ufw allow [port], ufw deny [port]";

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
						<Shield size={20} />
						<h1 className="text-2xl font-bold">Firewall Configuration</h1>
					</div>
					<div className="h-1 w-full bg-border rounded-full overflow-hidden">
						<div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step) / steps.length) * 100}%` }} />
					</div>
				</div>
				{completed ? (
					<div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
						<CheckCircle2 size={32} className="text-primary mb-4" />
						<h3 className="text-xl font-bold text-primary mb-2">Perimeter Secured</h3>
						<p className="text-text-muted mb-4">You have successfully configured the firewall.</p>
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
						welcomeMessage="Firewall Management Console."
						onCommand={handleCommand}
						className="h-[600px] border-border shadow-2xl"
					/>
				</div>
			</div>
		</div>
	);
}
