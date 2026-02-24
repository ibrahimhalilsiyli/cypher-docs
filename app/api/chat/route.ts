export const maxDuration = 30;

const SYSTEM_PROMPT = `Sen CypherDocs adlı bir siber güvenlik eğitim platformunun AI asistanısın. Adın AntiGravity.

Görevin:
- Siber güvenlik sorularını yanıtlamak (Linux, ağ güvenliği, web açıkları, CTF, kriptografi, vs.)
- Platformdaki eğitim modüllerini tanıtmak ve yönlendirmek
- Kısa, net ve teknik ama anlaşılır cevaplar vermek
- Türkçe sorulara Türkçe, İngilizce sorulara İngilizce cevap vermek

Platform modülleri: Linux 101, Network Recon, SQL Injection, XSS, CSRF, LFI, Metasploit, Wireshark, Burp Suite, Hashcat, Cryptography, Malware Analysis ve daha fazlası.

Cevaplarını kısa ve öz tut (kod snippet'i istenmedikçe max 4-5 cümle).`;

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

	let fallbackText = "Şu an yapay zeka servisine ulaşamıyorum. Lütfen birkaç saniye sonra tekrar dene.";
	if (query.match(/(merhaba|selam|hello|hi)/)) {
		fallbackText = "Merhaba! Ben AntiGravity asistanıyım. Siber güvenlik, CTF ve eğitim modülleri hakkında sorularını yanıtlayabilirim.";
	} else if (query.match(/(ctf|cft)/)) {
		fallbackText = "CTF (Capture The Flag), siber güvenlik yarışmalarıdır. Kriptografi, web açıkları, tersine mühendislik gibi beceriler kullanılır. CTF Radar sayfasında aktif yarışmaları takip edebilirsin.";
	} else if (query.match(/(sql|injection)/)) {
		fallbackText = "SQL Injection, veritabanı sorgularına saldırı yapılmasıdır. Korunmak için Prepared Statements şarttır. Training > SQL Injection modülüne bak.";
	} else if (query.match(/(linux|terminal|bash)/)) {
		fallbackText = "Linux, siber güvenliğin temelidir. Training > Linux 101 modülüyle başla.";
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
