"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import { ArrowLeft, CheckCircle2, Cpu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LinuxServicesLesson() {
	const [step, setStep] = useState(0);
	const [completed, setCompleted] = useState(false);

	const steps = [
		{
			title: "Check Status",
			instruction: "Check the status of the SSH service. Run: 'systemctl status ssh'",
			expected: "systemctl status ssh",
			validate: (cmd: string) => cmd.trim() === "systemctl status ssh",
			response: (
				<div className="text-text-muted">
					<div className="text-green-400">● ssh.service - OpenBSD Secure Shell server</div>
					<div>   Loaded: loaded (/lib/systemd/system/ssh.service; enabled; vendor preset: enabled)</div>
					<div>   Active: active (running) since Mon 2023-10-02 10:00:00 UTC; 2h 30min ago</div>
				</div>
			)
		},
		{
			title: "Stop Service",
			instruction: "Stop the service to simulate maintenance. Run: 'sudo systemctl stop ssh'",
			expected: "sudo systemctl stop ssh",
			validate: (cmd: string) => cmd.trim() === "sudo systemctl stop ssh" || cmd.trim() === "systemctl stop ssh",
			response: (
				<div className="text-zinc-500">
					(Service stopped)
				</div>
			)
		},
		{
			title: "Restart Service",
			instruction: "Bring the service back online. Run: 'sudo systemctl restart ssh'",
			expected: "sudo systemctl restart ssh",
			validate: (cmd: string) => cmd.trim() === "sudo systemctl restart ssh" || cmd.trim() === "systemctl restart ssh",
			response: (
				<div className="text-zinc-500">
					(Service restarted)
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
						completeModule("linux-services");
					});
				}
			}, 1000);

			return (
				<div>
					{currentTask.response}
					<div className="mt-2 text-green-400 font-mono text-xs animate-pulse">
						[✔] SERVICE RESTORED.
					</div>
				</div>
			);
		}

		if (cmd === "help") return "Commands: systemctl status [svc], systemctl stop [svc], systemctl restart [svc]";

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
						<Cpu size={20} />
						<h1 className="text-2xl font-bold">Systemd Services</h1>
					</div>
					<div className="h-1 w-full bg-border rounded-full overflow-hidden">
						<div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step) / steps.length) * 100}%` }} />
					</div>
				</div>
				{completed ? (
					<div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
						<CheckCircle2 size={32} className="text-primary mb-4" />
						<h3 className="text-xl font-bold text-primary mb-2">SysAdmin</h3>
						<p className="text-text-muted mb-4">You have successfully managed system services.</p>
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
						welcomeMessage="System Control Interface."
						onCommand={handleCommand}
						className="h-[600px] border-border shadow-2xl"
					/>
				</div>
			</div>
		</div>
	);
}
