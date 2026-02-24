import { google } from "@ai-sdk/google";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages } = await req.json();

	const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

	if (apiKey) {
		try {
			const result = await streamText({
				model: google("gemini-1.5-flash"),
				system: `You are AntiGravity, a helpful AI assistant for a cybersecurity training platform called CypherDocs.
        Your tone should be professional, encouraging, and slightly technical but accessible.
        You can help users with:
        - Navigating the website (Training, Docs, Tools).
        - Explaining cybersecurity concepts (Linux, Networking, Web Vulnerabilities).
        - Providing short code snippets (HTML, CSS, Python, Bash).
        - Site management advice (Widgets, Themes, Layouts).
        Keep responses concise (max 3-4 sentences unless a code snippet is requested).`,
				messages: messages.map((m: any) => ({
					role: m.role,
					content: m.content,
				})),
			});

			return result.toDataStreamResponse();
		} catch (error) {
			console.error("Chat API error:", error);
		}
	}

	// Offline fallback — rule-based responses when the API key is unavailable
	const lastMessage = messages[messages.length - 1];
	const query = lastMessage.content.toLowerCase();
	let responseText = "Emin değilim, ama dokümantasyon sayfamızda aradığını bulabilirsin.";

	if (query.match(/\b(merhaba|selam|nasılsın|kimsin|nedir)\b/)) {
		const responses = [
			"Merhaba! Ben AntiGravity asistanıyım. Web sitesi yönetimi ve siber güvenlik konularında size yardımcı olabilirim.",
			"Selamlar! Size nasıl destek olabilirim? Tasarım, güvenlik veya kodlama hakkında soru sorabilirsiniz.",
			"Merhaba, ben buradayım! Site düzeni veya siber güvenlik dersleri hakkında merak ettiklerinizi cevaplayabilirim."
		];
		responseText = responses[Math.floor(Math.random() * responses.length)];
	} else if (query.match(/\b(tasarım|düzen|widget|renk|tema|görünüm|logo|font)\b/)) {
		if (query.includes("widget")) responseText = "Widget eklemek için yönetim panelinden 'Bileşenler' sekmesine gidin. Oradan sürükle-bırak yöntemiyle istediğiniz widget'ı sayfanıza ekleyebilirsiniz.";
		else if (query.includes("renk") || query.includes("tema")) responseText = "Tema renklerini 'Görünüm > Özelleştir' menüsünden değiştirebilirsiniz. CSS ile daha detaylı kontrol için Custom Code alanını kullanın.";
		else responseText = "Web sitesi tasarımı, kullanıcı deneyimini doğrudan etkiler. Modern, temiz ve mobil uyumlu bir düzen tercih etmelisiniz.";
	} else if (query.match(/\b(siber|güvenlik|hack|zafiyet|linux|ağ|network|sql|xss|csrf|burp|nmap)\b/)) {
		if (query.includes("linux")) responseText = "Linux, siber güvenlikçilerin ana işletim sistemidir. Terminal komutlarını öğrenmek için 'Linux 101' eğitim modülümüzü tamamlamanızı öneririm.";
		else if (query.includes("sql")) responseText = "SQL Injection, veritabanı sorgularına müdahale edilmesini sağlar. Korunmak için 'Prepared Statements' ve girdi doğrulama kullanmalısınız.";
		else if (query.includes("xss")) responseText = "XSS (Cross-Site Scripting), saldırganın tarayıcıda kod çalıştırmasına neden olur. Girdi temizleme (sanitization) ve CSP kullanımı kritiktir.";
		else responseText = "Siber güvenlik geniş bir alandır. Başlangıç için Temel Linux ve Ağ Güvenliği modüllerimizi inceleyebilirsin. Etik kurallara bağlı kalmayı unutma!";
	} else if (query.match(/\b(kod|snippet|html|css|js|javascript|python|yazılım)\b/)) {
		if (query.includes("html") || query.includes("buton")) responseText = "Örnek Buton Kodu:\n`<button class='my-btn'>Tıkla</button>`\nBunu Custom Code alanına ekleyip CSS ile stil verebilirsin.";
		else if (query.includes("css") || query.includes("stil")) responseText = "Örnek CSS:\n`.my-img { border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }`\nBu kod görsellere modern bir görünüm kazandırır.";
		else if (query.includes("python")) responseText = "Python Port Tarama (Basit):\n`import socket`\n`s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)`\n`s.connect(('127.0.0.1', 80))`\nBu kodu sadece izinli sistemlerde kullan!";
		else responseText = "Kod yazarken temiz ve anlaşılır olmaya özen gösterin. İhtiyacınız olan dilde (HTML, CSS, Python) size örnek snippet'ler verebilirim.";
	} else {
		const fallbacks = [
			"Bu konuda emin değilim, ama dokümantasyon sayfamızda aradığınız cevabı bulabilirsiniz.",
			"İlginç bir soru! Şu an veritabanımda bununla ilgili net bir bilgi yok, ancak siber güvenlik veya site tasarımı hakkında başka sorularını yanıtlayabilirim.",
			"Bunu daha farklı bir şekilde sorabilir misin? Belki soruyu 'tasarım' veya 'güvenlik' bağlamında detaylandırırsan yardımcı olabilirim.",
			"Anlaşıldı. Bu konuyla ilgili daha fazla detay verebilir misin? Özellikle neyi öğrenmek istiyorsun?"
		];
		responseText = fallbacks[Math.floor(Math.random() * fallbacks.length)];
	}

	// Stream the fallback response character-by-character to match the Vercel AI SDK data stream protocol
	const encoder = new TextEncoder();
	const customStream = new ReadableStream({
		async start(controller) {
			const chars = responseText.split("");

			for (const char of chars) {
				const part = `0:${JSON.stringify(char)}\n`;
				controller.enqueue(encoder.encode(part));
				await new Promise((resolve) => setTimeout(resolve, 15 + Math.random() * 30));
			}
			controller.close();
		},
	});

	return new Response(customStream, {
		headers: { "Content-Type": "text/plain; charset=utf-8", "X-Vercel-AI-Data-Stream": "v1" },
	});
}
