"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import LessonGuide from "@/components/training/LessonGuide";
import { ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LinuxSudoLesson() {
	const [step, setStep] = useState(0);
	const [completed, setCompleted] = useState(false);

	const steps = [
		{
			title: "1. Identity Verification",
			instruction: "Before attempting privilege escalation, confirm your current identity and user context.",
			concept: "Always know who you are. The 'whoami' command prints the current effective user ID. In a security audit, this is your starting point.",
			hint: "Run the command to print the current user name.",
			cmd: "whoami",
			validate: (cmd: string) => cmd.trim() === "whoami",
			response: (
				<div className="text-text-muted">
					operative
				</div>
			)
		},
		{
			title: "2. The Privilege Barrier",
			instruction: "Attempt to read the restricted password hash file '/etc/shadow'. This operation is expected to fail.",
			concept: "'/etc/shadow' contains hashed user passwords. It is readable only by root (and the shadow group) to prevent offline cracking attacks.",
			hint: "Use 'cat' to try and read the file.",
			cmd: "cat /etc/shadow",
			validate: (cmd: string) => cmd.trim() === "cat /etc/shadow",
			response: (
				<div className="text-text-muted">
					<div className="text-red-400">cat: /etc/shadow: Permission denied</div>
				</div>
			)
		},
		{
			title: "3. Elevation (sudo)",
			instruction: "Bypass the restriction by invoking the SuperUser DO (sudo) capability. Read the shadow file again.",
			concept: "'sudo' executes a command with the security privileges of another user (by default, the superuser/root). It requires your password to authorize the elevation.",
			hint: "Prepend 'sudo' to your previous command.",
			cmd: "sudo cat /etc/shadow",
			validate: (cmd: string) => cmd.trim() === "sudo cat /etc/shadow",
			response: (
				<div className="text-text-muted">
					<div>root:$6$hJ...:19645:0:99999:7:::</div>
					<div>daemon:*:19645:0:99999:7:::</div>
					<div>bin:*:19645:0:99999:7:::</div>
					<div>operative:$6$K9...:19645:0:99999:7:::</div>
				</div>
			)
		},
		{
			title: "4. Checking Privileges (sudo -l)",
			instruction: "What exactly are you allowed to do? Enumerate your allowed sudo commands.",
			concept: "'sudo -l' (list) prints the commands the current user is allowed to execute. This is a critical enumeration step in Privilege Escalation attacks.",
			hint: "List the allowed commands for the current user.",
			cmd: "sudo -l",
			validate: (cmd: string) => cmd.trim() === "sudo -l",
			response: (
				<div className="text-text-muted">
					<div>Matching Defaults entries for operative on cypher-node:</div>
					<div>    env_reset, mail_badpass, secure_path=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin</div>
					<div className="mt-2 text-primary">User operative may run the following commands on cypher-node:</div>
					<div>    (ALL : ALL) ALL</div>
				</div>
			)
		},
		{
			title: "5. Interactive Root Shell",
			instruction: "Single commands are inefficient for extended tasks. Launch an interactive root shell environment.",
			concept: "'sudo -i' (login) simulates a full login as root, loading root's environment variables (like .bashrc) and changing to root's home directory.",
			hint: "Start an interactive login shell as root.",
			cmd: "sudo -i",
			validate: (cmd: string) => cmd.trim() === "sudo -i" || cmd.trim() === "sudo su -",
			response: (
				<div className="text-zinc-500">
					<span className="text-yellow-500">root@cypher-node</span>:~#
				</div>
			)
		},
		{
			title: "6. Root Verification",
			instruction: "Confirm you are now operating as the root user.",
			concept: "Notice the prompt changed from '$' to '#'. This is a visual indicator of root privileges in most shells. Always verify your effective ID.",
			hint: "Run 'whoami' again.",
			cmd: "whoami",
			validate: (cmd: string) => cmd.trim() === "whoami",
			response: (
				<div className="text-red-500 font-bold">
					root
				</div>
			)
		},
		{
			title: "7. System Maintenance",
			instruction: "As root, you have total control. Update the package repository verify functionality.",
			concept: "System-wide changes, like updating software sources, require root. Trying this as a normal user would return a lock file error.",
			hint: "Update the apt package index.",
			cmd: "apt update",
			validate: (cmd: string) => cmd.includes("apt update"),
			response: (
				<div className="text-text-muted">
					<div>Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease</div>
					<div>Get:2 http://security.ubuntu.com/ubuntu jammy-security InRelease [110 kB]</div>
					<div>Reading package lists... Done</div>
				</div>
			)
		},
		{
			title: "8. Creating Superusers",
			instruction: "Create a backdoor account named 'admin00' and add it to the sudo group.",
			concept: "Persistence is key. By creating a new user and granting them sudo rights, you ensure access even if the current account is compromised/locked.",
			hint: "Use 'useradd' to create the user, then 'usermod' to add them to the 'sudo' group.",
			cmd: "useradd -m admin00 && usermod -aG sudo admin00",
			validate: (cmd: string) => (cmd.includes("useradd") && cmd.includes("admin00")) || (cmd.includes("usermod") && cmd.includes("sudo")),
			response: (
				<div className="text-zinc-500">
					User 'admin00' created and added to group 'sudo'.
				</div>
			)
		},
		{
			title: "9. Dropping Privileges",
			instruction: "Mission complete. Exit the root shell to return to your unprivileged safety context.",
			concept: "Always drop privileges when they are no longer needed. Running as root unnecessarily increases the risk of accidental system damage.",
			hint: "Type 'exit' to leave the root session.",
			cmd: "exit",
			validate: (cmd: string) => cmd.trim() === "exit",
			response: (
				<div className="text-zinc-500">
					logout
					<br />
					<span className="text-green-500">operative@cypher-node</span>:~$
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
						completeModule("linux-sudo");
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

		if (cmd === "help") return "Commands: sudo, whoami, cat, apt, useradd, usermod, exit";

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
						<ShieldAlert size={20} />
						<h1 className="text-2xl font-bold">Privilege Escalation</h1>
					</div>
					<div className="h-1 w-full bg-border rounded-full overflow-hidden">
						<div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
					</div>
					<div className="text-xs text-text-muted mt-2">Step {step + 1} of {steps.length}</div>
				</div>
				{completed ? (
					<div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
						<CheckCircle2 size={32} className="text-primary mb-4" />
						<h3 className="text-xl font-bold text-primary mb-2">Root Access Achieved</h3>
						<p className="text-text-muted mb-4">You have successfully navigated the privilege hierarchy and executed commands as the superuser.</p>
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
						welcomeMessage="Connected to target: cypher-node (Low Privilege). Awaiting input."
						onCommand={handleCommand}
						className="h-[600px] border-border shadow-2xl"
					/>
				</div>
			</div>
		</div>
	);
}
