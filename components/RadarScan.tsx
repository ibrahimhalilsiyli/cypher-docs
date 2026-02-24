"use client";

import { motion } from "framer-motion";

interface RadarScanProps {
	activeCount: number;
	upcomingCount: number;
}

export default function RadarScan({ activeCount, upcomingCount }: RadarScanProps) {
	return (
		<div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
			{/* Outer Ring */}
			<div className="absolute inset-0 rounded-full border border-primary/20 bg-primary/5" />

			{/* Inner Rings */}
			<div className="absolute inset-8 rounded-full border border-primary/20" />
			<div className="absolute inset-16 rounded-full border border-primary/10" />
			<div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_#00f3ff]" />

			{/* Crosshairs */}
			<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
				<div className="w-full h-[1px] bg-primary/20" />
				<div className="h-full w-[1px] bg-primary/20 absolute" />
			</div>

			{/* Scanner Line Animation */}
			<motion.div
				className="absolute inset-0 rounded-full origin-center"
				style={{
					background: "conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(0, 243, 255, 0.2) 360deg)"
				}}
				animate={{ rotate: 360 }}
				transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
			/>

			{/* Blips (Randomized visually) */}
			{Array.from({ length: activeCount }).map((_, i) => (
				<motion.div
					key={`active-${i}`}
					className="absolute w-3 h-3 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"
					initial={{ opacity: 0 }}
					animate={{
						opacity: [0, 1, 0],
						scale: [0.5, 1.5, 0.5]
					}}
					transition={{
						duration: 2,
						repeat: Infinity,
						delay: i * 0.5
					}}
					style={{
						top: `${20 + Math.random() * 60}%`,
						left: `${20 + Math.random() * 60}%`
					}}
				/>
			))}

			{Array.from({ length: upcomingCount }).map((_, i) => (
				<motion.div
					key={`upcoming-${i}`}
					className="absolute w-2 h-2 bg-yellow-500 rounded-full shadow-[0_0_5px_#eab308]"
					initial={{ opacity: 0 }}
					animate={{ opacity: [0, 0.8, 0] }}
					transition={{
						duration: 3,
						repeat: Infinity,
						delay: i * 0.7
					}}
					style={{
						top: `${10 + Math.random() * 80}%`,
						left: `${10 + Math.random() * 80}%`
					}}
				/>
			))}
		</div>
	);
}
