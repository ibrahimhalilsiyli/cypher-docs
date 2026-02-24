"use client";

import { useState, useEffect } from "react";
import { Flag, Calendar, Trophy, Users, Globe, ExternalLink, Timer, Filter, Star, Crosshair, Target } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import RadarScan from "@/components/RadarScan";
import { toast } from "sonner";
import clsx from "clsx";

interface CTFEvent {
	id: string;
	name: string;
	organizer: string;
	format: "Jeopardy" | "Attack-Defense" | "Mixed";
	weight: number;
	start: string;
	description: string;
	url: string;
	participants: number;
	status: "Active" | "Upcoming" | "Archived";
	logo?: string;
}

const MOCK_EVENTS: CTFEvent[] = []; // Cleared, now using real data

export default function CTFRadarPage() {
	const [filter, setFilter] = useState<{ status: string | "all", format: string | "all" }>({ status: "all", format: "all" });
	const [events, setEvents] = useState<CTFEvent[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [now, setNow] = useState(new Date());
	const [trackedEvents, setTrackedEvents] = useState<string[]>([]);
	const [userId, setUserId] = useState<string | null>(null);

	// Initialize & Load Data
	useEffect(() => {
		// Clock
		const timer = setInterval(() => setNow(new Date()), 1000);

		// Auth & Storage
		const currentUserId = localStorage.getItem("cypher_auth");
		setUserId(currentUserId);

		if (currentUserId) {
			const saved = JSON.parse(localStorage.getItem(`cypher_ctf_tracking_${currentUserId}`) || "[]");
			setTrackedEvents(saved);
		}

		// Fetch Real Data
		const fetchEvents = async () => {
			try {
				const res = await fetch("/api/ctftime");
				if (!res.ok) throw new Error("Network response was not ok");
				const data = await res.json();

				// Transform API data to our interface
				const mappedEvents: CTFEvent[] = data.map((e: any) => {
					const startDate = new Date(e.start);
					const finishDate = new Date(e.finish);
					const now = new Date();

					let status: "Active" | "Upcoming" | "Archived" = "Upcoming";
					if (now >= startDate && now <= finishDate) status = "Active";
					if (now > finishDate) status = "Archived";

					// Normalize Format
					let format: "Jeopardy" | "Attack-Defense" | "Mixed" = "Jeopardy";
					if (e.format.includes("Attack")) format = "Attack-Defense";
					if (e.format.includes("Mixed")) format = "Mixed";

					return {
						id: e.id.toString(),
						name: e.title,
						organizer: e.organizers[0]?.name || "Unknown",
						format: format,
						weight: e.weight,
						start: e.start,
						description: e.description || "No description provided.",
						url: e.url,
						participants: e.participants || 0, // API might not verify this consistently
						status: status,
						logo: e.logo
					};
				});

				// Sort: Active first, then by start date
				mappedEvents.sort((a, b) => {
					if (a.status === "Active" && b.status !== "Active") return -1;
					if (b.status === "Active" && a.status !== "Active") return 1;
					return new Date(a.start).getTime() - new Date(b.start).getTime();
				});

				setEvents(mappedEvents);
			} catch (err) {
				console.error("Failed to load CTF data", err);
				toast.error("Failed to connect to Global CTF Network. Using cache/simulation.");
				// Fallback or retry logic could go here
				setEvents(MOCK_EVENTS);
			} finally {
				setIsLoading(false);
			}
		};

		fetchEvents();

		return () => clearInterval(timer);
	}, []);

	// Save Tracking
	useEffect(() => {
		if (userId) {
			localStorage.setItem(`cypher_ctf_tracking_${userId}`, JSON.stringify(trackedEvents));
		}
	}, [trackedEvents, userId]);

	const toggleTrack = (id: string) => {
		if (!userId) {
			toast.error("Authentication required to track events.");
			return;
		}
		if (trackedEvents.includes(id)) {
			setTrackedEvents(prev => prev.filter(e => e !== id));
			toast.info("Event untracked");
		} else {
			setTrackedEvents(prev => [...prev, id]);
			toast.success("Event added to mission log");
		}
	};

	const filteredEvents = events.filter(e => {
		if (filter.status !== "all" && e.status !== filter.status) return false;
		if (filter.format !== "all" && e.format !== filter.format) return false;
		return true;
	});

	const formatCountdown = (dateString: string) => {
		const target = new Date(dateString).getTime();
		const diff = target - now.getTime();

		if (diff <= 0) return "Started";

		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

		return `${days}D ${hours}H ${minutes}M`;
	};

	return (
		<div className="min-h-screen bg-background text-text font-mono flex flex-col">
			<header className="border-b border-border bg-surface/50 backdrop-blur-md sticky top-0 z-10">
				<div className="container mx-auto px-4 h-16 flex items-center justify-between">
					<div className="flex items-center gap-2 text-primary">
						<Crosshair size={24} className="animate-spin-slow" />
						<h1 className="text-xl font-bold tracking-tighter">CTF_RADAR_v2.0</h1>
					</div>
					{isLoading && <div className="text-xs text-primary animate-pulse">ESTABLISHING UPLINK...</div>}
				</div>
			</header>

			<main className="flex-1 container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

					{/* LEFT COLUMN - Event List */}
					<div className="lg:col-span-2 space-y-6">
						{/* Filters */}
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface p-4 rounded-lg border border-border">
							<div className="flex items-center gap-2 text-text-muted">
								<Filter size={16} />
								<span className="text-sm font-bold uppercase">Signal Filters</span>
							</div>
							<div className="flex gap-2 w-full sm:w-auto">
								<select
									className="flex-1 appearance-none bg-black/30 border border-border rounded px-3 py-1.5 focus:outline-none focus:border-primary text-sm transition-colors"
									value={filter.status}
									onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
								>
									<option value="all">Status: All</option>
									<option value="Active">Operational</option>
									<option value="Upcoming">Inbound</option>
									<option value="Archived">Decommissioned</option>
								</select>
								<select
									className="flex-1 appearance-none bg-black/30 border border-border rounded px-3 py-1.5 focus:outline-none focus:border-primary text-sm transition-colors"
									value={filter.format}
									onChange={(e) => setFilter(prev => ({ ...prev, format: e.target.value }))}
								>
									<option value="all">Format: All</option>
									<option value="Jeopardy">Jeopardy</option>
									<option value="Attack-Defense">A/D</option>
								</select>
							</div>
						</div>

						{/* Events Grid */}
						<AnimatePresence mode="popLayout">
							{isLoading ? (
								// Skeleton Loader
								[...Array(3)].map((_, i) => (
									<div key={i} className="bg-surface border border-border rounded-lg p-5 animate-pulse h-40" />
								))
							) : filteredEvents.length === 0 ? (
								<div className="text-center py-12 text-zinc-500 border border-dashed border-border rounded">
									No signals detected matching current filters.
								</div>
							) : (
								filteredEvents.map((event) => (
									<motion.div
										layout
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, scale: 0.95 }}
										key={event.id}
										className={clsx(
											"group bg-surface border rounded-lg p-5 transition-all hover:bg-surface/80 relative overflow-hidden",
											event.status === "Active" ? "border-primary/40 shadow-[0_0_15px_rgba(0,243,255,0.05)]" : "border-border"
										)}
									>
										{/* Active Pulse */}
										{event.status === "Active" && (
											<div className="absolute top-0 left-0 w-1 h-full bg-primary animate-pulse" />
										)}

										<div className="flex flex-col md:flex-row gap-4 md:gap-6">
											{/* Date / Status Box */}
											<div className="w-full md:w-24 shrink-0 flex flex-row md:flex-col items-center justify-between md:justify-center bg-black/20 rounded border border-white/5 p-3 md:p-2">
												<div className="flex flex-row md:flex-col items-center gap-2 md:gap-0">
													<div className="text-xs text-text-muted uppercase md:mb-1">{new Date(event.start).toLocaleString('default', { month: 'short' })}</div>
													<div className="text-xl md:text-2xl font-bold text-white">{new Date(event.start).getDate()}</div>
												</div>
												<div className={clsx(
													"text-[10px] px-2 py-1 rounded font-bold uppercase w-auto md:w-full text-center",
													event.status === "Active" ? "bg-green-500/20 text-green-500" :
														event.status === "Upcoming" ? "bg-yellow-500/20 text-yellow-500" : "bg-zinc-500/20 text-zinc-500"
												)}>
													{event.status}
												</div>
											</div>

											<div className="flex-1 min-w-0">
												<div className="flex justify-between items-start gap-4">
													<h3 className="text-lg md:text-xl font-bold text-white group-hover:text-primary transition-colors cursor-pointer flex items-center gap-2 truncate">
														{event.format === "Jeopardy" ? <Flag size={16} /> :
															event.format === "Attack-Defense" ? <Trophy size={16} /> :
																<Globe size={16} />}
														{event.name}
													</h3>

													{/* Track Button */}
													<button
														onClick={() => toggleTrack(event.id)}
														className={clsx(
															"p-2 rounded-full hover:bg-white/10 transition-colors",
															trackedEvents.includes(event.id) ? "text-yellow-400" : "text-text-muted"
														)}
													>
														<Star size={18} fill={trackedEvents.includes(event.id) ? "currentColor" : "none"} />
													</button>
												</div>

												<div className="flex flex-wrap gap-4 text-xs text-text-muted mt-2 mb-3">
													<span className="flex items-center gap-1"><Users size={12} /> {event.participants > 0 ? event.participants.toLocaleString() : "Unknown"} Ops</span>
													<span className="flex items-center gap-1"><Globe size={12} /> {event.organizer}</span>
													<span className="flex items-center gap-1 text-accent"><Trophy size={12} /> {event.weight} pts</span>
												</div>

												<p className="text-sm text-text-muted/80 line-clamp-2">{event.description}</p>
											</div>

											{/* Action */}
											<div className="flex flex-col justify-center items-end gap-2">
												{event.status === "Upcoming" && (
													<div className="text-xs font-mono text-primary bg-primary/5 px-2 py-1 rounded border border-primary/20">
														T-{formatCountdown(event.start)}
													</div>
												)}
												<Link
													href={event.url}
													target="_blank"
													className="text-xs font-bold text-text hover:text-white flex items-center gap-1 px-3 py-2 bg-white/5 hover:bg-white/10 rounded transition-colors"
												>
													INTEL <ExternalLink size={12} />
												</Link>
											</div>
										</div>
									</motion.div>
								)))}
						</AnimatePresence>
					</div>

					{/* RIGHT COLUMN - Radar & Mission Log */}
					<div className="space-y-6">
						{/* Radar Visualization */}
						<div className="bg-surface border border-border rounded-lg p-6 flex flex-col items-center justify-center relative overflow-hidden">
							<div className="absolute inset-0 bg-black/40 z-0" />
							<div className="relative z-10 w-full flex flex-col items-center">
								<h3 className="text-sm font-bold text-primary mb-4 self-start flex items-center gap-2">
									<Target size={16} /> LIVE_SIGNALS
								</h3>

								<RadarScan
									activeCount={events.filter(e => e.status === "Active").length}
									upcomingCount={events.filter(e => e.status === "Upcoming").length}
								/>

								<div className="grid grid-cols-2 gap-4 w-full mt-6">
									<div className="text-center p-2 bg-black/20 rounded border border-white/5">
										<div className="text-2xl font-bold text-green-500">{events.filter(e => e.status === "Active").length}</div>
										<div className="text-[10px] text-text-muted uppercase">Active Ops</div>
									</div>
									<div className="text-center p-2 bg-black/20 rounded border border-white/5">
										<div className="text-2xl font-bold text-yellow-500">{events.filter(e => e.status === "Upcoming").length}</div>
										<div className="text-[10px] text-text-muted uppercase">Inbound</div>
									</div>
								</div>
							</div>
						</div>

						{/* Mission Log (Tracked) */}
						<div className="bg-surface border border-border rounded-lg p-6">
							<h3 className="text-sm font-bold text-text mb-4 flex items-center gap-2">
								<Star size={16} className="text-yellow-400" /> MISSION_LOG
							</h3>

							{trackedEvents.length === 0 ? (
								<div className="text-center py-8 border border-dashed border-border rounded bg-black/20">
									<p className="text-xs text-text-muted mb-2">No operations tracked.</p>
									<p className="text-[10px] text-text-muted/60">Mark events to track status.</p>
								</div>
							) : (
								<div className="space-y-3">
									{events.filter(e => trackedEvents.includes(e.id)).map(event => (
										<div key={event.id} className="p-3 bg-black/20 border border-border rounded flex justify-between items-center group">
											<div>
												<div className="font-bold text-sm text-text group-hover:text-primary transition-colors line-clamp-1">{event.name}</div>
												<div className="text-[10px] text-text-muted">
													{event.status === "Active" ? "LIVE NOW" : `Starts ${new Date(event.start).toLocaleDateString()}`}
												</div>
											</div>
											<button
												onClick={() => toggleTrack(event.id)}
												className="text-text-muted hover:text-red-500 transition-colors"
											>
												<Target size={14} />
											</button>
										</div>
									))}
									{/* Handle loaded events that might not be in the current fetch window but are tracked (advanced enhancement) */}
								</div>
							)}
						</div>
					</div>

				</div>
			</main>
		</div>
	);
}
