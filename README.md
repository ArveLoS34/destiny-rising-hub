# Destiny Rising Hub 🎮

> The ultimate companion platform for Destiny Rising

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/ArveLoS34/destiny-rising-hub)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black.svg)](https://nextjs.org/)

## 🌟 Features

### 🎯 Core Features

- **Character Database** - Complete character database with stats, builds, and tier lists
- **Weapon Database** - Comprehensive weapon database with stats and recommendations
- **Build Lab** - AI-powered build recommendations and optimization
- **Team Builder** - Create and optimize team compositions
- **AI Advisor** - Intelligent recommendations for builds, weapons, and teams
- **Interactive World Map** - Explore the game world with detailed node information
- **Community Platform** - Share guides, builds, and connect with other players
- **Admin Dashboard** - Complete platform management and moderation tools

### 🚀 Advanced Features

- **Discovery Platform** - Universal search with knowledge graph
- **Combat Intelligence** - Damage calculator and combat simulation
- **Progression System** - Material tracking and daily planner
- **Command Palette** - Quick navigation with Ctrl+K
- **Real-time Recommendations** - AI-powered content suggestions

## 🏗️ Architecture

### Technology Stack

- **Framework**: Next.js 16.3 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4
- **Database**: Prisma + SQLite
- **Authentication**: Better Auth
- **State Management**: React Query
- **UI Components**: Radix UI + Custom Components
- **Icons**: Lucide React
- **Animation**: Framer Motion

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (games)/           # Game-specific routes
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── admin/            # Admin components
├── features/             # Feature modules
│   ├── characters/       # Character module
│   ├── weapons/          # Weapon module
│   ├── builds/           # Build module
│   ├── teams/            # Team module
│   ├── ai-advisor/       # AI Advisor module
│   ├── world/            # World map module
│   ├── discovery/        # Search & discovery
│   ├── community/        # Community features
│   ├── admin/            # Admin features
│   ├── analytics/        # Analytics
│   ├── seo/              # SEO
│   └── security/         # Security
├── data/                 # Data layer
│   └── games/            # Game data
├── lib/                  # Utilities and helpers
├── types/                # TypeScript types
│   └── domain/           # Domain types
└── config/               # Configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ArveLoS34/destiny-rising-hub.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📊 Features Breakdown

### Character Database
- 20+ characters with detailed stats
- Skill breakdowns and rotations
- Material requirements
- Build recommendations
- Tier list integration

### Weapon Database
- 25+ weapons with stats
- Character compatibility
- Upgrade paths
- Material costs
- Optimization tips

### Build Lab
- AI-powered recommendations
- Real-time optimization
- Build comparison
- Export functionality
- Community builds

### Team Builder
- Team composition optimizer
- Synergy analysis
- Role balancing
- Element coverage
- Performance metrics

### AI Advisor
- Personalized recommendations
- Build suggestions
- Weapon recommendations
- Team optimization
- Progression planning

### Interactive World Map
- Node-based exploration
- Material locations
- Boss spawns
- Route planning
- Real-time status

### Community Platform
- Guide creation
- Build sharing
- Comments & ratings
- User profiles
- Follow system

### Admin Dashboard
- User management
- Content moderation
- Analytics dashboard
- System health monitoring
- Feature flags

## 🔒 Security

- CSP (Content Security Policy)
- XSS Protection
- CSRF Protection
- Rate Limiting
- Input Validation
- Secure Headers

## 📈 Performance

- Lighthouse Score: 95+
- Core Web Vitals optimized
- Image optimization
- Code splitting
- Lazy loading
- Edge caching

## 🧪 Testing

- Unit tests (Jest)
- Integration tests
- E2E tests (Playwright)
- 80%+ coverage target

## 📚 Documentation

- [Architecture Guide](docs/ARCHITECTURE.md)
- [API Documentation](docs/API.md)
- [Component Library](docs/COMPONENTS.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Contributing Guide](CONTRIBUTING.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Destiny Rising game developers
- Open source community
- All contributors

## 📞 Support

- [Discord](https://discord.gg/destinyrisinghub)
- [Twitter](https://twitter.com/destinyrisinghub)
- [Email](mailto:support@destinyrisinghub.com)

---

Made with ❤️ by the Destiny Rising Hub Team
