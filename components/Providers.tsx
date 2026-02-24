"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./ThemeProvider";
import SessionSync from "./SessionSync";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<SessionSync />
			<ThemeProvider
				attribute="class"
				defaultTheme="dark"
				enableSystem
				disableTransitionOnChange
			>
				{children}
			</ThemeProvider>
		</SessionProvider>
	);
}
