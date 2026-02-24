
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal, RefreshCw, Minimize2, Maximize2, X } from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";

interface Command {
    input: string;
    output: React.ReactNode;
}

interface InteractiveTerminalProps {
    welcomeMessage?: string;
    onCommand?: (command: string) => React.ReactNode | null; // Return null if not handled
    className?: string;
}

export default function InteractiveTerminal({
    welcomeMessage = "Kali GNU/Linux Rolling",
    onCommand,
    className,
}: InteractiveTerminalProps) {
    const [history, setHistory] = useState<Command[]>([]);
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            const trimmedInput = input.trim();
            if (!trimmedInput) return;

            let output: React.ReactNode = null;

            // Built-in commands
            if (trimmedInput === "clear") {
                setHistory([]);
                setInput("");
                return;
            } else if (trimmedInput === "help") {
                output = (
                    <div className="text-zinc-400">
                        <p>Available commands:</p>
                        <ul className="list-disc list-inside">
                            <li>help - Show this message</li>
                            <li>clear - Clear terminal</li>
                        </ul>
                    </div>
                );
            } else {
                // Delegate to parent (lesson logic)
                if (onCommand) {
                    output = onCommand(trimmedInput);
                }

                // Default fallback if parent doesn't handle it
                if (!output) {
                    output = <span className="text-red-400">zsh: command not found: {trimmedInput}</span>;
                }
            }

            setHistory([...history, { input: trimmedInput, output }]);
            setInput("");
        }
    };

    const focusInput = () => {
        inputRef.current?.focus();
    };

    return (
        <div
            className={clsx(
                "flex flex-col rounded-t-lg overflow-hidden border border-zinc-800 bg-[#1a1a1a] shadow-2xl h-[600px] font-mono text-sm",
                className
            )}
            onClick={focusInput}
        >
            {/* Kali Window Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-zinc-700 shrink-0 select-none">
                <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs font-bold">guest@kali: ~</span>
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                    <Minimize2 size={12} className="hover:text-white cursor-pointer" />
                    <Maximize2 size={12} className="hover:text-white cursor-pointer" />
                    <X size={14} className="hover:text-red-500 cursor-pointer" />
                </div>
            </div>

            {/* Terminal Body */}
            <div
                ref={scrollRef}
                className="flex-1 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent bg-[#1e1e1e]"
                style={{ fontFamily: "'Fira Code', 'Consolas', monospace" }}
            >
                <div className="text-zinc-500 mb-2">
                    {welcomeMessage}
                </div>

                {history.map((entry, i) => (
                    <div key={i} className="mb-1">
                        <div className="flex flex-wrap items-center gap-x-2 text-zinc-300 break-all">
                            <span className="text-blue-500 font-bold">┌──(guest㉿kali)-[<span className="text-white">~</span>]</span>
                            <div className="w-full flex items-center gap-2">
                                <span className="text-blue-500 font-bold">└─$</span>
                                <span className="text-white">{entry.input}</span>
                            </div>
                        </div>
                        <div className="mt-1 mb-3 text-zinc-300 whitespace-pre-wrap">
                            {entry.output}
                        </div>
                    </div>
                ))}

                <div className="flex flex-col">
                    <span className="text-blue-500 font-bold">┌──(guest㉿kali)-[<span className="text-white">~</span>]</span>
                    <div className="flex items-center gap-2">
                        <span className="text-blue-500 font-bold">└─$</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 bg-transparent focus:outline-none border-none p-0 text-white placeholder-zinc-600"
                            autoFocus
                            spellCheck={false}
                            autoComplete="off"
                        />
                        <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="inline-block w-2.5 h-4 bg-zinc-400 ml-[-8px] align-middle pointer-events-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
