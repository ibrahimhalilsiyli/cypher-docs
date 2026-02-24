# CypherDocs

A cybersecurity training and interactive documentation platform. Covers Linux, network security, web vulnerabilities, and more through step-by-step training modules, a Kali Linux-themed terminal simulator, and an AI-powered assistant.

## Features

- 📚 Interactive cybersecurity training modules (Linux, Networking, Web Security)
- 💻 Built-in Kali Linux-style terminal simulator
- 🤖 Integrated AI assistant (Google Gemini — optional)
- 🔐 Google OAuth authentication via NextAuth.js
- 🏆 XP system with badges and rank progression
- 🌙 Dark theme with custom design

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/cypher-docs.git
cd cypher-docs
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example env file and fill in your own values:

```bash
cp .env.example .env.local
```

| Variable | Description | Where to get it |
|---|---|---|
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | [Google Cloud Console](https://console.cloud.google.com/) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret | Google Cloud Console |
| `NEXTAUTH_SECRET` | Random secure string | Run: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | App base URL | Locally: `http://localhost:3000` |
| `DATABASE_URL` | PostgreSQL connection string | Prisma Postgres or your own DB |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini AI key (optional) | [Google AI Studio](https://aistudio.google.com/app/apikey) |

> **Note:** The chatbot works without `GOOGLE_GENERATIVE_AI_API_KEY` — it falls back to an offline rule-based mode.

### 4. Set up the database

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Framer Motion |
| Auth | NextAuth.js (Google OAuth) |
| Database | Prisma ORM + PostgreSQL |
| AI | Vercel AI SDK + Google Gemini |

## Contributing

Pull requests and issues are welcome!
