"use client";

import { useEffect, useRef } from "react";

export default function CyberBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let animationFrameId: number;
		let particles: Particle[] = [];
		let mouse = { x: -100, y: -100, radius: 150 };

		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			initParticles();
		};

		class Particle {
			x: number;
			y: number;
			vx: number;
			vy: number;
			size: number;
			baseX: number;
			baseY: number;
			density: number;

			constructor(x: number, y: number) {
				this.x = x;
				this.y = y;
				this.baseX = x;
				this.baseY = y;
				this.vx = (Math.random() - 0.5) * 0.5;
				this.vy = (Math.random() - 0.5) * 0.5;
				this.size = Math.random() * 2 + 1;
				this.density = (Math.random() * 30) + 1;
			}

			draw() {
				if (!ctx) return;
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
				ctx.closePath();
				ctx.fillStyle = "rgba(0, 255, 65, 0.5)"; // Cyber Green
				ctx.fill();
			}

			update() {
				// Mouse interaction
				const dx = mouse.x - this.x;
				const dy = mouse.y - this.y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				const forceDirectionX = dx / distance;
				const forceDirectionY = dy / distance;
				const maxDistance = mouse.radius;
				const force = (maxDistance - distance) / maxDistance;
				const directionX = forceDirectionX * force * this.density;
				const directionY = forceDirectionY * force * this.density;

				if (distance < mouse.radius) {
					// Repel/Disturb effect ("Water droplet" feeling)
					this.x -= directionX;
					this.y -= directionY;
				} else {
					// Return to base flow
					if (this.x !== this.baseX) {
						const dx = this.x - this.baseX;
						this.x -= dx / 10;
					}
					if (this.y !== this.baseY) {
						const dy = this.y - this.baseY;
						this.y -= dy / 10;
					}
				}

				// Constant movement
				this.baseX += this.vx;
				this.baseY += this.vy;

				// Bounce off edges (keep base within screen mostly)
				if (this.baseX < 0 || this.baseX > canvas!.width) this.vx *= -1;
				if (this.baseY < 0 || this.baseY > canvas!.height) this.vy *= -1;

				this.draw();
			}
		}

		const initParticles = () => {
			particles = [];
			const numberOfParticles = (canvas.width * canvas.height) / 9000;
			for (let i = 0; i < numberOfParticles; i++) {
				const x = Math.random() * canvas.width;
				const y = Math.random() * canvas.height;
				particles.push(new Particle(x, y));
			}
		};

		const connect = () => {
			for (let a = 0; a < particles.length; a++) {
				for (let b = a; b < particles.length; b++) {
					const dx = particles[a].x - particles[b].x;
					const dy = particles[a].y - particles[b].y;
					const distance = dx * dx + dy * dy;

					if (distance < (canvas.width / 7) * (canvas.height / 7)) {
						const opacityValue = 1 - (distance / 20000);
						ctx.strokeStyle = `rgba(0, 255, 65, ${opacityValue * 0.2})`;
						ctx.lineWidth = 1;
						ctx.beginPath();
						ctx.moveTo(particles[a].x, particles[a].y);
						ctx.lineTo(particles[b].x, particles[b].y);
						ctx.stroke();
					}
				}
			}
		};

		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			for (let i = 0; i < particles.length; i++) {
				particles[i].update();
			}
			connect();
			animationFrameId = requestAnimationFrame(animate);
		};

		window.addEventListener("resize", resizeCanvas);
		window.addEventListener("mousemove", (e) => {
			mouse.x = e.x;
			mouse.y = e.y;
		});

		// Initialize
		resizeCanvas();
		animate();

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-100"
		/>
	);
}
