import { Page } from "@/lib/storage";
import { Plus, Trash2, FileText, ChevronRight, ChevronDown, FolderPlus } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";

interface SidebarProps {
	pages: Page[];
	activePageId: string | null;
	onSelect: (pageId: string) => void;
	onCreate: (parentId?: string) => void;
	onDelete: (pageId: string) => void;
}

export default function Sidebar({ pages, activePageId, onSelect, onCreate, onDelete }: SidebarProps) {
	const [expanded, setExpanded] = useState<Record<string, boolean>>({});

	const toggleExpand = (pageId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		setExpanded(prev => ({ ...prev, [pageId]: !prev[pageId] }));
	};

	const renderTree = (parentId: string | undefined, depth = 0) => {
		const childPages = pages.filter(p => p.parentId === parentId);
		if (childPages.length === 0) return null;

		return (
			<div className="flex flex-col gap-0.5">
				{childPages.map(page => {
					const hasChildren = pages.some(p => p.parentId === page.id);
					const isExpanded = expanded[page.id];
					const isActive = activePageId === page.id;

					return (
						<div key={page.id}>
							<div
								className={clsx(
									"group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm select-none",
									isActive ? "bg-primary/10 text-primary" : "text-text-muted hover:bg-surface hover:text-text",
									depth > 0 && "ml-4 border-l border-border/50"
								)}
								onClick={() => onSelect(page.id)}
							>
								<button
									onClick={(e) => toggleExpand(page.id, e)}
									className={clsx(
										"p-0.5 rounded hover:bg-background/50 transition-colors",
										!hasChildren && "opacity-0 pointer-events-none"
									)}
								>
									{isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
								</button>

								<FileText size={14} className={isActive ? "text-primary" : "opacity-50"} />
								<span className="truncate flex-1">{page.title || "Untitled"}</span>

								{/* Hover Actions */}
								<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
									<button
										onClick={(e) => { e.stopPropagation(); onCreate(page.id); setExpanded(prev => ({ ...prev, [page.id]: true })); }}
										className="p-1 hover:text-primary hover:bg-background rounded"
										title="New Sub-page"
									>
										<Plus size={12} />
									</button>
									<button
										onClick={(e) => { e.stopPropagation(); onDelete(page.id); }}
										className="p-1 hover:text-red-500 hover:bg-background rounded"
										title="Delete"
									>
										<Trash2 size={12} />
									</button>
								</div>
							</div>

							{/* Recursive Children */}
							{isExpanded && renderTree(page.id, depth + 1)}
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<aside className="w-64 bg-surface/30 border-r border-border h-screen flex flex-col pt-24 pb-4">
			<div className="px-4 mb-4 flex justify-between items-center">
				<h2 className="text-xs font-bold text-text-muted uppercase tracking-widest">Missions</h2>
				<button
					onClick={() => onCreate(undefined)}
					className="p-1.5 hover:bg-primary/10 text-primary rounded transition-colors"
				>
					<Plus size={16} />
				</button>
			</div>

			<div className="flex-1 overflow-y-auto px-2">
				{renderTree(undefined)}

				{pages.length === 0 && (
					<div className="text-center py-8 text-text-muted/50 text-xs italic">
						No missions found.
						<br />
						Start a new operation.
					</div>
				)}
			</div>
		</aside>
	);
}
