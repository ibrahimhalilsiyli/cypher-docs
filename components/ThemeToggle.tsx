"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Avoid hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<button
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			className="relative flex items-center justify-center p-2 rounded-lg bg-surface/50 border border-border hover:border-primary/50 hover:bg-surface transition-all duration-300 group overflow-hidden"
			title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
		>
			<div className="relative z-10 w-5 h-5 flex items-center justify-center">
				<Sun className="absolute w-5 h-5 rotate-0 scale-100 transition-all duration-500 dark:-rotate-180 dark:scale-0 text-orange-500" />
				<Moon className="absolute w-5 h-5 rotate-180 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 text-blue-400" />
			</div>
			<span className="sr-only">Toggle theme</span>
			<div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
		</button>
	);
}
