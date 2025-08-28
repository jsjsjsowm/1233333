# Telegram Mini App Roulette

A production-ready Telegram Mini App roulette game with modern iOS-style interface.

## Features

- 🎰 Interactive roulette wheel with smooth animations
- 👤 User profile with balance management
- 📊 Betting history and statistics
- 🔐 Telegram authentication
- 📱 iOS-style responsive design
- 💰 Real-time balance updates

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- CSS Modules for styling
- Telegram Web App SDK
- Framer Motion for animations

**Backend:**
- NestJS with TypeScript
- PostgreSQL database
- JWT authentication
- Prisma ORM

## Quick Start

1. Install dependencies:
```bash
npm run install:all
```

2. Set up environment variables:
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration
```

3. Run database migrations:
```bash
cd backend && npx prisma migrate dev
```

4. Start development servers:
```bash
npm run dev
```

## Environment Variables

Create `backend/.env`:
```
DATABASE_URL="postgresql://username:password@localhost:5432/roulette_db"
JWT_SECRET="your-jwt-secret"
TELEGRAM_BOT_TOKEN="your-bot-token"
```

## Production Deployment

1. Build the project:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## Game Rules

- Minimum bet: 10 coins
- Win multiplier: 1.5x
- Loss: -bet amount
- Roulette has 37 numbers (0-36)
- Even numbers (red), odd numbers (black), 0 (green)
