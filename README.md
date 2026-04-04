# Security+ Study Hub

Next.js app for CompTIA Security+ (SY0-701) exam prep.

## What it does

- Flashcards by domain
- Practice exams with randomized questions
- Domain filtering
- Dark mode
- PBQ scenario practice

## Getting started

## Architecture support

The app is designed to run on both:

- `amd64` / x86_64
- `arm64`

Current stack notes:

- plain Next.js + React app
- no known native module dependencies that should block multi-arch builds today
- Docker uses official multi-arch Node 22 images

That means it should be usable on both standard x86 hosts and ARM64 systems like Ampere, Raspberry Pi-class devices with enough resources, or ARM VPS instances.

### Docker

```bash
git clone https://github.com/alove4tech/secplus-study.git
cd secplus-study
cp .env.example .env
docker compose up -d --build
```

Opens on `http://localhost:3001`.

To force a specific image target when needed:

```bash
DOCKER_PLATFORM=linux/arm64 docker compose up -d --build
```

or:

```bash
DOCKER_PLATFORM=linux/amd64 docker compose up -d --build
```

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

## Portability notes

- Dockerfile uses a multi-stage build with Next.js standalone output
- runtime image is kept small and architecture-neutral
- if native dependencies are added later, ARM64 compatibility should be re-verified

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
