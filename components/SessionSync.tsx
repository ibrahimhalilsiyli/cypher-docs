"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "sonner";

export default function SessionSync() {
	const { data: session } = useSession();

	useEffect(() => {
		if (session?.user?.email) {
			// 1. Get existing users
			const users = JSON.parse(localStorage.getItem("cypher_users") || "{}");
			const email = session.user.email;

			// 2. Check if user exists
			if (!users[email]) {
				// Create new Google user
				const userId = "google_" + crypto.randomUUID();
				users[email] = {
					id: userId,
					email: email,
					codename: session.user.name || "Operative",
					team: "Intel", // Default for Google users
					joinedAt: Date.now(),
					provider: "google",
					avatar: session.user.image
				};
				localStorage.setItem("cypher_users", JSON.stringify(users));
				toast.success("New Operative Profile Created");
			}

			// 3. Sync Auth State
			const currentUser = users[email];
			const currentAuth = localStorage.getItem("cypher_auth");

			if (currentAuth !== currentUser.id) {
				console.log("[SocialAuth] Syncing session to LocalStorage...");
				localStorage.setItem("cypher_auth", currentUser.id);
				window.dispatchEvent(new Event("auth-change"));
				toast.success("Session Synchronized");
			}
		}
	}, [session]);

	return null; // Invisible component
}
