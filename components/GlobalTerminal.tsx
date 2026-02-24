"use client";

import React, { useState, useEffect, useRef } from "react";
import { Terminal as LucideTerminal, X, Minimize2, Maximize2 } from "lucide-react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";

// Import Terminal CSS explicitly
import "jquery.terminal/css/jquery.terminal.css";

// --- Types & File System ---
interface FileSystemNode {
    type: "file" | "dir";
    content?: string;
    children?: { [name: string]: FileSystemNode };
}

// Initial Simulated File System
const INITIAL_FS: FileSystemNode = {
    type: "dir",
    children: {
        home: {
            type: "dir",
            children: {
                kali: {
                    type: "dir",
                    children: {
                        "Desktop": { type: "dir", children: {} },
                        "Documents": {
                            type: "dir",
                            children: {
                                "secret.txt": { type: "file", content: "TOP SECRET: Anti Gravity Source Code Location..." },
                                "todo.list": { type: "file", content: "1. Hack the planet\n2. Drink coffee\n3. Sleep" }
                            }
                        },
                        "Downloads": { type: "dir", children: {} },
                        "tools": { type: "dir", children: { "exploit.py": { type: "file", content: "print('Exploiting target...')" } } }
                    }
                }
            }
        },
        etc: { type: "dir", children: { "passwd": { type: "file", content: "root:x:0:0:root:/root:/bin/bash\nkali:x:1000:1000:Kali Linux:/home/kali:/bin/zsh" }, "os-release": { type: "file", content: "PRETTY_NAME=\"Kali GNU/Linux Rolling\"\nNAME=\"Kali GNU/Linux\"\nID=kali" } } },
        bin: { type: "dir", children: {} },
        var: { type: "dir", children: { "log": { type: "dir", children: { "syslog": { type: "file", content: "Feb 16 02:00:01 kali systemd[1]: Started Session 1 of user kali." } } } } }
    }
};

export default function GlobalTerminal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const terminalRef = useRef<HTMLDivElement>(null);
    const termInstance = useRef<any>(null);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    const dragControls = useDragControls();

    // State for File System persistence
    const fsRef = useRef(JSON.parse(JSON.stringify(INITIAL_FS)));
    const cwdRef = useRef<string[]>(["home", "kali"]);

    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener("resize", handleResize);

        const handleOpen = () => setIsOpen(true);
        window.addEventListener("open-global-terminal", handleOpen);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("open-global-terminal", handleOpen);
        };
    }, []);

    // Helper: Get current directory node
    const getCurrentDir = () => {
        let current = fsRef.current;
        for (const segment of cwdRef.current) {
            if (current.children && current.children[segment]) {
                current = current.children[segment];
            } else {
                return null;
            }
        }
        return current;
    };

    // Helper: Format CWD for prompt
    const formatCwd = () => {
        const path = cwdRef.current.join("/");
        if (path.startsWith("home/kali")) return "~" + path.substring(9);
        return "/" + path;
    };

    useEffect(() => {
        if (!isOpen || !terminalRef.current) return;

        let $;

        const initTerminal = async () => {
            try {
                // Dynamic imports with global assignment for the plugin
                // We use a try-catch block to handle loading errors
                const jqueryModule = await import("jquery");
                $ = jqueryModule.default;

                // Polyfill window.jQuery for the plugin
                // @ts-ignore
                if (typeof window !== 'undefined') {
                    // @ts-ignore
                    window.jQuery = window.$ = $;
                }

                // Wait a tick for window assignment to stick
                await new Promise(r => setTimeout(r, 10));

                await import("jquery.terminal");

                if (termInstance.current) return;

                // --- COMMAND INTERPRETER ---
                const interpreter = function (command: string, term: any) {
                    if (command === '') return;

                    const args = command.trim().split(/\s+/);
                    const cmd = args[0];
                    const cleanArgs = args.slice(1);

                    // --- COMMAND LOGIC ---
                    switch (cmd) {
                        // --- FILE SYSTEM ---
                        case 'ls': {
                            const dir = getCurrentDir();
                            if (dir && dir.children) {
                                const items = Object.entries(dir.children).map(([name, node]: [string, any]) => {
                                    return node.type === 'dir' ? `[[b;blue;]${name}]` : name;
                                }).join('  ');
                                term.echo(items);
                            }
                            break;
                        }
                        case 'pwd':
                            term.echo("/" + cwdRef.current.join("/"));
                            break;
                        case 'cd': {
                            const target = cleanArgs[0];
                            if (!target || target === '~') {
                                cwdRef.current = ["home", "kali"];
                            } else if (target === '..') {
                                if (cwdRef.current.length > 0) cwdRef.current.pop();
                            } else if (target === '/') {
                                cwdRef.current = [];
                            } else {
                                const dir = getCurrentDir();
                                if (dir && dir.children && dir.children[target] && dir.children[target].type === 'dir') {
                                    cwdRef.current.push(target);
                                } else {
                                    term.echo(`[[b;red;]bash: cd: ${target}: No such directory]`);
                                }
                            }
                            term.set_prompt(`[[b;red;]root@kali][[b;white;]:${formatCwd()}# ]`);
                            break;
                        }
                        case 'cat':
                        case 'less':
                        case 'more':
                        case 'head':
                        case 'tail': {
                            const target = cleanArgs[0];
                            const dir = getCurrentDir();
                            if (dir && dir.children && dir.children[target] && dir.children[target].type === 'file') {
                                term.echo(dir.children[target].content);
                            } else {
                                term.echo(`[[b;red;]${cmd}: ${target}: No such file]`);
                            }
                            break;
                        }
                        case 'mkdir': {
                            const target = cleanArgs[0];
                            const dir = getCurrentDir();
                            if (dir && target) {
                                dir.children = dir.children || {};
                                dir.children[target] = { type: 'dir', children: {} };
                            }
                            break;
                        }
                        case 'touch': {
                            const target = cleanArgs[0];
                            const dir = getCurrentDir();
                            if (dir && target) {
                                dir.children = dir.children || {};
                                dir.children[target] = { type: 'file', content: "" };
                            }
                            break;
                        }
                        case 'rm':
                        case 'rmdir': {
                            const target = cleanArgs[0];
                            const dir = getCurrentDir();
                            if (dir && dir.children && dir.children[target]) {
                                delete dir.children[target];
                            } else {
                                term.echo(`[[b;red;]rm: cannot remove '${target}': No such file or directory]`);
                            }
                            break;
                        }
                        case 'cp':
                        case 'mv':
                            term.echo("File operation simulated.");
                            break;

                        // --- SYSTEM ---
                        case 'uname':
                            if (cleanArgs[0] === '-a') term.echo("Linux kali 6.8.0-kali1-amd64 #1 SMP PREEMPT_DYNAMIC Kali 6.8.11-1kali2 x86_64 GNU/Linux");
                            else term.echo("Linux");
                            break;
                        case 'hostname': term.echo("kali"); break;
                        case 'whoami': term.echo("root"); break;
                        case 'id': term.echo("uid=0(root) gid=0(root) groups=0(root)"); break;
                        case 'date': term.echo(new Date().toString()); break;
                        case 'cal': term.echo("    February 2026\nSu Mo Tu We Th Fr Sa\n 1  2  3  4  5  6  7\n 8  9 10 11 12 13 14\n15 16 17 18 19 20 21\n22 23 24 25 26 27 28"); break;
                        case 'uptime': term.echo(" 02:30:00 up 13 days, 4:20,  1 user,  load average: 0.00, 0.01, 0.05"); break;
                        case 'free': term.echo("               total        used        free      shared  buff/cache   available\nMem:           16Gi       2.4Gi        11Gi       120Mi       2.4Gi        13Gi"); break;
                        case 'df': term.echo("Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        80G   14G   62G  18% /"); break;
                        case 'ps': term.echo("    PID TTY          TIME CMD\n   1337 pts/0    00:00:00 zsh\n   1338 pts/0    00:00:00 ps"); break;
                        case 'top':
                        case 'htop':
                            term.echo("top - 02:30:00 up 13 days, 1 user, load average: 0.05, 0.03, 0.01\nTasks: 221 total, 1 running, 220 sleeping\n%Cpu(s): 0.3 us, 0.1 sy, 0.0 ni, 99.6 id\n\n  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\n 1337 root      20   0   14.2g  2.4g   1.2g S   0.3  15.2   0:15.32 chrome");
                            break;
                        case 'clear': term.clear(); break;
                        case 'history': term.history().data().forEach((h: string, i: number) => term.echo(` ${i + 1}  ${h}`)); break;
                        case 'exit': setIsOpen(false); break;
                        case 'reboot':
                        case 'shutdown': term.echo("System requires physical reset."); break;

                        // --- NETWORK ---
                        case 'ip':
                        case 'ifconfig': term.echo("eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n        inet 192.168.1.137  netmask 255.255.255.0  broadcast 192.168.1.255"); break;
                        case 'ping':
                            if (!cleanArgs[0]) { term.echo("Usage: ping <host>"); break; }
                            term.echo(`PING ${cleanArgs[0]} (${cleanArgs[0]}) 56(84) bytes of data.`);
                            [1, 2, 3, 4].forEach(i => setTimeout(() => term.echo(`64 bytes from ${cleanArgs[0]}: icmp_seq=${i} ttl=64 time=${Math.random() * 20}ms`), i * 500));
                            break;
                        case 'curl':
                        case 'wget':
                            term.echo(`--2026-02-16 02:30--  ${cleanArgs[0] || 'http://example.com'}\nResolving... connected.\nHTTP request sent, awaiting response... 200 OK\nLength: 1256 (1.2K) [text/html]\nSaving to: 'index.html'`);
                            break;
                        case 'nmap':
                            term.echo(`Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for ${cleanArgs[0] || 'localhost'}\nHost is up (0.00013s latency).\nNot shown: 998 closed tcp ports (reset)\nPORT   STATE SERVICE\n22/tcp open  ssh\n80/tcp open  http\nNmap done: 1 IP address (1 host up) scanned in 0.05 seconds`);
                            break;
                        case 'ssh': term.echo(`root@${cleanArgs[0] || 'localhost'}'s password: `); break;

                        // --- PACKAGES ---
                        case 'apt':
                        case 'apt-get':
                            if (cleanArgs[0] === 'update') term.echo("Hit:1 http://kali.download/kali kali-rolling InRelease\nReading package lists... Done");
                            else if (cleanArgs[0] === 'upgrade') term.echo("Reading package lists... Done\nBuilding dependency tree... Done\n0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.");
                            else if (cleanArgs[0] === 'install') term.echo(`Reading package lists... Done\nBuilding dependency tree... Done\nThe following NEW packages will be installed:\n  ${cleanArgs[1] || 'package'}\n0 upgraded, 1 newly installed, 0 to remove.\nSetting up ${cleanArgs[1] || 'package'}... Done.`);
                            else term.echo("apt 2.7.14 (amd64)");
                            break;
                        case 'pip3':
                        case 'npm':
                            term.echo("Package installed successfully (simulated).");
                            break;
                        case 'git':
                            if (cleanArgs[0] === 'status') term.echo("On branch main\nYour branch is up to date with 'origin/main'.\n\nnothing to commit, working tree clean");
                            else if (cleanArgs[0] === 'clone') term.echo(`Cloning into '${cleanArgs[1] || 'repo'}'...\nremote: Enumerating objects: 100, done.\nremote: Total 100 (delta 20), reused 50 (delta 10)\nReceiving objects: 100% (100/100), done.`);
                            else term.echo("usage: git <command>");
                            break;

                        // --- EDITORS ---
                        case 'nano':
                        case 'vim':
                        case 'vi':
                            term.echo(`[[b;yellow;]${cmd} is strictly simulated. Use 'cat' to view contents or 'echo "txt" > file' to write.]`);
                            break;

                        // --- FUN / MISC ---
                        case 'neofetch':
                            term.echo(`
           [[b;blue;]_,met$$$$$gg.]
        [[b;blue;],g$$$$$$$$$$$$$$$P.]       [[b;red;]root][[b;white;]@] [[b;red;]kali]
      [[b;blue;],g$$P""       """Y$$$.]     ----------------
     [[b;blue;],$$P'              \`$$$.]    [[b;red;]OS]: Kali GNU/Linux Rolling
    [[b;blue;]',$$P       ,ggs.     \`$$b:]   [[b;red;]Host]: KVM/QEMU
    [[b;blue;]\`d$$'     ,$P"'   .    $$$]    [[b;red;]Kernel]: 6.8.0-kali1
     [[b;blue;]$$P      d$'     ,    $$P]    [[b;red;]Uptime]: 14 days
     [[b;blue;]$$:      $$.   -    ,d$$']    [[b;red;]Packages]: 2351 (dpkg)
     [[b;blue;]$$;      Y$b._   _,d$P']    [[b;red;]Shell]: zsh 5.9
     [[b;blue;]Y$$.    \`.\`"Y$$$$P"']      [[b;red;]Terminal]: jquery.terminal
     [[b;blue;]\`$$b      "-.__]
      [[b;blue;]\`Y$$$]
                            `);
                            break;

                        case 'python3': term.echo("Python 3.11.8 (main, Feb  7 2024, 21:52:08) [GCC 13.2.0] on linux\nType \"help\", \"copyright\", \"credits\" or \"license\" for more information.\n>>> quit()\n"); break;
                        case 'node': term.echo("Welcome to Node.js v20.11.1.\nType \".help\" for more information.\n> .exit"); break;

                        case 'sudo':
                            if (cleanArgs[0] === 'su') term.echo("Already root.");
                            else if (cleanArgs.length > 0) interpreter(cleanArgs.join(' '), term);
                            else term.echo("usage: sudo <command>");
                            break;

                        case 'help':
                            term.echo("\n[[b;white;]Supported Commands (Simulated):]");
                            term.echo("  File:    ls, cd, pwd, cat, touch, mkdir, rm, cp, mv, nano");
                            term.echo("  System:  uname, hostname, whoami, id, date, uptime, free, df, ps, top");
                            term.echo("  Network: ip, ifconfig, ping, nmap, curl, wget, ssh, netstat");
                            term.echo("  Pkg:     apt, apt-get, pip3, npm, git");
                            term.echo("  Misc:    neofetch, clear, history, exit, sudo\n");
                            break;

                        default:
                            term.echo(`[[b;red;]bash: ${cmd}: command not found]`);
                    }
                };

                // --- INIT INSTANCE ---
                // @ts-ignore
                if (terminalRef.current && $) {
                    // @ts-ignore
                    termInstance.current = $(terminalRef.current).terminal(interpreter, {
                        greetings: `[[b;blue;]Kali GNU/Linux Rolling 2026.1 - Anti Gravity OS]
Warning: You are accessing a government restricted system.
Type [[b;green;]help] for a list of commands.
`,
                        name: 'kali_term',
                        height: '100%',
                        prompt: `[[b;red;]root@kali][[b;white;]:${formatCwd()}# ]`,
                        onInit: function (term: any) {
                            term.focus();
                        },
                        completion: function (string: string, callback: any) {
                            const commands = ['ls', 'cd', 'pwd', 'cat', 'help', 'clear', 'exit', 'neofetch', 'whoami', 'reboot', 'shutdown', 'nano', 'vim', 'apt', 'git', 'python3', 'ping', 'nmap'];
                            callback(commands.filter(cmd => cmd.startsWith(string)));
                        }
                    });
                }
            } catch (error: any) {
                console.error("Terminal init failed:", error);
                if (terminalRef.current) {
                    terminalRef.current.innerHTML = `<div style='color:red; padding:20px;'>
                        Terminal Error: Failed to load engine.<br/>
                        Details: ${error?.message || String(error)}<br/>
                        Please refresh.
                    </div>`;
                }
            }
        };

        const timer = setTimeout(initTerminal, 100);
        return () => {
            clearTimeout(timer);
            if (termInstance.current) {
                try {
                    // @ts-ignore
                    termInstance.current.destroy();
                } catch (e) { }
                termInstance.current = null;
            }
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {!isOpen && (
                <motion.div
                    drag
                    dragMomentum={false}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    dragConstraints={{ left: -windowSize.width + 50, right: 0, top: -windowSize.height + 50, bottom: 0 }}
                    onClick={() => { if (!isDragging) setIsOpen(true); }}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={() => setTimeout(() => setIsDragging(false), 50)}
                    className="fixed bottom-20 right-5 z-[50] cursor-pointer bg-black/90 border-2 border-red-600 text-red-500 p-3 rounded-full flex items-center gap-2 overflow-hidden group hover:w-auto transition-all will-change-transform shadow-[0_0_15px_rgba(255,0,0,0.4)]"
                    style={{ touchAction: "none" }}
                    title="Open Terminal (Ctrl + `)"
                >
                    <LucideTerminal size={24} />
                    <span className="font-bold font-mono text-xs hidden group-hover:inline-block whitespace-nowrap px-2">KALI_ROOT</span>
                </motion.div>
            )}

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[9998]" onClick={() => setIsOpen(false)} />
                    <motion.div
                        drag
                        dragListener={false}
                        dragControls={dragControls}
                        dragMomentum={false}
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 40 }}
                        className={`fixed ${isMaximized ? 'inset-4' : 'top-20 right-4 w-[90vw] md:w-[600px] h-[450px]'} z-[9999] shadow-2xl flex flex-col font-mono text-sm border border-zinc-700/50 rounded-lg overflow-hidden bg-black`}
                        onClick={(e) => { e.stopPropagation(); termInstance.current?.focus(); }}
                    >
                        {/* Header */}
                        <div
                            onPointerDown={(e) => dragControls.start(e)}
                            className="px-4 py-2 border-b border-zinc-800 flex items-center justify-between select-none bg-zinc-900 cursor-move touch-none"
                        >
                            <div className="flex items-center gap-2 text-zinc-400">
                                <LucideTerminal size={14} />
                                <span className="font-bold text-xs">root@kali: {formatCwd()}</span>
                            </div>
                            <div className="flex items-center gap-4 text-zinc-500">
                                {isMaximized ?
                                    <Minimize2 size={16} className="cursor-pointer hover:text-white" onClick={() => setIsMaximized(false)} /> :
                                    <Maximize2 size={16} className="cursor-pointer hover:text-white" onClick={() => setIsMaximized(true)} />
                                }
                                <X size={16} className="cursor-pointer hover:text-red-500" onClick={() => setIsOpen(false)} />
                            </div>
                        </div>

                        {/* Terminal Container */}
                        <div className="flex-1 bg-black overflow-hidden relative border-t-2 border-red-900/20">
                            {/* Force terminal styles to ensure visibility */}
                            <style jsx global>{`
                                .cmd, .terminal {
                                    font-family: 'Fira Code', monospace;
                                    color: #00ff00;
                                    background-color: #000000;
                                    font-size: 14px;
                                }
                                .terminal-output div {
                                    line-height: 1.2;
                                }
                                .terminal .inverted, .cmd .inverted {
                                    background-color: #00ff00;
                                    color: #000;
                                }
                            `}</style>
                            <div ref={terminalRef} className="w-full h-full text-left" />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
