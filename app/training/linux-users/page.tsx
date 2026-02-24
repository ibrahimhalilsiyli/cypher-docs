"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import { ArrowLeft, CheckCircle2, UserCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LinuxUserManagementLesson() {
	const [step, setStep] = useState(0);
	const [completed, setCompleted] = useState(false);

	const steps = [
		{
			title: "1. The Root User",
			instruction: "The 'root' user is the superuser with full control. Verify you are currently root: 'whoami'",
			concept: "Root (UID 0) can do anything: read any file, stop any service, or delete the entire OS. In production, we rarely log in as root directly; we use 'sudo' instead.",
			expected: "whoami",
			validate: (cmd: string) => cmd.trim() === "whoami",
			response: (
				<div className="text-red-500 font-bold">
					root
				</div>
			)
		},
		{
			title: "2. Adding a User (useradd)",
			instruction: "We need a new user account for a developer. Create a user named 'dev1': 'useradd dev1'",
			concept: "'useradd' is the low-level utility. 'adduser' is a friendlier script. When creating a user, we usually also create a home directory and a default group.",
			expected: "useradd dev1",
			validate: (cmd: string) => cmd.trim() === "useradd dev1" || cmd.includes("sudo useradd dev1"),
			response: (
				<div className="text-zinc-500">
					User 'dev1' created.
				</div>
			)
		},
		{
			title: "3. Setting Passwords (passwd)",
			instruction: "A user needs a password to log in. Set the password for 'dev1' to 'securepass': 'passwd dev1'",
			concept: "In Linux, passwords are hashed and stored in '/etc/shadow'. '/etc/passwd' is readable by everyone, but '/etc/shadow' is only readable by root.",
			expected: "passwd dev1",
			validate: (cmd: string) => cmd.includes("passwd") && cmd.includes("dev1"),
			response: (
				<div className="text-zinc-500">
					passwd: password updated successfully
				</div>
			)
		},
		{
			title: "4. Creating a Group (groupadd)",
			instruction: "Groups allow us to manage permissions for multiple users at once. Create a group called 'developers': 'groupadd developers'",
			concept: "Permissions can be assigned to Owner, Group, or Others. By adding users to a group, they all inherit the permissions assigned to that group.",
			expected: "groupadd developers",
			validate: (cmd: string) => cmd.trim() === "groupadd developers" || cmd.includes("sudo groupadd developers"),
			response: (
				<div className="text-zinc-500">
					Group 'developers' created.
				</div>
			)
		},
		{
			title: "5. Modifying User Groups (usermod)",
			instruction: "Add 'dev1' to the 'developers' group using the append flag (-aG). Run: 'usermod -aG developers dev1'",
			concept: "The '-a' (append) flag is crucial. Without it, 'usermod -G' would remove the user from all other groups! Always use '-aG' to add a supplementary group.",
			expected: "usermod -aG developers dev1",
			validate: (cmd: string) => cmd.includes("usermod") && cmd.includes("dev1") && cmd.includes("developers"),
			response: (
				<div className="text-zinc-500">
					User 'dev1' added to group 'developers'.
				</div>
			)
		},
		{
			title: "6. User Information (id)",
			instruction: "Verify the user exists and check their groups using 'id'. Run: 'id dev1'",
			concept: "'id' shows the User ID (uid), Group ID (gid), and all supplementary groups. Useful for debugging permission issues.",
			expected: "id dev1",
			validate: (cmd: string) => cmd.trim() === "id dev1",
			response: (
				<div className="text-text-muted">
					uid=1003(dev1) gid=1003(dev1) groups=1003(dev1),1004(developers)
				</div>
			)
		},
		{
			title: "7. Viewing All Users",
			instruction: "Users are defined in '/etc/passwd'. View the last 3 users added: 'tail -n 3 /etc/passwd'",
			concept: "Each line represents: username:x:uid:gid:comment:home:shell. The 'x' means the password is in /etc/shadow.",
			expected: "tail -n 3 /etc/passwd",
			validate: (cmd: string) => cmd.includes("tail") && cmd.includes("/etc/passwd"),
			response: (
				<div className="text-text-muted">
					<div>operative:x:1000:1000:,,,:/home/operative:/bin/bash</div>
					<div>sshd:x:1001:1001::/run/sshd:/usr/sbin/nologin</div>
					<div>dev1:x:1003:1003::/home/dev1:/bin/sh</div>
				</div>
			)
		},
		{
			title: "8. Switching Users (su)",
			instruction: "Become the new user to test access (simulated). Run: 'su - dev1'",
			concept: "'su' stands for Substitute User. 'su -' (with hyphen) simulates a full login, loading the user's environment variables and profile.",
			expected: "su - dev1",
			validate: (cmd: string) => cmd.trim() === "su - dev1",
			response: (
				<div className="text-zinc-500">
					Switched to user 'dev1'.
				</div>
			)
		},
		{
			title: "9. Deleting Users (userdel)",
			instruction: "The developer left the company. Delete the user 'dev1' and their home directory (-r): 'userdel -r dev1'",
			concept: "Removing a user implies revoking access. The '-r' flag ensures their home directory and mail spool are also deleted to save space.",
			expected: "userdel -r dev1",
			validate: (cmd: string) => cmd.trim() === "userdel -r dev1",
			response: (
				<div className="text-zinc-500">
					User 'dev1' and /home/dev1 removed.
				</div>
			)
		},
		{
			title: "10. Deleting Groups (groupdel)",
			instruction: "Clean up by deleting the 'developers' group: 'groupdel developers'",
			concept: "Groups can only be deleted if they are not the primary group of any remaining user.",
			expected: "groupdel developers",
			validate: (cmd: string) => cmd.trim() === "groupdel developers",
			response: (
				<div className="text-zinc-500">
					Group 'developers' removed.
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
						completeModule("linux-users");
					});
				}
			}, 1000);

			return (
				<div>
					{currentTask.response}
					<div className="mt-2 text-green-400 font-mono text-xs animate-pulse">
						[✔] ACCESS CONTROL UPDATED.
					</div>
				</div>
			);
		}

		if (cmd === "help") return "Commands: useradd, passwd, groupadd, usermod, id, tail, su, userdel, groupdel";

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
						<UserCheck size={20} />
						<h1 className="text-2xl font-bold">User Management</h1>
					</div>
					<div className="h-1 w-full bg-border rounded-full overflow-hidden">
						<div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
					</div>
					<div className="text-xs text-text-muted mt-2">Step {step + 1} of {steps.length}</div>
				</div>
				{completed ? (
					<div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
						<CheckCircle2 size={32} className="text-primary mb-4" />
						<h3 className="text-xl font-bold text-primary mb-2">Team Expanded</h3>
						<p className="text-text-muted mb-4">You have successfully added users and assigned groups.</p>
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
									<UserCheck size={12} /> Concept
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
						welcomeMessage="Admin Console. Root privileges active."
						onCommand={handleCommand}
						className="h-[600px] border-border shadow-2xl"
					/>
				</div>
			</div>
		</div>
	);
}
