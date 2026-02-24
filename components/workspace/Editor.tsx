import { Page, Block as BlockType } from "@/lib/storage";
import { useState, useRef, useEffect } from "react";
import Block from "./Block";
import { Plus, Type, Image as ImageIcon, CheckSquare, Code, Heading, AlertCircle, Quote, Minus, Binary, EyeOff, X, Download } from "lucide-react";
import { getWordCount } from "@/lib/cyber-utils";
import clsx from "clsx";

interface EditorProps {
	page: Page;
	onUpdate: (updatedPage: Page) => void;
}

export default function Editor({ page, onUpdate }: EditorProps) {
	const endRef = useRef<HTMLDivElement>(null);

	const updateTitle = (title: string) => {
		onUpdate({ ...page, title, updatedAt: Date.now() });
	};

	const updateBlock = (blockId: string, content: string, extra?: Partial<BlockType>) => {
		const newBlocks = page.blocks.map(b =>
			b.id === blockId ? { ...b, content, ...extra } : b
		);
		onUpdate({ ...page, blocks: newBlocks, updatedAt: Date.now() });
	};

	const addBlock = (type: BlockType['type'] = "text") => {
		const newBlock: BlockType = {
			id: crypto.randomUUID(),
			type,
			content: "",
			variant: type === 'callout' ? 'info' : undefined,
			checked: type === "checklist" ? false : undefined,
			language: type === "code" ? "javascript" : undefined
		};
		onUpdate({ ...page, blocks: [...page.blocks, newBlock], updatedAt: Date.now() });

		// Scroll to bottom after adding
		setTimeout(() => {
			endRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100);
	};

	const deleteBlock = (blockId: string) => {
		onUpdate({ ...page, blocks: page.blocks.filter(b => b.id !== blockId), updatedAt: Date.now() });
	};

	const moveBlock = (blockId: string, direction: 'up' | 'down') => {
		const index = page.blocks.findIndex(b => b.id === blockId);
		if (index === -1) return;

		const newBlocks = [...page.blocks];
		if (direction === 'up' && index > 0) {
			[newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
		} else if (direction === 'down' && index < newBlocks.length - 1) {
			[newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
		}

		onUpdate({ ...page, blocks: newBlocks, updatedAt: Date.now() });
	};

	const duplicateBlock = (blockId: string) => {
		const index = page.blocks.findIndex(b => b.id === blockId);
		if (index === -1) return;

		const blockToCopy = page.blocks[index];
		const newBlock: BlockType = {
			...blockToCopy,
			id: crypto.randomUUID()
		};

		const newBlocks = [...page.blocks];
		newBlocks.splice(index + 1, 0, newBlock); // Insert after
		onUpdate({ ...page, blocks: newBlocks, updatedAt: Date.now() });
	};

	const handleExportMD = () => {
		let md = `# ${page.title || "Untitled Mission"}\n\n`;
		page.blocks.forEach(b => {
			switch (b.type) {
				case 'heading': md += `## ${b.content}\n\n`; break;
				case 'checklist': md += `- [${b.checked ? 'x' : ' '}] ${b.content}\n`; break;
				case 'code': md += "```" + (b.language || "") + "\n" + b.content + "\n```\n\n"; break;
				case 'image': md += `![Evidence](${b.content})\n\n`; break;
				case 'quote': md += `> ${b.content}\n\n`; break;
				case 'divider': md += `---\n\n`; break;
				case 'callout': md += `> [!${b.variant?.toUpperCase() || 'INFO'}]\n> ${b.content}\n\n`; break;
				case 'decoder': md += `**DECODER INPUT**: ${b.content}\n\n`; break;
				default: md += `${b.content}\n\n`;
			}
		});
		downloadFile(`${page.title || "mission"}.md`, md, 'text/markdown');
	};

	const handleExportHTML = () => {
		// Simple HTML export compatible with Word
		const html = `
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                        h1 { border-bottom: 2px solid #333; padding-bottom: 10px; }
                        .callout { padding: 10px; background: #f0f0f0; border-left: 5px solid #333; margin: 10px 0; }
                        .code { background: #f4f4f4; padding: 10px; font-family: monospace; white-space: pre-wrap; }
                    </style>
                </head>
                <body>
                    <h1>${page.title || "Untitled Mission"}</h1>
                    ${page.blocks.map(b => {
			switch (b.type) {
				case 'text': return `<p>${b.content}</p>`;
				case 'heading': return `<h2>${b.content}</h2>`;
				case 'image': return `<img src="${b.content}" style="max-width:100%" /><br/>`;
				case 'checklist': return `<div><input type="checkbox" ${b.checked ? 'checked' : ''} disabled /> ${b.content}</div>`;
				case 'code': return `<div class="code">${b.content}</div>`;
				case 'callout': return `<div class="callout" style="border-color: ${b.variant === 'alert' ? 'red' : 'blue'}">${b.content}</div>`;
				default: return `<div>${b.content}</div>`;
			}
		}).join('')}
                </body>
            </html>
        `;
		downloadFile(`${page.title || "mission"}.html`, html, 'text/html');
	};

	const downloadFile = (filename: string, content: string, type: string) => {
		const blob = new Blob([content], { type });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	// Calculate Stats
	const totalWords = page.blocks.reduce((acc, b) => acc + getWordCount(b.content), 0);
	const totalChars = page.blocks.reduce((acc, b) => acc + b.content.length, 0);

	return (
		<div className="max-w-4xl mx-auto py-12 px-8 pb-32 relative">
			{/* Header Actions */}
			<div className="absolute top-4 right-8 flex gap-2">
				<button
					onClick={handleExportMD}
					className="flex items-center gap-2 text-xs font-bold text-primary border border-primary/20 bg-primary/5 px-3 py-1.5 rounded hover:bg-primary/10 transition-colors"
					title="Export as Markdown"
				>
					<Download size={14} /> MD
				</button>
				<button
					onClick={handleExportHTML}
					className="flex items-center gap-2 text-xs font-bold text-primary border border-primary/20 bg-primary/5 px-3 py-1.5 rounded hover:bg-primary/10 transition-colors"
					title="Export for Word/Web"
				>
					<Download size={14} /> HTML
				</button>
				<button
					onClick={() => window.print()}
					className="flex items-center gap-2 text-xs font-bold text-primary border border-primary/20 bg-primary/5 px-3 py-1.5 rounded hover:bg-primary/10 transition-colors"
					title="Print / Save as PDF"
				>
					<Download size={14} /> PDF
				</button>
			</div>

			<input
				type="text"
				value={page.title}
				onChange={(e) => updateTitle(e.target.value)}
				className="w-full bg-transparent text-4xl font-bold text-text mb-8 border-none focus:outline-none placeholder:text-zinc-400 placeholder:font-normal"
				placeholder="Untitled Mission..."
			/>

			<div className="space-y-4 min-h-[50vh]">
				{page.blocks.map(block => (
					<Block
						key={block.id}
						block={block}
						onChange={(content, extra) => updateBlock(block.id, content, extra)}
						onDelete={() => deleteBlock(block.id)}
						onMove={(dir) => moveBlock(block.id, dir)}
						onDuplicate={() => duplicateBlock(block.id)}
					/>
				))}
				<div ref={endRef} />
			</div>

			{/* Quick Add Toolbar */}
			<div className="mt-12 sticky bottom-8 flex justify-center z-50">
				<div className="bg-surface/90 backdrop-blur-md px-6 py-3 rounded-full border border-border shadow-2xl flex gap-4 items-center transition-all hover:scale-[1.01] hover:shadow-primary/5">
					<div className="flex gap-2 pr-4 border-r border-border">
						<ToolButton icon={Type} label="Text" onClick={() => addBlock("text")} />
						<ToolButton icon={Heading} label="Header" onClick={() => addBlock("heading")} />
						<ToolButton icon={CheckSquare} label="Task" onClick={() => addBlock("checklist")} />
					</div>

					<div className="flex gap-2 pr-4 border-r border-border">
						<ToolButton icon={Code} label="Code" onClick={() => addBlock("code")} />
						<ToolButton icon={ImageIcon} label="Img" onClick={() => addBlock("image")} />
						<ToolButton icon={Quote} label="Quote" onClick={() => addBlock("quote")} />
						<ToolButton icon={AlertCircle} label="Callout" onClick={() => addBlock("callout")} />
						<ToolButton icon={Minus} label="Line" onClick={() => addBlock("divider")} />
					</div>

					<div className="flex gap-2">
						<ToolButton icon={Binary} label="Decode" onClick={() => addBlock("decoder")} active />
						<ToolButton icon={EyeOff} label="Redact" onClick={() => addBlock("redacted")} active />
					</div>
				</div>
			</div>

			{/* Stats Footer */}
			<div className="fixed bottom-0 left-64 right-0 p-2 bg-surface border-t border-border flex justify-between px-8 text-[10px] text-text-muted font-mono">
				<div>CYBER_WORKSPACE_V2.0</div>
				<div className="flex gap-4">
					<span>WORDS: {totalWords}</span>
					<span>CHARS: {totalChars}</span>
					<span>BLOCKS: {page.blocks.length}</span>
				</div>
			</div>
		</div>
	);
}

function ToolButton({ icon: Icon, label, onClick, active }: any) {
	return (
		<button
			onClick={onClick}
			className={clsx(
				"text-text-muted hover:text-text transition-colors relative group p-2 rounded-lg",
				active ? "bg-primary/10 text-primary border border-primary/20" : "hover:bg-background/50"
			)}
			title={label}
		>
			<Icon size={18} />
		</button>
	)
}
