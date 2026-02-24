"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Copy, Check, Eye, EyeOff, Terminal, Info, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonGuideProps {
	title: string;
	instruction: string;
	concept: string;
	hint?: string;
	cmd: string;
}

export default function LessonGuide({ title, instruction, concept, hint, cmd }: LessonGuideProps) {
	const [showSupport, setShowSupport] = useState(false);
	const [showCode, setShowCode] = useState(false);
	const [copied, setCopied] = useState(false);

	// Reset state when title changes (new step)
	useEffect(() => {
		setShowSupport(false);
		setShowCode(false);
		setCopied(false);
	}, [title]);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(cmd);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
			<div>
				<h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
					<Terminal className="text-primary" size={24} />
					{title}
				</h2>

				<div className="mb-6">
					<div className="text-xs text-primary mb-1 uppercase tracking-wider font-bold">Mission Brief</div>
					<p className="text-text leading-relaxed text-lg">{instruction}</p>
				</div>

				<div className="mb-6 p-4 bg-surface-light/50 rounded border border-white/10">
					<div className="text-xs text-secondary/80 mb-2 uppercase tracking-wider font-bold flex items-center gap-2">
						<Info size={14} /> Intel / Concept
					</div>
					<p className="text-zinc-400 text-sm leading-relaxed">{concept}</p>
				</div>
			</div>

			<div className="space-y-2">
				{/* Collapsible Operational Support */}
				<div className="border border-border rounded overflow-hidden">
					<button
						onClick={() => setShowSupport(!showSupport)}
						className="w-full flex items-center justify-between p-3 bg-black/40 hover:bg-black/60 transition-colors text-left"
					>
						<span className="text-xs text-text-muted font-bold uppercase tracking-wider flex items-center gap-2">
							{showSupport ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
							Operational Support
						</span>
					</button>

					{showSupport && (
						<div className="p-4 bg-black/20 border-t border-border animate-in slide-in-from-top-1 duration-200">

							{/* Text Hint */}
							<div className="mb-4 text-sm text-zinc-400">
								<span className="text-primary font-bold mr-2">HINT:</span>
								{hint || "No specific hint available. Try using your knowledge of the command line."}
							</div>

							{/* Reveal Code Section */}
							<div className="mt-4 pt-4 border-t border-white/5">
								{!showCode ? (
									<button
										onClick={() => setShowCode(true)}
										className="flex items-center gap-2 text-xs text-primary hover:text-primary-hover transition-colors font-mono"
									>
										<Eye size={14} />
										REVEAL_PAYLOAD_COMMAND
									</button>
								) : (
									<div className="relative group animate-in fade-in duration-300">
										<div className="absolute right-2 top-2 flex items-center gap-2 z-10">
											<button
												onClick={copyToClipboard}
												className="p-1.5 bg-surface hover:bg-surface-light rounded text-text-muted hover:text-white transition-colors border border-border"
												title="Copy to clipboard"
											>
												{copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
											</button>
											<button
												onClick={() => setShowCode(false)}
												className="p-1.5 bg-surface hover:bg-surface-light rounded text-text-muted hover:text-white transition-colors border border-border"
												title="Hide command"
											>
												<EyeOff size={14} />
											</button>
										</div>
										<div className="font-mono bg-black/80 p-3 rounded border border-primary/20 text-primary text-sm pr-20 break-all">
											<span className="text-green-500 mr-2">$</span>
											{cmd}
										</div>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
