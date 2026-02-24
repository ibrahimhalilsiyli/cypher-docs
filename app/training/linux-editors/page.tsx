"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import { ArrowLeft, CheckCircle2, Code } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LinuxEditorsLesson() {
	const [step, setStep] = useState(0);
	const [completed, setCompleted] = useState(false);

	const steps = [
		{
			title: "Opening a File (Nano)",
			instruction: "Nano is a beginner-friendly editor. Open 'config.conf' with nano: 'nano config.conf'",
			expected: "nano config.conf",
			validate: (cmd: string) => cmd.trim() === "nano config.conf",
			response: (
				<div className="text-text-muted border border-white p-2 h-32 relative">
					<div className="bg-white text-black px-1 mb-2">GNU nano 6.2</div>
					<div>server_port=8080</div>
					<div>max_connections=100</div>
					<div>log_level=debug</div>
					<div className="absolute bottom-0 w-full bg-white text-black px-1">^G Help  ^O Write Out  ^X Exit</div>
				</div>
			)
		},
		{
			title: "Opening a File (Vim)",
			instruction: "Vim is widely used by sysadmins. Open 'script.sh' with vim: 'vim script.sh'",
			expected: "vim script.sh",
			validate: (cmd: string) => cmd.trim() === "vim script.sh",
			response: (
				<div className="text-text-muted border border-zinc-700 p-2 h-32 relative">
					<div>#!/bin/bash</div>
					<div className="text-blue-400">echo "Hello World"</div>
					<div className="absolute bottom-0 text-zinc-500">"script.sh" 2L, 29B</div>
				</div>
			)
		},
		{
			title: "Exiting Vim",
			instruction: "The classic trap! To exit vim, type colon, then q, then enter. Try it: ':q'",
			expected: ":q",
			validate: (cmd: string) => cmd.trim() === ":q" || cmd.trim() === ":wq" || cmd.trim() === ":q!",
			response: (
				<div className="text-zinc-500">
					bash: :q: command not found (Simulation: You successfully exited Vim!)
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
						completeModule("linux-editors");
					});
				}
			}, 1500); // Slightly longer delay to let them appreciate the "editor" view

			return (
				<div>
					{currentTask.response}
					{step === 2 && (
						<div className="mt-2 text-green-400 font-mono text-xs animate-pulse">
							[✔] EDITOR MASTERY UNLOCKED.
						</div>
					)}
				</div>
			);
		}

		if (cmd === "help") return "Commands: nano [file], vim [file], :q";

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
						<Code size={20} />
						<h1 className="text-2xl font-bold">Text Editors</h1>
					</div>
					<div className="h-1 w-full bg-border rounded-full overflow-hidden">
						<div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step) / steps.length) * 100}%` }} />
					</div>
				</div>
				{completed ? (
					<div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
						<CheckCircle2 size={32} className="text-primary mb-4" />
						<h3 className="text-xl font-bold text-primary mb-2">Editor Escaped</h3>
						<p className="text-text-muted mb-4">You can now edit configuration files on remote servers.</p>
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
						welcomeMessage="Terminal Editors: Nano vs Vim."
						onCommand={handleCommand}
						className="h-[600px] border-border shadow-2xl"
					/>
				</div>
			</div>
		</div>
	);
}
