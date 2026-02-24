"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useChat } from "@ai-sdk/react";

export default function GlobalAiAssistant() {
	const [isOpen, setIsOpen] = useState(false);
	const [localInput, setLocalInput] = useState("");
	const scrollRef = useRef<HTMLDivElement>(null);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { messages, append, sendMessage, isLoading, error, setMessages } = useChat({
		api: "/api/chat",
	}) as any;

	useEffect(() => {
		if (messages.length === 0) {
			setMessages([
				{
					id: "welcome",
					role: "assistant",
					content: "Merhaba! Ben AntiGravity asistanıyım. Siber güvenlik ve site yönetimi ile ilgili sorularını yanıtlamaya hazırım. Nasıl yardımcı olabilirim?",
				},
			]);
		}
	}, []);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages, isOpen]);

	const handleLocalSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!localInput.trim() || isLoading) return;

		const userMessage = localInput;
		setLocalInput(""); // Clear immediately

		const messagePayload = {
			role: "user",
			content: userMessage,
		};

		if (append) {
			await append(messagePayload);
		} else if (sendMessage) {
			await sendMessage(messagePayload);
		}
	};

	return (
		<div className="fixed bottom-6 right-6 z-[9999] font-sans">
			<AnimatePresence>
				{!isOpen && (
					<motion.button
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0, opacity: 0 }}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						onClick={() => setIsOpen(true)}
						className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full shadow-lg text-white hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center group"
					>
						<Bot size={28} className="group-hover:hidden" />
						<MessageSquare size={28} className="hidden group-hover:block" />
						<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse border-2 border-[#0a0a0a]">
							1
						</span>
					</motion.button>
				)}

				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: 50, scale: 0.9 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 50, scale: 0.9 }}
						className="w-[350px] md:w-[400px] h-[600px] max-h-[80vh] bg-[#1a1a1a] border border-zinc-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl bg-opacity-95"
					>
						{/* Header */}
						<div className="bg-gradient-to-r from-zinc-900 to-zinc-800 p-4 flex items-center justify-between border-b border-zinc-700">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-inner">
									<Bot size={20} className="text-white" />
								</div>
								<div>
									<h3 className="font-bold text-white text-sm">AntiGravity AI</h3>
									<p className="text-xs text-green-400 flex items-center gap-1">
										<span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
										Çevrimiçi
									</p>
								</div>
							</div>
							<button
								onClick={() => setIsOpen(false)}
								className="text-zinc-400 hover:text-white transition-colors p-1 hover:bg-zinc-700 rounded-lg"
							>
								<X size={20} />
							</button>
						</div>

						{/* Chat Area */}
						<div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent bg-[#111111]" ref={scrollRef}>
							{messages.map((msg) => (
								<div
									key={msg.id}
									className={clsx(
										"flex gap-3 max-w-[85%]",
										msg.role === "user" ? "ml-auto flex-row-reverse" : ""
									)}
								>
									<div
										className={clsx(
											"w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md",
											msg.role === "user" ? "bg-zinc-700" : "bg-gradient-to-br from-blue-600 to-purple-700"
										)}
									>
										{msg.role === "user" ? <User size={16} /> : <Sparkles size={16} />}
									</div>
									<div
										className={clsx(
											"p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
											msg.role === "user"
												? "bg-zinc-800 text-zinc-100 rounded-tr-none"
												: "bg-gradient-to-br from-zinc-800 to-zinc-900 text-zinc-200 border border-zinc-700/50 rounded-tl-none"
										)}
									>
										{msg.content}
									</div>
								</div>
							))}
							{isLoading && (
								<div className="flex gap-3 max-w-[85%]">
									<div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center shrink-0">
										<Sparkles size={16} />
									</div>
									<div className="bg-zinc-800 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
										<span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
										<span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
										<span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
									</div>
								</div>
							)}
						</div>

						{error && (
							<div className="p-4 bg-red-900/20 border-t border-red-900/50 text-red-200 text-xs text-center">
								<p>⚠️ Bir hata oluştu.</p>
								<p className="opacity-75">{error.message}</p>
							</div>
						)}

						{/* Input Area */}
						<div className="p-4 bg-zinc-900 border-t border-zinc-800">
							<form onSubmit={handleLocalSubmit} className="relative flex items-center gap-2">
								<input
									type="text"
									value={localInput}
									onChange={(e) => setLocalInput(e.target.value)}
									placeholder="Bir soru sorun..."
									className="w-full bg-black/50 border border-zinc-700 text-white rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-zinc-600 text-sm"
								/>
								<button
									type="submit"
									disabled={!localInput.trim() || isLoading}
									className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-900/20"
								>
									<Send size={16} />
								</button>
							</form>
							<div className="text-center mt-2">
								<p className="text-[10px] text-zinc-600">CypherDocs AI · Güçlendirilmiş asistan</p>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
