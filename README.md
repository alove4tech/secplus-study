# Security+ Study Hub

Next.js app for CompTIA Security+ (SY0-701) exam prep.

## What it does

- Flashcards by domain
- Practice exams with randomized questions
- Domain filtering
- Dark mode
- PBQ scenario practice

## Getting started

### Docker

```bash
git clone https://github.com/alove4tech/secplus-study.git
cd secplus-study
cp .env.example .env
docker compose up -d --build
```

Opens on `http://localhost:3001`.

### Local dev

```bash
npm install
npm run dev
```

Runs on `http://localhost:3000`.

## Domains covered

1. General Security Concepts (12%)
2. Threats, Vulnerabilities, and Mitigations (22%)
3. Security Architecture (18%)
4. Security Operations (28%)
5. Security Program Management and Oversight (20%)

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Node 22 Alpine

## Config

Edit `.env` — just `NODE_ENV` and `PORT`, nothing fancy.

## Deployment

Tuned for N100 mini PC (1 CPU, 512MB RAM). Adjust docker-compose.yml if you have more headroom.

For reverse proxy: point at port 3001, no WebSocket needed.

```bash
docker compose logs -f secplus-study
docker compose restart
docker compose pull && docker compose up -d --build
```

## Roadmap

- [ ] Local storage progress tracking
- [ ] Performance stats
- [ ] Weak topic bookmarks
- [ ] More questions
- [ ] Better mobile layout

## License

MIT
