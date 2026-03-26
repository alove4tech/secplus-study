# 📚 Security+ Study Hub

A standalone Next.js application for CompTIA Security+ (SY0-701) exam preparation.

## 🎯 Features

- **Flashcards** - Review key exam concepts by domain
- **Practice Exams** - Multiple-choice questions with detailed explanations
- **Domain Filtering** - Focus on specific Security+ domains
- **Dark UI** - Optimized for long study sessions
- **PBQ Scenarios** - Performance-based question practice

## 📋 Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone the repo
git clone https://github.com/alove4tech/secplus-study.git
cd secplus-study

# Create environment file
cp .env.example .env

# Build and run
docker compose up -d --build
```

Access at: `http://localhost:3001`

### Option 2: Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Access at: <http://localhost:3000>

## 📚 Security+ Domains Covered

1. **General Security Concepts** (12%) - Core principles, security controls, resilience, identity fundamentals
2. **Threats, Vulnerabilities, and Mitigations** (22%) - Threat actors, attacks, weaknesses, social engineering
3. **Security Architecture** (18%) - Secure design across networks, systems, cloud, applications
4. **Security Operations** (28%) - Monitoring, response, hardening, recovery, scanning, logging
5. **Security Program Management and Oversight** (20%) - Governance, risk, training, policy, compliance

## 🏗️ Tech Stack

- **Framework**: Next.js 16 + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom components with lucide-react icons
- **Runtime**: Node.js 22 (Alpine for Docker)

## 🚀 Deployment

### Production Deployment

```bash
# Build the Docker image
docker compose build

# Run in production mode
docker compose up -d
```

### Reverse Proxy Setup

Configure with your reverse proxy (e.g., Pangolin, Traefik, Nginx):
- **Domain**: `secplus.yourdomain.com`
- **Port**: `3001`
- **WebSocket**: Not required (no real-time features)

### N100 Mini PC Configuration

The app is optimized for resource-constrained environments:
- **CPU**: 1 core limit
- **Memory**: 512MB RAM (can increase if needed)
- **Storage**: ~200MB for Docker image

## 📝 Configuration

Edit `.env` to customize:

```bash
# Node environment
NODE_ENV=production

# Application port
PORT=3000
```

## 🔧 Management

### View logs
```bash
docker compose logs -f secplus-study
```

### Restart service
```bash
docker compose restart secplus-study
```

### Update to latest
```bash
docker compose pull
docker compose up -d --build
```

### Stop service
```bash
docker compose down
```

## 🤖 Automation

This repo includes automated nightly review and sync:
- **Schedule**: 10:10 PM daily
- **Purpose**: Security review, quality checks, auto-push
- **Details**: See `.scripts/README.md`

### View automation logs
```bash
tail -f .scripts/review.log
```

### Run automation manually
```bash
./.scripts/review-and-push.sh
```

### Check automation status
```bash
crontab -l
```

## 🚀 Future Enhancements

Planned features for future releases:

- [ ] Progress tracking with local storage
- [ ] Randomized quiz generation
- [ ] Performance analytics and statistics
- [ ] Bookmark weak topics for review
- [ ] Export study progress
- [ ] Mobile app companion
- [ ] Additional question bank
- [ ] User accounts (optional)

## 🐛 Troubleshooting

**Container not starting?**
```bash
docker compose logs secplus-study
```

**Port already in use?**
Edit `docker-compose.yml`:
```yaml
ports:
  - "3002:3000"  # Use 3002 instead of 3001
```

**Build failures?**
```bash
# Clean rebuild
docker compose down
docker system prune -f
docker compose up -d --build
```

## 📊 Performance Tuning

For N100 or similar hardware:

- **Memory**: 512MB is conservative; increase to 1GB if performance issues
- **CPU**: 1 core is sufficient for study app usage
- **Build time**: ~2-3 minutes on N100
- **Runtime**: Very low resource usage (~50-100MB RAM idle)

## 🔐 Security

- Read-only container filesystem
- Non-privileged container execution
- Resource limits configured
- Health checks enabled
- Dedicated Docker network isolation

## 📚 Resources

- [CompTIA Security+ Certification](https://certification.comptia.org/certifications/security)
- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Compose Reference](https://docs.docker.com/compose/)

## 📄 License

MIT License - Feel free to use and modify for your own study needs.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Add flashcards or practice questions
- Improve documentation

---

**Happy studying! 🎓**
