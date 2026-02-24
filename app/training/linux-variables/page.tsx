"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import { ArrowLeft, CheckCircle2, Code2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LinuxVariablesLesson() {
	const [step, setStep] = useState(0);
	const [completed, setCompleted] = useState(false);

	const steps = [
		{
			title: "Defining Variables",
			instruction: "Variables store data. Define a variable named targets: 'TARGET=\"192.168.1.50\"'",
			expected: "TARGET=\"192.168.1.50\"",
			validate: (cmd: string) => cmd.trim() === 'TARGET="192.168.1.50"',
			response: (
				<div className="text-zinc-500">
					(Variable set)
				</div>
			)
		},
		{
			title: "Using Variables",
			instruction: "Use the variable with the $ sign. Echo it back: 'echo $TARGET'",
			expected: "echo $TARGET",
			validate: (cmd: string) => cmd.trim() === "echo $TARGET",
			response: (
				<div className="text-text-muted">
					192.168.1.50
				</div>
			)
		},
		{
			title: "Loops",
			instruction: "Loops automate repetition. Write a simple loop: 'for i in {1..3}; do echo $i; done'",
			expected: "for i in {1..3}; do echo $i; done",
			validate: (cmd: string) => cmd.includes("for i in") && cmd.includes("echo $i"),
			response: (
				<div className="text-text-muted">
					<div>1</div>
					<div>2</div>
					<div>3</div>
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
						completeModule("linux-variables");
					});
				}
			}, 1000);

			return (
				<div>
					{currentTask.response}
					<div className="mt-2 text-green-400 font-mono text-xs animate-pulse">
						[✔] LOGIC EXECUTED.
					</div>
				</div>
			);
		}

		if (cmd === "help") return "Commands: VAR=value, echo $VAR, for loop";

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
						<Code2 size={20} />
						<h1 className="text-2xl font-bold">Variables & Loops</h1>
					</div>
					<div className="h-1 w-full bg-border rounded-full overflow-hidden">
						<div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step) / steps.length) * 100}%` }} />
					</div>
				</div>
				{completed ? (
					<div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
						<CheckCircle2 size={32} className="text-primary mb-4" />
						<h3 className="text-xl font-bold text-primary mb-2">Programmer</h3>
						<p className="text-text-muted mb-4">You have learned to store data and repeat actions.</p>
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
						welcomeMessage="Script Environment Active."
						onCommand={handleCommand}
						className="h-[600px] border-border shadow-2xl"
					/>
				</div>
			</div>
		</div>
	);
}
