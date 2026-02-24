"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import { ArrowLeft, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LinuxPermissionsLesson() {
	const [step, setStep] = useState(0);
	const [completed, setCompleted] = useState(false);

	const steps = [
		{
			title: "1. Viewing Permissions (ls -l)",
			instruction: "File permissions determine who can read, write, or execute a file. Use 'ls -l' to view them.",
			concept: "The first column showing '-rwxr-xr-x' represents permissions. The first character is the file type (- for file, d for directory). The next 9 characters are permissions for Owner, Group, and Others.",
			expected: "ls -l",
			validate: (cmd: string) => cmd.trim() === "ls -l",
			response: (
				<div className="text-text-muted">
					<div>-rw-r--r-- 1 root root 1024 Oct 10 14:00 secret.txt</div>
					<div>drwxr-xr-x 2 root root 4096 Oct 10 14:00 public</div>
					<div>-rwxr-xr-x 1 root root 550 Oct 10 14:02 script.sh</div>
				</div>
			)
		},
		{
			title: "2. Understanding Users & Groups",
			instruction: "Files have an Owner and a Group. 'secret.txt' is owned by 'root'. Check your current user again: 'whoami'",
			concept: "If you are not the owner (root) and not in the group (root), you fall into the 'Others' category. 'secret.txt' has 'r--' for others, so you can read it but not write to it.",
			expected: "whoami",
			validate: (cmd: string) => cmd.trim() === "whoami",
			response: (
				<div className="text-text-muted">
					operative
				</div>
			)
		},
		{
			title: "3. Changing Ownership (chown)",
			instruction: "You need full control. Change the owner of 'secret.txt' to yourself (operative). Run: 'chown operative secret.txt'",
			concept: "Only the root user (or via sudo) can give away file ownership. 'chown' stands for Change Owner.",
			expected: "chown operative secret.txt",
			validate: (cmd: string) => cmd.includes("chown") && cmd.includes("operative"),
			response: (
				<div className="text-zinc-500">
					Ownership of 'secret.txt' changed to operative.
				</div>
			)
		},
		{
			title: "4. Numeric Permissions (chmod)",
			instruction: "Permissions are often represented by numbers (Read=4, Write=2, Execute=1). Give the owner Read+Write (4+2=6), and no access to anyone else (0). Run: 'chmod 600 secret.txt'",
			concept: "600 means: Owner(6), Group(0), Others(0). This is a common permission for private keys and sensitive config files.",
			expected: "chmod 600 secret.txt",
			validate: (cmd: string) => cmd.trim() === "chmod 600 secret.txt",
			response: (
				<div className="text-zinc-500">
					Permissions for 'secret.txt' set to -rw-------.
				</div>
			)
		},
		{
			title: "5. Symbolic Permissions (chmod)",
			instruction: "You can also use symbols. Add 'Execute' permission for 'All' users to 'script.sh'. Run: 'chmod +x script.sh'",
			concept: "u=user, g=group, o=others, a=all. '+x' adds execute, '-w' removes write. 'chmod +x' is shorthand for 'chmod a+x'.",
			expected: "chmod +x script.sh",
			validate: (cmd: string) => cmd.trim() === "chmod +x script.sh",
			response: (
				<div className="text-zinc-500">
					'script.sh' is now executable (-rwxr-xr-x).
				</div>
			)
		},
		{
			title: "6. Directory Permissions",
			instruction: "For directories, 'Execute' means you can enter them. Create a private folder: 'mkdir private_files'",
			concept: "If a directory has Read but not Execute permission, you can list files but cannot 'cd' into it or access file attributes.",
			expected: "mkdir private_files",
			validate: (cmd: string) => cmd.trim() === "mkdir private_files",
			response: (
				<div className="text-zinc-500">
					Directory 'private_files' created.
				</div>
			)
		},
		{
			title: "7. Recursion (-R)",
			instruction: "Change permissions for a directory and everything inside it. Set 'private_files' to 700 recursively: 'chmod -R 700 private_files'",
			concept: "Recursive changes affect the folder, subfolders, and all files within. Be very careful with 'chmod -R 777' as it opens everything to everyone.",
			expected: "chmod -R 700 private_files",
			validate: (cmd: string) => cmd.includes("chmod") && cmd.includes("-R") && cmd.includes("700"),
			response: (
				<div className="text-zinc-500">
					Permissions set recursively on 'private_files'.
				</div>
			)
		},
		{
			title: "8. Special Permissions (STICKY BIT)",
			instruction: "The /tmp directory allows anyone to create files, but only the owner can delete them. This is the 'Sticky Bit'. View /tmp permissions: 'ls -ld /tmp'",
			concept: "Look for the 't' at the end: 'drwxrwxrwt'. This ensures users can't sabotage each other's temporary files.",
			expected: "ls -ld /tmp",
			validate: (cmd: string) => cmd.trim() === "ls -ld /tmp",
			response: (
				<div className="text-text-muted">
					drwxrwxrwt 14 root root 4096 Feb 15 14:00 /tmp
				</div>
			)
		},
		{
			title: "9. Changing Group Ownership (chgrp)",
			instruction: "Sometimes you just need to change the group. Change the group of 'secret.txt' to 'developers': 'chgrp developers secret.txt'",
			concept: "This is useful when multiple users in a team need access to a file. You would also perform 'chmod 770' to give the group full access.",
			expected: "chgrp developers secret.txt",
			validate: (cmd: string) => cmd.trim() === "chgrp developers secret.txt",
			response: (
				<div className="text-zinc-500">
					Group of 'secret.txt' changed to 'developers'.
				</div>
			)
		},
		{
			title: "10. Verification",
			instruction: "Verify your work one last time. List permissions for 'secret.txt': 'ls -l secret.txt'",
			concept: "Security is a continuous process. Always verify permissions after changing them to ensure you haven't accidentally locked yourself out or exposed sensitive data.",
			expected: "ls -l secret.txt",
			validate: (cmd: string) => cmd.trim() === "ls -l secret.txt",
			response: (
				<div className="text-text-muted">
					-rw------- 1 operative developers 1024 Oct 10 14:05 secret.txt
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
						completeModule("linux-permissions");
					});
				}
			}, 1000);

			return (
				<div>
					{currentTask.response}
					<div className="mt-2 text-green-400 font-mono text-xs animate-pulse">
						[✔] PERMISSIONS SECURED.
					</div>
				</div>
			);
		}

		if (cmd === "help") return "Commands: ls -l, chown, chmod, mkdir, chgrp";

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
						<Lock size={20} />
						<h1 className="text-2xl font-bold">Permissions & Ownership</h1>
					</div>
					<div className="h-1 w-full bg-border rounded-full overflow-hidden">
						<div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
					</div>
					<div className="text-xs text-text-muted mt-2">Step {step + 1} of {steps.length}</div>
				</div>
				{completed ? (
					<div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
						<CheckCircle2 size={32} className="text-primary mb-4" />
						<h3 className="text-xl font-bold text-primary mb-2">Assets Secured</h3>
						<p className="text-text-muted mb-4">You have successfully locked down file access using chmod and chown.</p>
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
									<Lock size={12} /> Concept
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
						welcomeMessage="Access Control Module Loaded."
						onCommand={handleCommand}
						className="h-[600px] border-border shadow-2xl"
					/>
				</div>
			</div>
		</div>
	);
}
