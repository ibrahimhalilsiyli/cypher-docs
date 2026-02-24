"use client";

import InteractiveTerminal from "@/components/training/InteractiveTerminal";
import { ArrowLeft, CheckCircle2, Network } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LinuxNetworkingLesson() {
	const [step, setStep] = useState(0);
	const [completed, setCompleted] = useState(false);

	const steps = [
		{
			title: "IP Address",
			instruction: "Identify your IP address. It's crucial for connection. Run: 'ip addr'",
			expected: "ip addr",
			validate: (cmd: string) => cmd.trim() === "ip addr" || cmd.trim() === "ifconfig",
			response: (
				<div className="text-text-muted">
					<div>1: lo: &lt;LOOPBACK,UP,LOWER_UP&gt; mtu 65536 qdisc noqueue state UNKNOWN</div>
					<div>    inet 127.0.0.1/8 scope host lo</div>
					<div>2: eth0: &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 1500 state UP</div>
					<div className="text-blue-400">    inet 192.168.1.50/24 brd 192.168.1.255 scope global eth0</div>
				</div>
			)
		},
		{
			title: "Connectivity Check (Ping)",
			instruction: "Verify you can reach the main server at 8.8.8.8. Run: 'ping -c 3 8.8.8.8'",
			expected: "ping -c 3 8.8.8.8",
			validate: (cmd: string) => cmd.includes("ping") && cmd.includes("8.8.8.8"),
			response: (
				<div className="text-text-muted">
					<div>PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.</div>
					<div>64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=13.4 ms</div>
					<div>64 bytes from 8.8.8.8: icmp_seq=2 ttl=118 time=12.2 ms</div>
					<div>64 bytes from 8.8.8.8: icmp_seq=3 ttl=118 time=14.1 ms</div>
					<div>--- 8.8.8.8 ping statistics ---</div>
					<div>3 packets transmitted, 3 received, 0% packet loss</div>
				</div>
			)
		},
		{
			title: "Listening Ports (Netstat)",
			instruction: "Check what ports are open on your machine. Run: 'netstat -tuln'",
			expected: "netstat -tuln",
			validate: (cmd: string) => cmd.trim() === "netstat -tuln" || cmd.trim() === "ss -tuln",
			response: (
				<div className="text-text-muted">
					<div>Proto Recv-Q Send-Q Local Address           Foreign Address         State</div>
					<div>tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN</div>
					<div>tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN</div>
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
						completeModule("linux-networking");
					});
				}
			}, 1000);

			return (
				<div>
					{currentTask.response}
					<div className="mt-2 text-green-400 font-mono text-xs animate-pulse">
						[✔] NETWORK ONLINE.
					</div>
				</div>
			);
		}

		if (cmd === "help") return "Commands: ip addr, ping [host], netstat -tuln";

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
						<Network size={20} />
						<h1 className="text-2xl font-bold">Networking Basics</h1>
					</div>
					<div className="h-1 w-full bg-border rounded-full overflow-hidden">
						<div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step) / steps.length) * 100}%` }} />
					</div>
				</div>
				{completed ? (
					<div className="bg-primary/10 border border-primary/20 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
						<CheckCircle2 size={32} className="text-primary mb-4" />
						<h3 className="text-xl font-bold text-primary mb-2">Connected</h3>
						<p className="text-text-muted mb-4">You have successfully configured and tested network connectivity.</p>
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
						welcomeMessage="Network Interface Controller Ready."
						onCommand={handleCommand}
						className="h-[600px] border-border shadow-2xl"
					/>
				</div>
			</div>
		</div>
	);
}
