"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { loadWorkspace, saveWorkspace, WorkspaceData, Page } from "@/lib/storage";
import Sidebar from "@/components/workspace/Sidebar";
import Editor from "@/components/workspace/Editor";
import { Terminal as TerminalIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

export default function WorkspacePage() {
	const [data, setData] = useState<WorkspaceData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

	const { status } = useSession();

	// Initial Load & Auth Check
	useEffect(() => {
		if (status === "loading") return;

		const loaded = loadWorkspace();
		if (!loaded) {
			const userId = localStorage.getItem("cypher_auth");
			if (!userId && status === "authenticated") {
				const checkSync = setInterval(() => {
					if (localStorage.getItem("cypher_auth")) {
						clearInterval(checkSync);
						window.location.reload();
					}
				}, 100);
				return;
			}
			if (!userId) {
				window.location.href = "/login";
				return;
			}
		}
		setData(loaded || { pages: [], activePageId: null });
		setIsLoading(false);
	}, [status]);

	// Auto-save whenever data changes
	useEffect(() => {
		if (data) {
			saveWorkspace(data);
		}
	}, [data]);

	const createPage = (parentId?: string) => {
		if (!data) return;
		const newPage: Page = {
			id: crypto.randomUUID(),
			parentId: parentId,
			title: "",
			blocks: [
				{ id: crypto.randomUUID(), type: "text", content: "" }
			],
			createdAt: Date.now(),
			updatedAt: Date.now()
		};
		setData(prevData => {
			if (!prevData) return null;
			return {
				...prevData,
				pages: [newPage, ...prevData.pages],
				activePageId: newPage.id
			};
		});
	};

	const handleDeletePage = (id: string) => {
		if (!data) return;
		if (!confirm("Are you sure you want to delete this mission file? This action is irreversible.")) return;

		const newPages = data.pages.filter(p => p.id !== id);
		setData({
			...data,
			pages: newPages,
			activePageId: data.activePageId === id ? (newPages[0]?.id || null) : data.activePageId
		});
	};

	const handleUpdatePage = (updatedPage: Page) => {
		if (!data) return;
		const newPages = data.pages.map(p => p.id === updatedPage.id ? updatedPage : p);
		setData({
			...data,
			pages: newPages
		});
	};

	if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center font-mono text-primary animate-pulse">DECRYPTING_WORKSPACE...</div>;
	if (!data) return null;

	const activePage = data.pages.find(p => p.id === data.activePageId);

	return (
		<div className="flex h-screen bg-background text-text font-mono overflow-hidden relative">
			{/* Mobile Sidebar Toggle */}
			<button
				onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
				className="md:hidden fixed bottom-6 right-6 z-[60] p-4 bg-primary text-background rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
				aria-label="Toggle Mission Log"
			>
				{isMobileSidebarOpen ? <X size={24} /> : <TerminalIcon size={24} />}
			</button>

			{/* Mobile Backdrop */}
			<AnimatePresence>
				{isMobileSidebarOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setIsMobileSidebarOpen(false)}
						className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[45]"
					/>
				)}
			</AnimatePresence>

			<div className={clsx(
				"fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:relative md:translate-x-0 md:z-auto",
				isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
			)}>
				<Sidebar
					pages={data.pages}
					activePageId={data.activePageId}
					onSelect={(id) => {
						setData({ ...data, activePageId: id });
						setIsMobileSidebarOpen(false); // Close on select
					}}
					onCreate={createPage}
					onDelete={handleDeletePage}
				/>
			</div>

			<div className="flex-1 overflow-auto bg-background/50 pt-16 md:pt-0">
				{activePage ? (
					<Editor
						key={activePage.id}
						page={activePage}
						onUpdate={handleUpdatePage}
					/>
				) : (
					<div className="h-full flex flex-col items-center justify-center text-text-muted opacity-50 p-8 text-center">
						<div className="w-24 h-24 mb-6 border-2 border-dashed border-text-muted rounded-full flex items-center justify-center animate-pulse">
							?
						</div>
						<h2 className="text-xl font-bold mb-2">NO FILE SELECTED</h2>
						<p>Select a mission from the sidebar or create a new file to begin reconnaissance.</p>
					</div>
				)}
			</div>
		</div>
	);
}

