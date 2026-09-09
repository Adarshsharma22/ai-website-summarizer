# AI Website Summarizer

## 🚀 Live Demo

Try the AI Website Summarizer live:

**🔗 Live Demo:** [coming soon](https://-------/)

> Create an account, paste any publicly accessible webpage URL, and get an AI-generated summary in seconds. Your summaries are automatically saved to your personal history.


## Description

AI Website Summarizer is a full-stack web app that lets a signed-in user paste
any publicly accessible URL and get back a short, grounded AI-generated
summary of that page. Every summary is saved to the user's personal history
in PostgreSQL, so they can revisit or delete past summaries later. Each user
only ever sees their own history.

## Features

- Email/password registration and login with hashed passwords (bcryptjs)
- JWT-based authentication protecting all summary routes
- URL validation (http/https only) and graceful handling of unreachable,
  blocked, or empty pages
- Webpage scraping and content extraction with Cheerio (strips scripts,
  styles, nav/header/footer, normalizes whitespace, caps content length)
- AI summarization via the Groq API (`openai/gpt-oss-20b`), grounded strictly
  in the extracted page content
- Summary history per user, newest first, with delete support
- Copy-to-clipboard on summary cards
- Loading and error states throughout, with duplicate-submit prevention
- Clean, responsive Tailwind UI

## Tech Stack

**Frontend:** React, Vite, JavaScript, Tailwind CSS, Axios, React Router DOM
**Backend:** Node.js, Express, JavaScript, Axios, Cheerio, JWT, bcryptjs
**Database:** PostgreSQL with Prisma ORM
**AI:** Groq API (OpenAI-compatible), model `openai/gpt-oss-20b`

## Architecture

```
React
 ↓
Express
 ↓
Scraper (Cheerio)
 ↓
Groq (AI summarization)
 ↓
PostgreSQL (Prisma)
```

Backend code is layered as `routes → controllers → services → database /
external APIs`, keeping the AI logic (`services/ai.js`) and scraping logic
(`services/scraper.js`) out of the route handlers.

## AI Usage

1. The user submits a URL from the React frontend.
2. The backend validates the URL and fetches the page with Axios.
3. Cheerio extracts the page title and readable text, stripping
   scripts/styles/nav/header/footer and normalizing whitespace.
4. The extracted content (capped in length) is sent to Groq along with a
   system prompt instructing the model to summarize only what's present in
   the content, in plain language, with 3–5 bullet points.
5. Groq returns a short summary.
6. The summary is stored in PostgreSQL, linked to the authenticated user.
7. The summary is returned to the frontend and displayed in a card.

> The Groq API key is stored server-side using environment variables and is
> never exposed to the frontend.

## Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd ai-website-summarizer
```

### 2. Set up PostgreSQL

Create a database, e.g. with `psql`:

```sql
CREATE DATABASE ai_summarizer;
```

Or use a hosted Postgres provider (Neon, Supabase, Railway, etc.) and copy
its connection string.

### 3. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Fill in `server/.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ai_summarizer
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=some_long_random_string
PORT=5000
CLIENT_URL=http://localhost:5173
```

Run the Prisma migration to create the tables:

```bash
npx prisma migrate dev --name init
```

Start the backend:

```bash
npm run dev
```

### 4. Get a Groq API key

Sign up at [console.groq.com](https://console.groq.com), create an API key,
and paste it into `GROQ_API_KEY` in `server/.env`. Groq's free tier is
sufficient for this project.

### 5. Frontend setup

```bash
cd ../client
npm install
cp .env.example .env
```

`client/.env` should point at your backend:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Visit `http://localhost:5173`.

## API Documentation

### `POST /api/auth/register`
Body: `{ "name": "...", "email": "...", "password": "..." }`
Returns: `{ "token": "...", "user": { "id", "name", "email" } }`

### `POST /api/auth/login`
Body: `{ "email": "...", "password": "..." }`
Returns: `{ "token": "...", "user": { "id", "name", "email" } }`

### `POST /api/summaries` *(requires `Authorization: Bearer <token>`)*
Body: `{ "url": "https://example.com/article" }`
Returns the created summary: `{ "id", "url", "title", "summary", "createdAt", "userId" }`

### `GET /api/summaries` *(requires auth)*
Returns the authenticated user's summaries, newest first.

### `DELETE /api/summaries/:id` *(requires auth)*
Deletes a summary owned by the authenticated user. Returns 404 if it belongs
to someone else or doesn't exist.

## Limitations

- Only works on publicly accessible HTML pages.
- Some websites block automated requests (returns a clear error instead of
  failing silently).
- JavaScript-heavy single-page apps may not expose useful HTML to a plain
  HTTP fetch.
- AI usage is subject to Groq free-tier rate limits.
- Very large pages are truncated before being sent to the AI model.

## Future Improvements

- Better article extraction (e.g. Readability-style heuristics)
- Background job queue for summarization instead of a synchronous request
- Rate limiting per user/IP
- Redis caching for repeated URLs
- Multiple summary lengths (short/medium/detailed)
- PDF summarization
- Browser extension
- Streaming AI responses
