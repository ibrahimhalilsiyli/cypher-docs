
import { Block as BlockType } from "@/lib/storage";
import { resizeImage } from "@/lib/image-utils";
import { safeDecode } from "@/lib/cyber-utils";
import RichText from "./RichText";
import { Trash2, Image as ImageIcon, X, ChevronUp, ChevronDown, AlertCircle, Quote as QuoteIcon, Binary, Eye, EyeOff, Minus } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

interface BlockProps {
	block: BlockType;
	onChange: (content: string, extra?: any) => void;
	onDelete: () => void;
	onMove: (direction: 'up' | 'down') => void;
	onDuplicate: () => void;
}

export default function Block({ block, onChange, onDelete, onMove, onDuplicate }: BlockProps) {
	const [isHovered, setIsHovered] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [isRevealed, setIsRevealed] = useState(false); // For redacted block

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setIsUploading(true);
		try {
			const base64 = await resizeImage(file, 800);
			onChange(base64);
		} catch (error) {
			console.error("Image upload failed", error);
			alert("Failed to process image.");
		}
		setIsUploading(false);
	};

	return (
		<div
			className="group relative flex items-start gap-3 -ml-12 pl-12 transition-colors hover:bg-primary/5 rounded-lg py-1 pr-4"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Controls */}
			<div className={clsx(
				"absolute left-1 top-1.5 flex flex-col gap-0.5 transition-opacity bg-background border border-border rounded shadow-sm z-10",
				isHovered ? "opacity-100" : "opacity-0"
			)}>
				<button onClick={() => onMove('up')} className="p-0.5 hover:bg-surface hover:text-primary rounded text-text-muted" title="Move Up">
					<ChevronUp size={12} />
				</button>
				<button onClick={() => onMove('down')} className="p-0.5 hover:bg-surface hover:text-primary rounded text-text-muted" title="Move Down">
					<ChevronDown size={12} />
				</button>
				<div className="h-px bg-border my-0.5" />
				<button onClick={onDuplicate} className="p-0.5 hover:bg-surface hover:text-primary rounded text-text-muted font-bold text-[10px]" title="Duplicate">
					x2
				</button>
				<button onClick={onDelete} className="p-0.5 hover:bg-red-500/10 hover:text-red-500 rounded text-text-muted" title="Delete">
					<Trash2 size={12} />
				</button>
			</div>

			{/* Content Renderers */}
			<div className="flex-1 min-w-0">

				{/* HEADING */}
				{block.type === "heading" && (
					<input
						value={block.content}
						onChange={(e) => onChange(e.target.value)}
						className="w-full bg-transparent text-2xl font-bold text-primary focus:outline-none placeholder:text-primary/30"
						placeholder="Heading"
					/>
				)}

				{/* TEXT */}
				{block.type === "text" && (
					<RichText
						content={block.content}
						onChange={(html) => onChange(html)}
						placeholder="Type standard text (Select for formatting)..."
					/>
				)}

				{/* CHECKLIST */}
				{block.type === "checklist" && (
					<div className="flex items-start gap-3">
						<input
							type="checkbox"
							checked={block.checked}
							onChange={(e) => onChange(block.content, { checked: e.target.checked })}
							className="mt-1.5 h-4 w-4 rounded border-border bg-surface text-primary focus:ring-primary cursor-pointer accent-primary"
						/>
						<input
							value={block.content}
							onChange={(e) => onChange(e.target.value)}
							className={clsx(
								"flex-1 bg-transparent focus:outline-none placeholder:text-text-muted/50 transition-all",
								block.checked ? "text-text-muted line-through" : "text-text"
							)}
							placeholder="To-do item"
						/>
					</div>
				)}

				{/* CODE */}
				{block.type === "code" && (
					<div className="bg-surface border border-border rounded-lg p-3 font-mono text-sm relative group/code focus-within:ring-1 ring-primary/50">
						<div className="absolute top-2 right-2 text-[10px] text-text-muted uppercase select-none bg-background px-1 rounded border border-border">
							{block.language || "code"}
						</div>
						<textarea
							value={block.content}
							onChange={(e) => onChange(e.target.value)}
							className="w-full bg-transparent text-primary resize-none focus:outline-none"
							placeholder="// Enter code snippet..."
							rows={Math.max(3, block.content.split('\n').length)}
						/>
					</div>
				)}

				{/* CALLOUT */}
				{block.type === "callout" && (
					<div className={clsx(
						"p-4 rounded-lg flex gap-3 items-start border",
						block.variant === 'warning' ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-200" :
							block.variant === 'alert' ? "bg-red-500/10 border-red-500/20 text-red-200" :
								"bg-blue-500/10 border-blue-500/20 text-blue-200"
					)}>
						<AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
						<textarea
							value={block.content}
							onChange={(e) => {
								onChange(e.target.value);
								e.target.style.height = 'auto';
								e.target.style.height = e.target.scrollHeight + 'px';
							}}
							className="w-full bg-transparent resize-none overflow-hidden focus:outline-none placeholder:opacity-50"
							placeholder="Callout text..."
							rows={1}
							style={{ height: 'auto' }}
						/>
						<div className="flex gap-1">
							{['info', 'warning', 'alert'].map((v) => (
								<button
									key={v}
									onClick={() => onChange(block.content, { variant: v })}
									className={clsx(
										"w-3 h-3 rounded-full border border-white/10",
										v === 'info' ? "bg-blue-500" : v === 'warning' ? "bg-yellow-500" : "bg-red-500",
										block.variant === v && "ring-2 ring-white/50"
									)}
								/>
							))}
						</div>
					</div>
				)}

				{/* QUOTE */}
				{block.type === "quote" && (
					<div className="flex gap-4">
						<div className="w-1 bg-gradient-to-b from-primary to-transparent rounded-full opacity-50 print:bg-black print:opacity-100 print:from-black print:to-black" />
						<div className="flex-1">
							<QuoteIcon size={16} className="text-primary mb-2 opacity-50 print:text-black print:opacity-100" />
							<textarea
								value={block.content}
								onChange={(e) => {
									onChange(e.target.value);
									e.target.style.height = 'auto';
									e.target.style.height = e.target.scrollHeight + 'px';
								}}
								className="w-full bg-transparent text-lg italic text-text-muted resize-none overflow-hidden focus:outline-none placeholder:text-text-muted/30 print:text-black"
								placeholder="Enter quote or log entry..."
								rows={1}
								style={{ height: 'auto' }}
							/>
						</div>
					</div>
				)}

				{/* DIVIDER */}
				{block.type === "divider" && (
					<div className="py-4 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity cursor-grab print:opacity-100">
						<div className="h-px bg-border w-full print:bg-black print:border-t print:border-black" />
						<div className="absolute bg-background px-2 text-text-muted print:text-black print:bg-white">
							<Minus size={12} />
						</div>
					</div>
				)}

				{/* CYBER CONFIG: DECODER */}
				{block.type === "decoder" && (
					<div className="bg-black/90 border border-primary/30 rounded-lg overflow-hidden font-mono text-sm shadow-[0_0_20px_rgba(0,0,0,0.5)]">
						<div className="bg-primary/20 p-2 flex items-center gap-2 text-primary border-b border-primary/20">
							<Binary size={14} />
							<span className="font-bold text-xs tracking-widest">CYBER_DECODER_MODULE</span>
						</div>
						<div className="grid grid-cols-2 divide-x divide-primary/20">
							<div className="p-3">
								<label className="text-[10px] text-primary/50 block mb-1">INPUT (Encoded)</label>
								<textarea
									value={block.content}
									onChange={(e) => onChange(e.target.value)}
									className="w-full bg-transparent text-primary resize-none focus:outline-none placeholder:text-primary/20 h-24"
									placeholder="Paste Base64, Hex, or URL Encoded string..."
								/>
							</div>
							<div className="p-3 bg-primary/5">
								<label className="text-[10px] text-green-500/50 block mb-1">OUTPUT (Decoded)</label>
								<div className="space-y-2">
									<div>
										<div className="text-[8px] text-green-500/70">BASE64</div>
										<div className="text-green-500 break-all">{safeDecode(block.content, 'base64')}</div>
									</div>
									<div>
										<div className="text-[8px] text-green-500/70">HEX</div>
										<div className="text-green-500 break-all">{safeDecode(block.content, 'hex')}</div>
									</div>
									<div>
										<div className="text-[8px] text-green-500/70">URL</div>
										<div className="text-green-500 break-all">{safeDecode(block.content, 'url')}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* CYBER CONFIG: REDACTED */}
				{block.type === "redacted" && (
					<div className="relative group/redacted">
						<div className="flex items-center gap-2 mb-1">
							{isRevealed ? <EyeOff size={14} className="text-red-500" /> : <Eye size={14} className="text-text-muted" />}
							<span className="text-[10px] text-text-muted font-mono uppercase tracking-widest">Confidential Data</span>
						</div>
						<div
							className="relative"
							onMouseEnter={() => setIsRevealed(true)}
							onMouseLeave={() => setIsRevealed(false)}
						>
							<input
								type={isRevealed ? "text" : "password"}
								value={block.content}
								onChange={(e) => onChange(e.target.value)}
								className={clsx(
									"w-full bg-black/20 border border-border rounded px-3 py-2 font-mono text-red-400 focus:outline-none transition-all",
									!isRevealed && "blur-sm opacity-50 cursor-pointer select-none"
								)}
								placeholder="TOP SECRET DATA"
							/>
							{!isRevealed && (
								<div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-text-muted font-bold tracking-widest uppercase">
									[ REDACTED ]
								</div>
							)}
						</div>
					</div>
				)}

				{/* IMAGE */}
				{block.type === "image" && (
					<div className="relative">
						{block.content ? (
							<div className="relative group/image inline-block">
								<img
									src={block.content}
									alt="Evidence"
									className="max-w-full rounded-lg border border-border shadow-sm"
								/>
								<button
									onClick={() => onChange("")}
									className="absolute top-2 right-2 bg-black/50 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover/image:opacity-100 transition-all"
								>
									<X size={16} />
								</button>
							</div>
						) : (
							<label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-surface/30 hover:bg-surface hover:border-primary/50 transition-all active:scale-[0.99]">
								<div className="flex flex-col items-center justify-center pt-5 pb-6">
									{isUploading ? (
										<div className="animate-pulse text-primary text-sm font-bold">Processing...</div>
									) : (
										<>
											<ImageIcon className="w-8 h-8 text-text-muted mb-2 opacity-50" />
											<p className="text-sm text-text-muted">
												Click to upload image
											</p>
										</>
									)}
								</div>
								<input
									type="file"
									className="hidden"
									accept="image/*"
									onChange={handleImageUpload}
									disabled={isUploading}
								/>
							</label>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

