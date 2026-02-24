"use client";

import React, { useState } from "react";
import { Copy, Terminal } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import clsx from "clsx";

interface TerminalBlockProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export default function TerminalBlock({
    title = "bash",
    children,
    className,
}: TerminalBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        // Extract text content from children
        let textToCopy = "";
        if (typeof children === "string") {
            textToCopy = children;
        } else {
            // Basic extraction for simple structures, might need refinement for complex children
            // For now, assuming children is either string or simple elements
            try {
                const element = document.getElementById("terminal-content");
                if (element) textToCopy = element.innerText;
            } catch (e) {
                console.error("Failed to copy", e);
            }
        }

        // Fallback if extracting from DOM isn't ideal in SSR context, but this is a client component
        // Better approach: user passes raw code string prop if possible, but children is flexible.
        // Let's assume children is the code content wrapped in something.
        // For this demo, let's just copy what we can find.

        // Actually, Tiptap code blocks usually pass content as text.
        // Let's rely on a ref or simple text extraction if standard.
        // If children is formatted code, `innerText` of the container works.

        // Simpler copy logic for now:
        const codeContent = document.getElementById("terminal-code")?.innerText || "";
        navigator.clipboard.writeText(codeContent).then(() => {
            setCopied(true);
            toast.success("Copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div
            className={clsx(
                "rounded-lg overflow-hidden border border-white/10 bg-[#0f1318] shadow-2xl my-4 group transition-all duration-300 hover:border-primary/30",
                className
            )}
        >
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#0b0f14] border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex items-center gap-1.5 ml-3 font-mono text-xs text-zinc-500">
                        <Terminal size={12} />
                        <span>{title}</span>
                    </div>
                </div>
                <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-md hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"
                    aria-label="Copy code"
                >
                    <Copy size={14} className={clsx(copied && "text-green-400")} />
                </button>
            </div>

            {/* Terminal Body */}
            <div className="p-4 font-mono text-sm relative overflow-x-auto">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div id="terminal-code" className="text-zinc-300">
                    <div className="flex">
                        <span className="text-primary mr-2 select-none">$</span>
                        <div className="flex-1">
                            {children}
                            <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="inline-block w-2 h-4 bg-primary ml-1 align-middle"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
