"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import { ArrowLeft, CheckCircle2, Terminal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LinuxScriptingLesson() {
	const [step, setStep] = useState(0);
	const [completed, setCompleted] = useState(false);

	const steps = [
		{
			title: "Shebang (!#)",
			instruction: "Every script starts with a Shebang. Create a file named 'hello.sh' that prints text. Use echo and redirect: 'echo -e \"#!/bin/bash\\necho Hello World\" > hello.sh'",
			expected: "echo -e \"#!/bin/bash\\necho Hello World\" > hello.sh",
			validate: (cmd: string) => cmd.includes("echo") && cmd.includes("hello.sh") && (cmd.includes("#!/bin/bash") || cmd.includes("#! /bin/bash")),
			response: (
				<div className="text-zinc-500">
					File 'hello.sh' created.
				</div>
			)
		},
		{
			title: "Making Executable",
			instruction: "A script must be executable to run. Use chmod: 'chmod +x hello.sh'",
			expected: "chmod +x hello.sh",
			validate: (cmd: string) => cmd.trim() === "chmod +x hello.sh",
			response: (
				<div className="text-zinc-500">
					Mode of 'hello.sh' changed to 0755 (-rwxr-xr-x).
				</div>
			)
		},
		{
			title: "Execution",
			instruction: "Run your new script using relative path syntax: './hello.sh'",
			expected: "./hello.sh",
			validate: (cmd: string) => cmd.trim() === "./hello.sh",
			response: (
				<div className="text-text-muted">
					Hello World
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
						completeModule("linux-scripting");
					});
				}
			}, 1000);

			return (
				<div>
					{currentTask.response}
					<div className="mt-2 text-green-400 font-mono text-xs animate-pulse">
						[✔] SCRIPT EXECUTED.
					</div>
				</div>
			);
		}

		if (cmd === "help") return "Commands: echo ... > file.sh, chmod +x file.sh, ./file.sh";

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
						<Terminal size={20} />
						<h1 className="text-2xl font-bold">Shell Scripting</h1>
					</div>
					<div className="h-1 w-full bg-border rounded-full overflow-hidden">
						<div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step) / steps.length) * 100}%` }} />
					</div>
				</div>
				{completed ? (
					<div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
						<CheckCircle2 size={32} className="text-primary mb-4" />
						<h3 className="text-xl font-bold text-primary mb-2">Automator</h3>
						<p className="text-text-muted mb-4">You have written and executed your first Bash script.</p>
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
						welcomeMessage="Bash Interpreter Ready."
						onCommand={handleCommand}
						className="h-[600px] border-border shadow-2xl"
					/>
				</div>
			</div>
		</div>
	);
}
