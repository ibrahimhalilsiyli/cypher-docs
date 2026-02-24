import { Trophy, Target, Zap, Shield, Crown, Code, Bug, Eye, Lock, Terminal, Award, Fingerprint, Globe, Wifi, CheckCircle, Cpu, Database, FileText, Repeat, ShieldAlert, Key, Flame, Network, Radio, FileSearch, Bomb, UserX, Code2, UserCheck, Activity, Clock } from "lucide-react";

export type Rank = "Script Kiddie" | "Neophyte" | "Apprentice" | "Operative" | "Specialist" | "Elite" | "Architect" | "Grandmaster";

export type ModuleCategory = "Linux Systems" | "Web Security" | "Network Defense" | "System Exploitation";

export const RANKS: { name: Rank; minXP: number; icon: any; color: string }[] = [
	{ name: "Script Kiddie", minXP: 0, icon: Bug, color: "text-zinc-500" },
	{ name: "Neophyte", minXP: 200, icon: Target, color: "text-green-500" },      // ~2 Modules
	{ name: "Apprentice", minXP: 800, icon: Code, color: "text-blue-500" },       // ~3-4 Modules
	{ name: "Operative", minXP: 1800, icon: Terminal, color: "text-cyan-500" },   // ~6-8 Modules
	{ name: "Specialist", minXP: 3200, icon: Zap, color: "text-purple-500" },     // ~10-12 Modules
	{ name: "Elite", minXP: 5000, icon: Shield, color: "text-red-500" },          // ~15-18 Modules
	{ name: "Architect", minXP: 7500, icon: Eye, color: "text-orange-500" },      // Completionist + Bonuses
	{ name: "Grandmaster", minXP: 10000, icon: Crown, color: "text-yellow-500" }, // Long-term Mastery
];

export const BADGES = [
	// Milestones (XP Based)
	{ id: "new_recruit", name: "New Recruit", desc: "Earn your first 100 XP.", xpReq: 100, icon: Fingerprint, color: "text-zinc-400" },
	{ id: "dedicated", name: "Dedicated", desc: "Reach 500 Total XP.", xpReq: 500, icon: Award, color: "text-green-400" },
	{ id: "expert", name: "Subject Matter Expert", desc: "Reach 2,500 Total XP.", xpReq: 2500, icon: Shield, color: "text-blue-400" },
	{ id: "legend", name: "Living Legend", desc: "Reach 6,000 Total XP.", xpReq: 6000, icon: Crown, color: "text-yellow-400" },

	// Skill Badges (Simulated Check based on XP for now)
	{ id: "linux_master", name: "Penguin Tamer", desc: "Complete Linux Basics & Advanced.", xpReq: 400, icon: Terminal, color: "text-cyan-400" },
	{ id: "web_hacker", name: "Web Weaver", desc: "Master XSS, SQLi, and CSRF.", xpReq: 1000, icon: Globe, color: "text-purple-400" },
	{ id: "net_ninja", name: "Network Ninja", desc: "Complete Nmap & Wireshark.", xpReq: 1500, icon: Wifi, color: "text-red-400" },

	// Special
	{ id: "cryptographer", name: "Code Breaker", desc: "Master Crypto & Stego.", xpReq: 1200, icon: Lock, color: "text-indigo-400" },
	{ id: "bug_hunter", name: "Bug Hunter", desc: "Identify 5 critical vulns.", xpReq: 2000, icon: Bug, color: "text-green-500" },
	{ id: "red_team", name: "Red Teamer", desc: "Complete Metasploit path.", xpReq: 3500, icon: Target, color: "text-red-600" },
	{ id: "blue_team", name: "Blue Teamer", desc: "Master Forensics.", xpReq: 3500, icon: Eye, color: "text-blue-600" },
];

export function getRank(xp: number) {
	return RANKS.slice().reverse().find(rank => xp >= rank.minXP) || RANKS[0];
}

export function getNextRank(xp: number) {
	const currentRankIndex = RANKS.findIndex(r => r.name === getRank(xp).name);
	return RANKS[currentRankIndex + 1] || null;
}

export function getProgressToNextRank(xp: number) {
	const current = getRank(xp);
	const next = getNextRank(xp);
	if (!next) return 100;

	const range = next.minXP - current.minXP;
	const progress = xp - current.minXP;
	return Math.min(100, Math.max(0, (progress / range) * 100));
}

export const TRAINING_MODULES = [
	{
		id: "linux-101",
		title: "Linux Basics",
		description: "Master the command line interface. Learn file navigation, permissions, and essential commands.",
		icon: Terminal,
		difficulty: "Beginner",
		status: "Available",
		href: "/training/linux-101",
		xp: 100,
		category: "Linux Systems"
	},
	// --- BATCH 2: WEB SECURITY ---
	{
		id: "xss-reflected",
		title: "XSS (Reflected)",
		description: "Inject malicious scripts into web applications to execute code in victim browsers.",
		icon: Globe,
		difficulty: "Beginner",
		status: "Available",
		href: "/training/xss",
		xp: 150,
		category: "Web Security"
	},
	{
		id: "command-injection",
		title: "Command Injection",
		description: "Exploit vulnerable inputs to execute arbitrary operating system commands.",
		icon: Terminal,
		difficulty: "Advanced",
		status: "Available",
		href: "/training/command-injection",
		xp: 500,
		category: "Web Security"
	},
	{
		id: "lfi",
		title: "Local File Inclusion",
		description: "Trick applications into exposing internal files like /etc/passwd.",
		icon: FileText,
		difficulty: "Intermediate",
		status: "Available",
		href: "/training/lfi",
		xp: 250,
		category: "Web Security"
	},
	{
		id: "csrf",
		title: "CSRF",
		description: "Force authenticated users to perform unwanted actions without their knowledge.",
		icon: Repeat,
		difficulty: "Intermediate",
		status: "Available",
		href: "/training/csrf",
		xp: 250,
		category: "Web Security"
	},
	// --- BATCH 3: SYSTEM & CRYPTO ---
	{
		id: "hashcat",
		title: "Password Cracking",
		description: "Recover plaintext passwords from MD5/SHA hashes using Hashcat and wordlists.",
		icon: Lock,
		difficulty: "Intermediate",
		status: "Available",
		href: "/training/hashcat",
		xp: 300,
		category: "System Exploitation"
	},
	{
		id: "suid",
		title: "Privilege Escalation",
		description: "Exploit misconfigured SUID binaries (like Vim) to gain root shell access.",
		icon: ShieldAlert,
		difficulty: "Advanced",
		status: "Available",
		href: "/training/suid",
		xp: 500,
		category: "System Exploitation"
	},
	{
		id: "crypto",
		title: "Cryptography 101",
		description: "Decode Base64 and Rot13 to reveal secret keys and messages.",
		icon: Key,
		difficulty: "Beginner",
		status: "Available",
		href: "/training/crypto",
		xp: 150,
		category: "System Exploitation"
	},
	{
		id: "stego",
		title: "Steganography",
		description: "Extract hidden data from images using strings and Steghide.",
		icon: Eye,
		difficulty: "Intermediate",
		status: "Available",
		href: "/training/steganography",
		xp: 200,
		category: "System Exploitation"
	},
	// --- BATCH 4: ADVANCED TOOLS ---
	{
		id: "metasploit",
		title: "Metasploit Intro",
		description: "Weaponize exploits and manage payloads using the msfconsole framework.",
		icon: Flame,
		difficulty: "Advanced",
		status: "Available",
		href: "/training/metasploit",
		xp: 500,
		category: "System Exploitation"
	},
	{
		id: "burpsuite",
		title: "Burp Suite Proxy",
		description: "Intercept, inspect, and modify web traffic between browser and server.",
		icon: Bug,
		difficulty: "Intermediate",
		status: "Available",
		href: "/training/burpsuite",
		xp: 350,
		category: "Web Security"
	},
	{
		id: "wireshark",
		title: "Wireshark Analysis",
		description: "Inspect network packets (PCAP) to find unencrypted credentials.",
		icon: Network,
		difficulty: "Intermediate",
		status: "Available",
		href: "/training/wireshark",
		xp: 300,
		category: "Network Defense"
	},
	{
		id: "netcat",
		title: "Netcat Mastery",
		description: "Master the 'Swiss Army Knife' of networking. Listeners and reverse shells.",
		icon: Radio,
		difficulty: "Beginner",
		status: "Available",
		href: "/training/netcat",
		xp: 150,
		category: "Network Defense"
	},
	// --- BATCH 5: DEFENSE & FORENSICS ---
	{
		id: "log-analysis",
		title: "Log Analysis",
		description: "Hunt for threat indicators in server logs using grep and awk.",
		icon: FileSearch,
		difficulty: "Intermediate",
		status: "Available",
		href: "/training/log-analysis",
		xp: 300,
		category: "Network Defense"
	},
	{
		id: "malware-analysis",
		title: "Malware Analysis",
		description: "Perform static analysis on suspicious binaries (strings, hashes).",
		icon: Bomb,
		difficulty: "Advanced",
		status: "Available",
		href: "/training/malware-analysis",
		xp: 600,
		category: "System Exploitation"
	},
	{
		id: "social-engineering",
		title: "Social Engineering",
		description: "Identify phishing emails and malicious links (Typosquatting).",
		icon: UserX,
		difficulty: "Beginner",
		status: "Available",
		href: "/training/social-engineering",
		xp: 100,
		category: "Network Defense"
	},
	{
		id: "secure-coding",
		title: "Secure Coding",
		description: "Identify and patch code vulnerabilities like SQLi.",
		icon: Code2,
		difficulty: "Advanced",
		status: "Available",
		href: "/training/secure-coding",
		xp: 600,
		category: "Web Security"
	},
	{
		id: "iam",
		title: "IAM & AD Basics",
		description: "Enforce 'Least Privilege' by auditing user groups and permissions.",
		icon: UserCheck,
		difficulty: "Beginner",
		status: "Available",
		href: "/training/iam",
		xp: 150,
		category: "Network Defense"
	},
	// -------------------------
	{
		id: "sql-injection",
		title: "SQL Injection",
		description: "Understand database vulnerabilities. Learn how to identify and exploit SQLi flaws.",
		icon: Database,
		difficulty: "Intermediate",
		status: "Available",
		href: "/training/sql-injection",
		xp: 350,
		category: "Web Security"
	},
	// --- BATCH 6: LINUX SYSADMIN TRACK ---
	{
		id: "linux-distros",
		title: "Linux Distros & Open Source",
		description: "Understand the Linux kernel, distributions (Debian, RHEL, Arch), and the open-source philosophy.",
		icon: Globe,
		difficulty: "Beginner",
		status: "Available",
		href: "/training/linux-distros",
		xp: 100,
		category: "Linux Systems"
	},
	{
		id: "linux-filesystem",
		title: "Filesystem Hierarchy",
		description: "Explore the Linux directory structure: /etc, /bin, /home, /var, and /proc.",
		icon: Database,
		difficulty: "Beginner",
		status: "Available",
		href: "/training/linux-filesystem",
		xp: 150,
		category: "Linux Systems"
	},
	{
		id: "linux-file-ops",
		title: "File Operations",
		description: "Master file manipulation: touch, cp, mv, rm, and cat.",
		icon: FileText,
		difficulty: "Beginner",
		status: "Available",
		href: "/training/linux-file-ops",
		xp: 150,
		category: "Linux Systems"
	},
	{
		id: "linux-users",
		title: "User Management",
		description: "Manage users and groups: useradd, groupadd, and /etc/passwd.",
		icon: UserCheck,
		difficulty: "Intermediate",
		status: "Available",
		href: "/training/linux-users",
		xp: 200,
		category: "Linux Systems"
	},
	{
		id: "linux-permissions",
		title: "Permissions & Ownership",
		description: "Secure files with chmod and chown. Understand rwx bits.",
		icon: Lock,
		difficulty: "Intermediate",
		status: "Available",
		href: "/training/linux-permissions",
		xp: 250,
		category: "Linux Systems"
	},
	{
		id: "linux-sudo",
		title: "Sudo & Root",
		description: "Execute commands with elevated privileges safely using sudo.",
		icon: ShieldAlert,
		difficulty: "Intermediate",
		status: "Available",
		href: "/training/linux-sudo",
		xp: 200,
		category: "Linux Systems"
	},
	{
		id: "linux-packages",
		title: "Package Management",
		description: "Install and update software using apt, yum, and pacman.",
		icon: Database,
		difficulty: "Intermediate",
		status: "Available",
		href: "/training/linux-packages",
		xp: 200,
		category: "Linux Systems"
	},
	{
		id: "linux-editors",
		title: "Text Editors",
		description: "Edit configuration files directly in the terminal using Nano and Vim.",
		icon: Code,
		difficulty: "Intermediate",
		status: "Available",
		href: "/training/linux-editors",
		xp: 150,
		category: "Linux Systems"
	},
	{
		id: "linux-io",
		title: "I/O Redirection",
		description: "Control data flow with pipes (|), >, and >> operators.",
		icon: Repeat,
		difficulty: "Intermediate",
		status: "Available",
		href: "/training/linux-io",
		xp: 250,
		category: "Linux Systems"
	},
	{
		id: "linux-processes",
		title: "Process Management",
		description: "Monitor and control system processes with top, ps, and kill.",
		icon: Activity,
		difficulty: "Intermediate",
		status: "Available",
		href: "/training/linux-processes",
		xp: 250,
		category: "Linux Systems"
	},
	{
		id: "linux-disk",
		title: "Disk Management",
		description: "Analyze disk usage and mount filesystems with df, du, and mount.",
		icon: Database,
		difficulty: "Advanced",
		status: "Available",
		href: "/training/linux-disk",
		xp: 300,
		category: "Linux Systems"
	},
	{
		id: "linux-networking",
		title: "Networking Basics",
		description: "Configure network interfaces and troubleshoot connectivity with ip, ping, and nc.",
		icon: Network,
		difficulty: "Advanced",
		status: "Available",
		href: "/training/linux-networking",
		xp: 300,
		category: "Linux Systems"
	},
	{
		id: "linux-scripting",
		title: "Shell Scripting Intro",
		description: "Automate tasks by writing your first Bash shell scripts.",
		icon: Terminal,
		difficulty: "Advanced",
		status: "Available",
		href: "/training/linux-scripting",
		xp: 350,
		category: "Linux Systems"
	},
	{
		id: "linux-variables",
		title: "Variables & Loops",
		description: "Use variables, loops, and logic in your Bash scripts.",
		icon: Code2,
		difficulty: "Advanced",
		status: "Available",
		href: "/training/linux-variables",
		xp: 400,
		category: "Linux Systems"
	},
	{
		id: "linux-cron",
		title: "Cron & Scheduling",
		description: "Schedule automated tasks to run at specific times using crontab.",
		icon: Clock,
		difficulty: "Advanced",
		status: "Available",
		href: "/training/linux-cron",
		xp: 300,
		category: "Linux Systems"
	},
	{
		id: "linux-services",
		title: "Systemd Services",
		description: "Manage system daemons and services using systemctl.",
		icon: Cpu,
		difficulty: "Advanced",
		status: "Available",
		href: "/training/linux-services",
		xp: 350,
		category: "Linux Systems"
	},
	{
		id: "linux-firewall",
		title: "Firewalls (UFW/IPTables)",
		description: "Secure your server by configuring firewall rules to block traffic.",
		icon: Shield,
		difficulty: "Advanced",
		status: "Available",
		href: "/training/linux-firewall",
		xp: 400,
		category: "Linux Systems"
	},
	{
		id: "network-recon",
		title: "Network Reconnaissance",
		description: "Map the attack surface. Use Nmap and other tools to discover active hosts and services.",
		icon: Cpu,
		difficulty: "Advanced",
		status: "Available",
		href: "/training/network-recon",
		xp: 400,
		category: "Network Defense"
	}
];

export const MODULE_XP = Object.fromEntries(TRAINING_MODULES.map(m => [m.id, { difficulty: m.difficulty, xp: m.xp }]));


export interface ActivityLog {
	id: string;
	action: string;
	target: string;
	timestamp: number;
	xp: number;
}

export function logActivity(userId: string, action: string, target: string, xp: number = 0) {
	if (typeof window === "undefined") return;

	const key = `cypher_activity_${userId}`;
	const logs: ActivityLog[] = JSON.parse(localStorage.getItem(key) || "[]");

	const newLog: ActivityLog = {
		id: Date.now().toString(),
		action,
		target,
		timestamp: Date.now(),
		xp
	};

	// Keep last 50 logs
	const updatedLogs = [newLog, ...logs].slice(0, 50);
	localStorage.setItem(key, JSON.stringify(updatedLogs));
}

export function completeModule(moduleId: string) {
	if (typeof window === "undefined") return; // Server-side guard

	const userId = localStorage.getItem("cypher_auth");
	if (!userId) return;

	const completedKey = `cypher_completed_modules_${userId}`;
	const xpKey = `cypher_xp_${userId}`;

	// Get current state
	const completedModules: string[] = JSON.parse(localStorage.getItem(completedKey) || "[]");
	let currentXP = parseInt(localStorage.getItem(xpKey) || "0");

	// Check if already completed
	if (completedModules.includes(moduleId)) {
		return { success: false, message: "Module already completed." };
	}

	// Find module XP
	const module = TRAINING_MODULES.find(m => m.id === moduleId);
	if (!module) return { success: false, message: "Module not found." };

	// Update state
	completedModules.push(moduleId);
	currentXP += module.xp;

	// Save to storage
	localStorage.setItem(completedKey, JSON.stringify(completedModules));
	localStorage.setItem(xpKey, currentXP.toString());

	// Log Activity
	logActivity(userId, "Completed Module", module.title, module.xp);

	return { success: true, xpEarned: module.xp, newTotalXP: currentXP };
}

