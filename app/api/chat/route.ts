export const maxDuration = 30;

const SYSTEM_PROMPT = `You are the AI assistant for CypherDocs, a cybersecurity training and interactive documentation platform. Your name is AntiGravity.

Your mission:
- Answer cybersecurity-related questions (Linux, networking, web vulnerabilities, CTF, cryptography, etc.)
- Introduce and guide users through platform training modules.
- Provide crisp, technical yet understandable answers.
- Always respond in English unless the user specifically asks otherwise.

Platform Modules: Linux 101, Network Recon, SQL Injection, XSS, CSRF, LFI, Metasploit, Wireshark, Burp Suite, Hashcat, Cryptography, Malware Analysis, and more.

Keep answers concise (max 4-5 sentences unless code snippets are requested).`;

export async function POST(req: Request) {
	const { messages } = await req.json();

	const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

	if (apiKey) {
		try {
			// Direct Gemini REST API call - bypasses SDK version issues
			const geminiMessages = messages.map((m: { role: string; content: string }) => ({
				role: m.role === "assistant" ? "model" : "user",
				parts: [{ text: m.content }],
			}));

			const response = await fetch(
				`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
						contents: geminiMessages,
						generationConfig: { maxOutputTokens: 512 },
					}),
				}
			);

			if (!response.ok) {
				const errText = await response.text();
				console.error("Gemini API error:", errText);
				throw new Error(`Gemini error: ${response.status}`);
			}

			// Stream the SSE response — parse "data: {...}" lines and forward text chunks
			const encoder = new TextEncoder();
			const readable = new ReadableStream({
				async start(controller) {
					const reader = response.body?.getReader();
					const decoder = new TextDecoder();
					if (!reader) { controller.close(); return; }

					let buffer = "";
					while (true) {
						const { done, value } = await reader.read();
						if (done) break;

						buffer += decoder.decode(value, { stream: true });
						const lines = buffer.split("\n");
						buffer = lines.pop() ?? "";

						for (const line of lines) {
							if (!line.startsWith("data: ")) continue;
							const json = line.slice(6).trim();
							if (json === "[DONE]") continue;
							try {
								const parsed = JSON.parse(json);
								const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
								if (text) {
									// Encode as plain text
									controller.enqueue(encoder.encode(text));
								}
							} catch { /* skip malformed */ }
						}
					}
					controller.close();
				},
			});

			return new Response(readable, {
				headers: { "Content-Type": "text/plain; charset=utf-8" },
			});
		} catch (error) {
			console.error("Chat API error:", error);
			// Fall through to offline fallback
		}
	}

	// Offline fallback
	const lastMessage = messages[messages.length - 1];
	const query = (lastMessage?.content || "").toLowerCase();

	let fallbackText = "I'm currently unable to reach the AI service. Please try again in 5 seconds.";
	if (query.match(/(merhaba|selam|hello|hi)/)) {
		fallbackText = "Hello! I'm your AntiGravity assistant. I can help you with cybersecurity, CTFs, and training modules.";
	} else if (query.match(/(ctf|cft)/)) {
		fallbackText = "CTF (Capture The Flag) are cybersecurity competitions focusing on skills like cryptography, web security, and reverse engineering. Check the CTF Radar page for active events.";
	} else if (query.match(/(sql|injection)/)) {
		fallbackText = "SQL Injection is an attack that targets database queries. Using Prepared Statements is the primary defense. Check out the Training > SQL Injection module.";
	} else if (query.match(/(linux|terminal|bash)/)) {
		fallbackText = "Linux is the foundation of cybersecurity. Start with the Training > Linux 101 module.";
	}

	const encoder = new TextEncoder();
	const customStream = new ReadableStream({
		async start(controller) {
			controller.enqueue(encoder.encode(fallbackText));
			controller.close();
		},
	});

	return new Response(customStream, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
}
