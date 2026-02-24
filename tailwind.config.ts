import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: "#0d1117", // Github/Terminal Dark
				surface: "#161b22", // Slightly lighter card bg
				primary: {
					DEFAULT: "#00f3ff", // Neon Cyan
					foreground: "#000000",
					hover: "#00d7e6", // Slightly darker neon
				},
				secondary: {
					DEFAULT: "#1f6feb", // Standard Link/Action Blue
					foreground: "#ffffff",
				},
				accent: {
					DEFAULT: "#a371f7", // Purple for special items
				},
				text: {
					DEFAULT: "#c9d1d9",
					muted: "#8b949e",
				},
				border: "#30363d",
			},
			fontFamily: {
				sans: ["var(--font-inter)"],
				mono: ["var(--font-jetbrains-mono)"],
			},
			backgroundImage: {
				"grid-pattern": "linear-gradient(to right, #21262d 1px, transparent 1px), linear-gradient(to bottom, #21262d 1px, transparent 1px)",
			},
		},
	},
	plugins: [],
};
export default config;
