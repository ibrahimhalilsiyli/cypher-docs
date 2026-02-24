import { NextResponse } from 'next/server';

export async function GET() {
	// Current time in seconds (CTFTime uses Unix timestamp)
	const now = Math.floor(Date.now() / 1000);
	// Get events for the next 3 months
	const end = now + 3600 * 24 * 90;
	const limit = 50;

	const url = `https://ctftime.org/api/v1/events/?limit=${limit}&start=${now}&finish=${end}`;

	try {
		const res = await fetch(url, {
			headers: {
				// CTFTime requires a user agent
				'User-Agent': 'Mozilla/5.0 (compatible; CypherDocs/1.0; +https://github.com/cypher-docs)'
			},
			next: { revalidate: 3600 } // Cache data for 1 hour to be polite to their API
		});

		if (!res.ok) {
			console.error("CTFTime API Error:", res.status, res.statusText);
			throw new Error(`CTFTime API responded with ${res.status}`);
		}

		const data = await res.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Failed to fetch CTF events:", error);
		return NextResponse.json({ error: 'Failed to connect to CTFTime Global Network' }, { status: 500 });
	}
}
