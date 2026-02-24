"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import LessonGuide from "@/components/training/LessonGuide";
import { ArrowLeft, CheckCircle2, Globe } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LinuxDistrosLesson() {
	const [step, setStep] = useState(0);
	const [completed, setCompleted] = useState(false);

	const steps = [
		{
			title: "1. The Linux Kernel",
			instruction: "Every Linux system is built on top of the Linux Kernel. Identify the current kernel version running on this target.",
			concept: "The kernel is the core interface between a computer's hardware and its processes. knowing the kernel version is vital for identifying potential privilege escalation vulnerabilities (e.g., Dirty COW).",
			hint: "Use 'uname' with the flag for kernel release (-r).",
			cmd: "uname -r",
			validate: (cmd: string) => cmd.trim() === "uname -r",
			response: (
				<div className="text-text-muted">
					<div>5.15.0-76-generic</div>
				</div>
			)
		},
		{
			title: "2. Linux Distributions (Distros)",
			instruction: "Identify the specific distribution release information to understand the package management and default tools available.",
			concept: "Different distros (Ubuntu, Kali, Fedora) have different file locations and package managers. '/etc/os-release' is the standard file containing this metadata.",
			hint: "Cat the content of /etc/os-release.",
			cmd: "cat /etc/os-release",
			validate: (cmd: string) => cmd.includes("cat") && cmd.includes("/etc/os-release"),
			response: (
				<div className="text-text-muted">
					<div>PRETTY_NAME="Kali GNU/Linux Rolling"</div>
					<div>NAME="Kali GNU/Linux"</div>
					<div>ID=kali</div>
					<div>VERSION_ID="2024.1"</div>
				</div>
			)
		},
		{
			title: "3. The Shell Environment",
			instruction: "Determine which shell you are currently using to interact with the system.",
			concept: "The shell interprets your commands. 'Bash' and 'Zsh' are common. Kali Linux uses Zsh by default. Knowing the shell helps in writing compatible scripts and payloads.",
			hint: "Echo the $SHELL environment variable.",
			cmd: "echo $SHELL",
			validate: (cmd: string) => cmd.trim() === "echo $SHELL",
			response: (
				<div className="text-text-muted">
					<div>/usr/bin/zsh</div>
				</div>
			)
		},
		{
			title: "4. System Identity (Hostname)",
			instruction: "Identify the machine's hostname to understand its role in the network.",
			concept: "Hostnames can reveal the server's function (e.g., 'db-prod-01', 'dev-lpt'). This is useful during the reconnaissance phase of an assessment.",
			hint: "Run the 'hostname' command.",
			cmd: "hostname",
			validate: (cmd: string) => cmd.trim() === "hostname",
			response: (
				<div className="text-text-muted">
					<div>kali</div>
				</div>
			)
		},
		{
			title: "5. System Uptime",
			instruction: "Check how long the system has been running to estimate the last patch cycle.",
			concept: "High uptime might indicate the system hasn't been patched recently, as kernel updates usually require a reboot.",
			hint: "Run 'uptime'.",
			cmd: "uptime",
			validate: (cmd: string) => cmd.trim() === "uptime",
			response: (
				<div className="text-text-muted">
					<div> 14:32:01 up 42 days,  3:14,  1 user,  load average: 0.05, 0.01, 0.00</div>
				</div>
			)
		},
		{
			title: "6. User Identity",
			instruction: "Verify your current user context.",
			concept: "Are you root? Are you a service account? 'whoami' is usually the first command run after gaining a shell.",
			hint: "Run 'whoami'.",
			cmd: "whoami",
			validate: (cmd: string) => cmd.trim() === "whoami",
			response: (
				<div className="text-text-muted">
					<div>guest</div>
				</div>
			)
		},
		{
			title: "7. Memory Usage",
			instruction: "Check the system's available memory to ensure your tools won't crash the service.",
			concept: "Running heavy tools (like hashcat) on a low-memory system can cause a denial of service. Always check resources first.",
			hint: "Use 'free' with the human-readable flag (-h).",
			cmd: "free -h",
			validate: (cmd: string) => cmd.trim() === "free -h",
			response: (
				<div className="text-text-muted">
					<div className="grid grid-cols-6 gap-2 border-b border-zinc-700 font-bold">
						<span></span><span>total</span><span>used</span><span>free</span><span>shared</span><span>buff/cache</span>
					</div>
					<div className="grid grid-cols-6 gap-2">
						<span>Mem:</span><span>16Gi</span><span>3.2Gi</span><span>8.5Gi</span><span>120Mi</span><span>4.1Gi</span>
					</div>
					<div className="grid grid-cols-6 gap-2">
						<span>Swap:</span><span>2.0Gi</span><span>0B</span><span>2.0Gi</span>
					</div>
				</div>
			)
		},
		{
			title: "8. Command History",
			instruction: "Check the command history for potential leakage of sensitive information by previous users.",
			concept: "Admins sometimes paste passwords or api keys into commands. Checking 'history' or '~/.bash_history' is a classic post-exploitation step.",
			hint: "Run 'history'.",
			cmd: "history",
			validate: (cmd: string) => cmd.trim() === "history",
			response: (
				<div className="text-text-muted">
					<div>  1  uname -r</div>
					<div>  2  cat /etc/os-release</div>
					<div>  3  echo $SHELL</div>
					<div>  4  hostname</div>
					<div>  5  uptime</div>
					<div>  6  whoami</div>
					<div>  7  free -h</div>
				</div>
			)
		},
		{
			title: "9. Locating Binaries",
			instruction: "Find the absolute path of the 'python3' interpreter.",
			concept: "You might need to bypass restricted shells (rbash) or execute scripts. Knowing the full path to a binary (like python, perl, gcc) is essential.",
			hint: "Use 'which' to locate python3.",
			cmd: "which python3",
			validate: (cmd: string) => cmd.trim() === "which python3",
			response: (
				<div className="text-text-muted">
					<div>/usr/bin/python3</div>
				</div>
			)
		},
		{
			title: "10. Open Source Discovery",
			instruction: "Locate the shell executable 'zsh' to confirm its location.",
			concept: "In some exploits, you may need to copy a shell to a writable directory. Finding the original source is step one.",
			hint: "Use 'which' to find zsh.",
			cmd: "which zsh",
			validate: (cmd: string) => cmd.trim() === "which zsh",
			response: (
				<div className="text-text-muted">
					<div>/usr/bin/zsh</div>
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
						completeModule("linux-distros");
					});
				}
			}, 1000);

			return (
				<div>
					{currentTask.response}
					<div className="mt-2 text-green-400 font-mono text-xs animate-pulse">
						[✔] OBJECTIVE COMPLETE.
					</div>
				</div>
			);
		}

		if (cmd === "help") return "Commands: uname, cat, echo, hostname, uptime, whoami, free, history, which";

		return <span className="text-red-400 font-mono">zsh: command not found: {cmd.split(" ")[0]}</span>;
	};

	return (
		<div className="min-h-screen bg-background flex flex-col md:flex-row font-mono">
			<div className="w-full md:w-1/3 bg-surface border-r border-border p-8 flex flex-col overflow-y-auto max-h-screen">
				<Link href="/training" className="inline-flex items-center text-text-muted hover:text-primary mb-8 transition-colors">
					<ArrowLeft size={16} className="mr-2" />
					Abort Mission
				</Link>
				<div className="mb-8">
					<div className="flex items-center gap-2 mb-2 text-primary">
						<Globe size={20} />
						<h1 className="text-2xl font-bold">Linux Distros</h1>
					</div>
					<div className="h-1 w-full bg-border rounded-full overflow-hidden">
						<div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
					</div>
					<div className="text-xs text-text-muted mt-2">Step {step + 1} of {steps.length}</div>
				</div>
				{completed ? (
					<div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
						<CheckCircle2 size={32} className="text-primary mb-4" />
						<h3 className="text-xl font-bold text-primary mb-2">Module Complete</h3>
						<p className="text-text-muted mb-4">You have mastered the basics of Linux verification and identification.</p>
						<Link href="/training" className="block w-full py-2 bg-primary text-white font-bold text-center rounded hover:bg-primary-hover transition-colors">Return to Base</Link>
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
			<div className="flex-1 bg-background p-8 flex items-center justify-center relative overflow-hidden">
				<div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none" />
				<div className="w-full max-w-3xl z-10">
					<InteractiveTerminal
						welcomeMessage="Kali GNU/Linux Rolling (2024.1) [Kernel 6.6.9-amd64]"
						onCommand={handleCommand}
						className="h-[600px] border-border shadow-2xl"
					/>
				</div>
			</div>
		</div>
	);
}
