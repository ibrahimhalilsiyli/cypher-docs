# CypherDocs

Siber güvenlik eğitimi ve interaktif dokümantasyon platformu. Linux, ağ güvenliği, web açıkları ve daha fazlasını kapsayan adım adım eğitim modülleri, Kali Linux temalı terminal simülatörü ve AI destekli asistan içerir.

## Özellikler

- 📚 Interaktif siber güvenlik eğitim modülleri (Linux, Ağ, Web Güvenliği)
- 💻 Kali Linux temalı yerleşik terminal simülatörü
- 🤖 Entegre AI asistan (Google Gemini — opsiyonel)
- 🔐 Google OAuth ile kimlik doğrulama (NextAuth)
- 🏆 XP sistemi ve rozet kazanma mekanizması
- 🌙 Karanlık tema, özelleştirilmiş tasarım

## Kurulum

### 1. Repoyu klonla

```bash
git clone https://github.com/KULLANICI_ADIN/cypher-docs.git
cd cypher-docs
```

### 2. Bağımlılıkları yükle

```bash
npm install
```

### 3. Ortam değişkenlerini ayarla

`.env.example` dosyasını kopyalayıp `.env.local` olarak yeniden adlandır:

```bash
cp .env.example .env.local
```

Ardından `.env.local` dosyasını düzenle ve kendi değerlerini gir:

| Değişken | Açıklama | Nereden Alınır |
|---|---|---|
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | [Google Cloud Console](https://console.cloud.google.com/) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret | Google Cloud Console |
| `NEXTAUTH_SECRET` | Rastgele güvenli string | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Uygulamanın URL'si | Lokalde: `http://localhost:3000` |
| `DATABASE_URL` | PostgreSQL bağlantı URL'si | Prisma Postgres veya kendi DB'n |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini AI anahtarı (opsiyonel) | [Google AI Studio](https://aistudio.google.com/app/apikey) |

> **Not:** `GOOGLE_GENERATIVE_AI_API_KEY` olmadan chatbot yine çalışır, sadece offline fallback modda yanıt verir.

### 4. Veritabanını oluştur

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Geliştirme sunucusunu başlat

```bash
npm run dev
```

Tarayıcında [http://localhost:3000](http://localhost:3000) adresini aç.

## Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 15 (App Router) |
| Dil | TypeScript |
| Stil | Tailwind CSS + Framer Motion |
| Auth | NextAuth.js (Google OAuth) |
| Veritabanı | Prisma ORM + PostgreSQL |
| AI | Vercel AI SDK + Google Gemini |

## Katkı

Pull request açabilir, issue oluşturabilirsin. Her türlü katkı hoş gelsin!
