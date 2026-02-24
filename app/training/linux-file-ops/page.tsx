"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import LessonGuide from "@/components/training/LessonGuide";
import { ArrowLeft, CheckCircle2, FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LinuxFileOpsLesson() {
	const [step, setStep] = useState(0);
	const [completed, setCompleted] = useState(false);

	const steps = [
		{
			title: "1. Creating Empty Files",
			instruction: "The 'touch' command creates an empty file or updates the timestamp of an existing one. Create 'mission.txt': 'touch mission.txt'",
			concept: "In Linux, file extensions (.txt) are optional and for human readability. The system identifies files by their content (magic bytes), not their name.",
			hint: "Run: touch mission.txt",
			cmd: "touch mission.txt",
			validate: (cmd: string) => cmd.trim() === "touch mission.txt",
			response: (
				<div className="text-zinc-500">
					File 'mission.txt' created.
				</div>
			)
		},
		{
			title: "2. Adding Content",
			instruction: "We can direct output into a file using '>'. Echo some text into the file: 'echo \"Target Acquired\" > mission.txt'",
			concept: "Redirection (>) sends the output of a command to a file instead of the screen. Be careful: '>' overwrites the file, while '>>' appends to it.",
			hint: "Run: echo \"Target Acquired\" > mission.txt",
			cmd: "echo \"Target Acquired\" > mission.txt",
			validate: (cmd: string) => cmd.includes("echo") && cmd.includes("mission.txt"),
			response: (
				<div className="text-zinc-500">
					Content written to 'mission.txt'.
				</div>
			)
		},
		{
			title: "3. Reading Content (cat)",
			instruction: "Verify the content of your file using 'cat' (concatenate). Run: 'cat mission.txt'",
			concept: "'cat' is the simplest way to view a file. For longer files, 'less' or 'more' is preferred as they allow scrolling.",
			hint: "Run: cat mission.txt",
			cmd: "cat mission.txt",
			validate: (cmd: string) => cmd.trim() === "cat mission.txt",
			response: (
				<div className="text-text-muted">
					Target Acquired
				</div>
			)
		},
		{
			title: "4. Copying Files (cp)",
			instruction: "Make a backup of the file using 'cp'. Run: 'cp mission.txt mission.bak'",
			concept: "'cp' makes an exact duplicate. You can copy files to other directories too, e.g., 'cp file.txt /tmp/'. Add '-r' to copy directories recursively.",
			hint: "Run: cp mission.txt mission.bak",
			cmd: "cp mission.txt mission.bak",
			validate: (cmd: string) => cmd.trim() === "cp mission.txt mission.bak",
			response: (
				<div className="text-zinc-500">
					'mission.txt' copied to 'mission.bak'
				</div>
			)
		},
		{
			title: "5. Moving & Renaming (mv)",
			instruction: "Linux doesn't have a specific 'rename' command; we just 'move' a file to a new name. Rename the backup: 'mv mission.bak archive.txt'",
			concept: "'mv' moves files physically or renames them. Unlike 'cp', the original file is removed from the source location.",
			hint: "Run: mv mission.bak archive.txt",
			cmd: "mv mission.bak archive.txt",
			validate: (cmd: string) => cmd.trim() === "mv mission.bak archive.txt",
			response: (
				<div className="text-zinc-500">
					'mission.bak' moved to 'archive.txt'
				</div>
			)
		},
		{
			title: "6. Listing with Details (ls -l)",
			instruction: "See the details of your files (size, permissions, date) using the long listing format: 'ls -l'",
			concept: "The output shows permissions (rwx), owner, group, size (in bytes), and modification date. Hidden files (starting with .) are not shown without '-a'.",
			hint: "Run: ls -l",
			cmd: "ls -l",
			validate: (cmd: string) => cmd.trim() === "ls -l",
			response: (
				<div className="text-text-muted">
					<div>-rw-r--r-- 1 operative operative 16 Feb 15 14:02 archive.txt</div>
					<div>-rw-r--r-- 1 operative operative 16 Feb 15 14:01 mission.txt</div>
				</div>
			)
		},
		{
			title: "7. Creating Directories (mkdir)",
			instruction: "Organize your files. Create a new directory called 'reports': 'mkdir reports'",
			concept: "Directories (folders) allow you to group files. You can create a hierarchy at once using 'mkdir -p parent/child/grandchild'.",
			hint: "Run: mkdir reports",
			cmd: "mkdir reports",
			validate: (cmd: string) => cmd.trim() === "mkdir reports",
			response: (
				<div className="text-zinc-500">
					Directory 'reports' created.
				</div>
			)
		},
		{
			title: "8. Moving into Directories",
			instruction: "Move your text files into the new directory using a wildcard (*): 'mv *.txt reports/'",
			concept: "The asterisk (*) is a wildcard that matches any character. '*.txt' matches all files ending in .txt. This saves you from typing every filename.",
			hint: "Run: mv *.txt reports/",
			cmd: "mv *.txt reports/",
			validate: (cmd: string) => cmd.includes("mv") && cmd.includes("reports"),
			response: (
				<div className="text-zinc-500">
					'archive.txt' -&gt; 'reports/archive.txt'
					<br />
					'mission.txt' -&gt; 'reports/mission.txt'
				</div>
			)
		},
		{
			title: "9. Removing Files (rm)",
			instruction: "Clean up. Delete the 'reports' directory and everything inside it recursively: 'rm -r reports'",
			concept: "WARNING: 'rm' is permanent. There is no Trash bin. using '-r' (recursive) and '-f' (force) can destroy your system if run as root. Always check before pressing Enter.",
			hint: "Run: rm -r reports",
			cmd: "rm -r reports",
			validate: (cmd: string) => cmd.trim() === "rm -r reports",
			response: (
				<div className="text-zinc-500">
					Directory 'reports' removed.
				</div>
			)
		},
		{
			title: "10. Reading Large Files (head/tail)",
			instruction: "Sometimes you only need the start or end of a file. Read the last 3 lines of the system logs: 'tail -n 3 /var/log/syslog'",
			concept: "'head' reads the beginning, 'tail' reads the end. 'tail -f' follows the file in real-time, which is essential for monitoring live logs.",
			hint: "Run: tail -n 3 /var/log/syslog",
			cmd: "tail -n 3 /var/log/syslog",
			validate: (cmd: string) => cmd.includes("tail") && cmd.includes("syslog"),
			response: (
				<div className="text-text-muted">
					<div>Feb 15 14:05:01 cypher-node CRON[123]: (root) CMD (command -v debian-sa1 &gt; /dev/null && debian-sa1 1 1)</div>
					<div>Feb 15 14:05:22 cypher-node systemd[1]: Started Session 42 of user operative.</div>
					<div>Feb 15 14:17:01 cypher-node CRON[124]: (root) CMD (   cd / && run-parts --report /etc/cron.hourly)</div>
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
						completeModule("linux-file-ops");
					});
				}
			}, 1000);

			return (
				<div>
					{currentTask.response}
					<div className="mt-2 text-green-400 font-mono text-xs animate-pulse">
						[✔] OPERATION SUCCESSFUL.
					</div>
				</div>
			);
		}

		if (cmd === "help") return "Commands: touch, echo, cat, cp, mv, ls, mkdir, rm, tail";

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
						<FileText size={20} />
						<h1 className="text-2xl font-bold">File Operations</h1>
					</div>
					<div className="h-1 w-full bg-border rounded-full overflow-hidden">
						<div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
					</div>
					<div className="text-xs text-text-muted mt-2">Step {step + 1} of {steps.length}</div>
				</div>
				{completed ? (
					<div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
						<CheckCircle2 size={32} className="text-primary mb-4" />
						<h3 className="text-xl font-bold text-primary mb-2">Files Managed</h3>
						<p className="text-text-muted mb-4">You have mastered creation, manipulation, and deletion of files.</p>
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
						welcomeMessage="File Manager Module Loaded."
						onCommand={handleCommand}
						className="h-[600px] border-border shadow-2xl"
					/>
				</div>
			</div>
		</div>
	);
}
