"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import { ArrowLeft, CheckCircle2, Database } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LinuxDiskLesson() {
	const [step, setStep] = useState(0);
	const [completed, setCompleted] = useState(false);

	const steps = [
		{
			title: "Disk Usage (Free Space)",
			instruction: "Check available disk space using 'df' with the human-readable flag (-h). Run: 'df -h'",
			expected: "df -h",
			validate: (cmd: string) => cmd.trim() === "df -h",
			response: (
				<div className="text-text-muted">
					<div>Filesystem      Size  Used Avail Use% Mounted on</div>
					<div>/dev/sda1        50G   24G   23G  52% /</div>
					<div>tmpfs           2.0G     0  2.0G   0% /run</div>
				</div>
			)
		},
		{
			title: "Directory Usage (Size)",
			instruction: "Check the size of a specific directory. Check /var/log: 'du -sh /var/log'",
			expected: "du -sh /var/log",
			validate: (cmd: string) => cmd.trim() === "du -sh /var/log",
			response: (
				<div className="text-zinc-500">
					256M    /var/log
				</div>
			)
		},
		{
			title: "Mounting",
			instruction: "We have a USB drive at /dev/sdb1. Mount it to /mnt/usb: 'mount /dev/sdb1 /mnt/usb'",
			expected: "mount /dev/sdb1 /mnt/usb",
			validate: (cmd: string) => cmd.includes("mount") && cmd.includes("/dev/sdb1") && cmd.includes("/mnt/usb"),
			response: (
				<div className="text-zinc-500">
					mounted /dev/sdb1 on /mnt/usb
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
						completeModule("linux-disk");
					});
				}
			}, 1000);

			return (
				<div>
					{currentTask.response}
					<div className="mt-2 text-green-400 font-mono text-xs animate-pulse">
						[✔] STORAGE ANALYZED.
					</div>
				</div>
			);
		}

		if (cmd === "help") return "Commands: df -h, du -sh [dir], mount [dev] [dir]";

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
						<h1 className="text-2xl font-bold">Disk Management</h1>
					</div>
					<div className="h-1 w-full bg-border rounded-full overflow-hidden">
						<div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step) / steps.length) * 100}%` }} />
					</div>
				</div>
				{completed ? (
					<div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
						<CheckCircle2 size={32} className="text-primary mb-4" />
						<h3 className="text-xl font-bold text-primary mb-2">Storage Secured</h3>
						<p className="text-text-muted mb-4">You have successfully analyzed disk usage and mounted filesystems.</p>
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
						welcomeMessage="Analyzer Tool v2.0 Online."
						onCommand={handleCommand}
						className="h-[600px] border-border shadow-2xl"
					/>
				</div>
			</div>
		</div>
	);
}
