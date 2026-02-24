"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import { ArrowLeft, CheckCircle2, Database } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LinuxFilesystemLesson() {
	const [step, setStep] = useState(0);
	const [completed, setCompleted] = useState(false);

	const steps = [
		{
			title: "1. The Root Directory",
			instruction: "In Linux, everything starts at root (/). It is the top of the hierarchy. List the contents of the root directory: 'ls /'",
			concept: "Unlike Windows which uses drive letters (C:, D:), Linux uses a single tree structure. Different drives are 'mounted' into folders within this tree.",
			expected: "ls /",
			validate: (cmd: string) => cmd.trim() === "ls /",
			response: (
				<div className="text-text-muted">
					<div className="grid grid-cols-4 gap-2 font-mono text-sm">
						<span className="text-blue-400 font-bold">bin/</span>
						<span className="text-blue-400 font-bold">boot/</span>
						<span className="text-blue-400 font-bold">dev/</span>
						<span className="text-blue-400 font-bold">etc/</span>
						<span className="text-blue-400 font-bold">home/</span>
						<span className="text-blue-400 font-bold">lib/</span>
						<span className="text-blue-400 font-bold">media/</span>
						<span className="text-blue-400 font-bold">mnt/</span>
						<span className="text-blue-400 font-bold">opt/</span>
						<span className="text-blue-400 font-bold">proc/</span>
						<span className="text-blue-400 font-bold">root/</span>
						<span className="text-blue-400 font-bold">run/</span>
						<span className="text-blue-400 font-bold">sbin/</span>
						<span className="text-blue-400 font-bold">srv/</span>
						<span className="text-blue-400 font-bold">sys/</span>
						<span className="text-blue-400 font-bold">tmp/</span>
						<span className="text-blue-400 font-bold">usr/</span>
						<span className="text-blue-400 font-bold">var/</span>
					</div>
				</div>
			)
		},
		{
			title: "2. Binaries (/bin)",
			instruction: "Essential user programs (binaries) live here. List the contents to see common commands: 'ls /bin'",
			concept: "/bin contains commands that are available to all users, like ls, cp, mv, cat, and bash. These are required for the system to boot and run in single-user mode.",
			expected: "ls /bin",
			validate: (cmd: string) => cmd.trim() === "ls /bin",
			response: (
				<div className="text-zinc-500">
					bash cat cp date dd df dmesg echo false hostname kill ln login ls mkdir ...
				</div>
			)
		},
		{
			title: "3. System Binaries (/sbin)",
			instruction: "System binaries meant for the system administrator (root) live here. Check it out: 'ls /sbin'",
			concept: "/sbin contains binaries essential for system maintenance and administration, like fsck, reboot, and iptables. Regular users typically cannot run these without sudo.",
			expected: "ls /sbin",
			validate: (cmd: string) => cmd.trim() === "ls /sbin",
			response: (
				<div className="text-zinc-500">
					fdisk fsck halt ifconfig init iptables mkfs reboot route shutdown ...
				</div>
			)
		},
		{
			title: "4. Configuration Files (/etc)",
			instruction: "System-wide configuration files live in /etc. This is the 'nerve center'. Change directory to /etc: 'cd /etc'",
			concept: "The name comes from 'et cetera', but now it's where config files live. If you need to change how a service behaves (like SSH or Apache), you edit files here.",
			expected: "cd /etc",
			validate: (cmd: string) => cmd.trim() === "cd /etc",
			response: (
				<div className="text-zinc-500">
					Current directory: /etc
				</div>
			)
		},
		{
			title: "5. Variable Data (/var)",
			instruction: "/var contains data that changes during operation, like logs, mail, and print queues. Go to /var/log: 'cd /var/log'",
			concept: "Log files are critical for troubleshooting and security auditing. They grow in size over time, hence 'variable'.",
			expected: "cd /var/log",
			validate: (cmd: string) => cmd.trim() === "cd /var/log",
			response: (
				<div className="text-zinc-500">
					Current directory: /var/log
				</div>
			)
		},
		{
			title: "6. Temporary Files (/tmp)",
			instruction: "A place for temporary files. Content here is often deleted on reboot. Go there: 'cd /tmp'",
			concept: "Any user can write to /tmp. It's useful for scripts that need to create intermediate files. However, it can also be a security risk if permissions aren't managed correctly.",
			expected: "cd /tmp",
			validate: (cmd: string) => cmd.trim() === "cd /tmp",
			response: (
				<div className="text-zinc-500">
					Current directory: /tmp
				</div>
			)
		},
		{
			title: "7. User Home Directories (/home)",
			instruction: "Each generic user gets a folder in /home. Check who has a home folder: 'ls /home'",
			concept: "Linux is a multi-user OS. My files are in /home/operative, and I cannot read files in other users' directories unless they explicitly allow it.",
			expected: "ls /home",
			validate: (cmd: string) => cmd.trim() === "ls /home",
			response: (
				<div className="text-text-muted">
					<span className="text-blue-400 font-bold">operative/</span> <span className="text-blue-400 font-bold">guest/</span>
				</div>
			)
		},
		{
			title: "8. The Root User Home (/root)",
			instruction: "The administrator 'root' has a special home directory at /root, not /home/root. Try to list it: 'ls /root'",
			concept: "Permissions protect this directory. Usually, only the root user can read it. It prevents regular users from seeing the admin's private files and history.",
			expected: "ls /root",
			validate: (cmd: string) => cmd.trim() === "ls /root",
			response: (
				<div className="text-red-400">
					ls: cannot open directory '/root': Permission denied
				</div>
			)
		},
		{
			title: "9. Virtual Filesystem (/proc)",
			instruction: "/proc is a virtual filesystem providing a window into the kernel. It doesn't exist on disk. Cat the uptime file: 'cat /proc/uptime'",
			concept: "Files in /proc are generated on the fly by the kernel. They allow you to read system state (memory, cpu info) directly as if they were files.",
			expected: "cat /proc/uptime",
			validate: (cmd: string) => cmd.trim() === "cat /proc/uptime",
			response: (
				<div className="text-text-muted">
					35073.45 140021.22
				</div>
			)
		},
		{
			title: "10. Return Home (~)",
			instruction: "The tilde (~) is a shortcut for your home directory. Return to your workspace: 'cd ~' or just 'cd'",
			concept: "Navigating back to your home directory quickly is a muscle memory you will develop. 'cd' with no arguments does the exact same thing.",
			expected: "cd",
			validate: (cmd: string) => cmd.trim() === "cd" || cmd.trim() === "cd ~",
			response: (
				<div className="text-zinc-500">
					Current directory: /home/operative
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
						completeModule("linux-filesystem");
					});
				}
			}, 1000);

			return (
				<div>
					{currentTask.response}
					<div className="mt-2 text-green-400 font-mono text-xs animate-pulse">
						[✔] NAVIGATED.
					</div>
				</div>
			);
		}

		if (cmd === "help") return "Commands: ls [dir], cd [dir]";

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
						<h1 className="text-2xl font-bold">Filesystem Hierarchy</h1>
					</div>
					<div className="h-1 w-full bg-border rounded-full overflow-hidden">
						<div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
					</div>
					<div className="text-xs text-text-muted mt-2">Step {step + 1} of {steps.length}</div>
				</div>
				{completed ? (
					<div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
						<CheckCircle2 size={32} className="text-primary mb-4" />
						<h3 className="text-xl font-bold text-primary mb-2">Structure Understood</h3>
						<p className="text-text-muted mb-4">You have successfully navigated the Linux Directory Structure.</p>
						<Link href="/training" className="block w-full py-2 bg-primary text-white font-bold text-center rounded hover:bg-primary-hover transition-colors">Return to Base</Link>
					</div>
				) : (
					<div key={step} className="animate-in fade-in slide-in-from-right-4 duration-300">
						<h2 className="text-xl font-bold text-primary mb-4">{steps[step].title}</h2>

						<div className="mb-6">
							<div className="text-xs text-primary mb-1 uppercase tracking-wider font-bold">Instruction</div>
							<p className="text-text leading-relaxed">{steps[step].instruction}</p>
						</div>

						{steps[step].concept && (
							<div className="mb-6 p-4 bg-surface rounded border border-border">
								<div className="text-xs text-secondary/80 mb-1 uppercase tracking-wider font-bold flex items-center gap-2">
									<Database size={12} /> Concept
								</div>
								<p className="text-zinc-400 text-sm leading-relaxed">{steps[step].concept}</p>
							</div>
						)}

						<div className="bg-black/40 p-4 rounded border border-border">
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
						welcomeMessage="Operative Terminal Ready. Location: /"
						onCommand={handleCommand}
						className="h-[600px] border-border shadow-2xl"
					/>
				</div>
			</div>
		</div>
	);
}
