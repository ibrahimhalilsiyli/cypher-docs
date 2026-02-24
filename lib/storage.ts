

export interface WorkspaceData {
	pages: Page[];
	activePageId: string | null;
}

export interface Page {
	id: string;
	parentId?: string; // For nested hierarchy
	title: string;
	blocks: Block[];
	createdAt: number;
	updatedAt: number;
}

export interface Block {
	id: string;
	type: "text" | "heading" | "image" | "code" | "checklist" | "callout" | "divider" | "quote" | "decoder" | "redacted";
	content: string;
	checked?: boolean; // For checklist
	language?: string; // For code
	variant?: "info" | "warning" | "alert" | "success"; // For callout
}

// STORAGE KEYS
const getStorageKey = (userId: string) => `cypher_workspace_${userId}`;

export const loadWorkspace = (): WorkspaceData | null => {
	if (typeof window === "undefined") return null;

	// Get current user
	const userId = localStorage.getItem("cypher_auth");
	if (!userId) return null; // No user, no data

	try {
		const key = getStorageKey(userId);
		const data = localStorage.getItem(key);

		// Default seed data if empty
		if (!data) {
			const seed: WorkspaceData = {
				pages: [{
					id: crypto.randomUUID(),
					title: "Classified Mission",
					createdAt: Date.now(),
					updatedAt: Date.now(),
					blocks: [
						{ id: crypto.randomUUID(), type: "heading", content: "Welcome Operative" },
						{ id: crypto.randomUUID(), type: "text", content: "This workspace is encrypted and linked to your biometrics (User ID)." }
					]
				}],
				activePageId: null
			};
			// Set active page id to the first page
			seed.activePageId = seed.pages[0].id;
			return seed;
		}
		return JSON.parse(data);
	} catch (e) {
		console.error("Failed to load workspace", e);
		return { pages: [], activePageId: null };
	}
};

export const saveWorkspace = (data: WorkspaceData): boolean => {
	if (typeof window === "undefined") return false;

	const userId = localStorage.getItem("cypher_auth");
	if (!userId) return false;

	try {
		const key = getStorageKey(userId);
		localStorage.setItem(key, JSON.stringify(data));
		return true;
	} catch (e) {
		console.error("Failed to save workspace", e);
		return false;
	}
};

export const getStorageUsage = (): string => {
	if (typeof window === "undefined") return "0 KB";
	let total = 0;
	for (const key in localStorage) {
		if (localStorage.hasOwnProperty(key)) {
			total += (localStorage[key].length * 2);
		}
	}
	return (total / 1024).toFixed(2) + " KB";
};
