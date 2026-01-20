# BetterOVH

A modern, intuitive frontend for managing OVH Cloud infrastructure. Built with React 19, TanStack Router, and a beautiful UI powered by Base UI and Tailwind CSS.

[![CI](https://github.com/alexisbouchez/betterovh/actions/workflows/ci.yml/badge.svg)](https://github.com/alexisbouchez/betterovh/actions/workflows/ci.yml)

## Features

- **Instance Management** - Create, start, stop, reboot, and delete cloud instances
- **Volume Storage** - Manage block storage volumes with attach/detach support
- **Private Networks** - Configure private networks for secure instance communication
- **SSH Keys** - Manage SSH keys for secure instance access
- **Dashboard** - Overview of instances, storage, spending, and recent activity
- **Dark Mode** - Full dark mode support with system preference detection
- **Notifications** - Real-time notifications with auto-dismiss for success messages
- **Accessibility** - Keyboard navigation, focus management, and screen reader support

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) with React 19
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **State Management**: [TanStack Query](https://tanstack.com/query) + [Zustand](https://zustand.docs.pmnd.rs/)
- **UI Components**: [Base UI](https://base-ui.com/) + Custom components
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Hugeicons](https://hugeicons.com/)
- **Testing**: [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)
- **Package Manager**: [Bun](https://bun.sh/)

## Project Structure

```
betterovh/
├── apps/
│   └── web/                    # Main web application
│       ├── src/
│       │   ├── components/     # Reusable UI components
│       │   ├── hooks/          # Custom React hooks
│       │   ├── lib/            # Utilities, queries, stores
│       │   └── routes/         # File-based routing
│       └── package.json
├── packages/
│   ├── ovh/                    # OVH API client
│   └── ui/                     # Shared UI components
└── package.json
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (latest version)
- OVH Cloud account with API credentials

### Installation

```bash
# Clone the repository
git clone https://github.com/alexisbouchez/betterovh.git
cd betterovh

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env

# Start development server
bun run dev
```

### Environment Variables

Create a `.env` file with the following variables:

```env
# OVH API Credentials
OVH_APP_KEY=your_app_key
OVH_APP_SECRET=your_app_secret
OVH_CONSUMER_KEY=your_consumer_key
OVH_ENDPOINT=ovh-eu

# Application
VITE_API_URL=http://localhost:3000/api
```

## Development

```bash
# Start development server
bun run dev

# Run tests
bun --filter '@betterovh/web' test

# Run tests in watch mode
bun --filter '@betterovh/web' test:watch

# Run tests with coverage
bun --filter '@betterovh/web' test:coverage

# Build for production
bun run build

# Type check
cd apps/web && bunx tsc --noEmit

# Lint
bun run lint

# Format
bun run format
```

## Testing

The project uses Vitest with Testing Library for component testing. Tests are co-located with their components.

```bash
# Run all tests
bun --filter '@betterovh/web' test

# Run specific test file
bun --filter '@betterovh/web' test src/components/instances/instances-table.test.tsx
```

## Architecture

### Components

Components follow a consistent pattern:
- **Props interface** with clear typing
- **Loading states** with skeleton placeholders
- **Error states** using the reusable `ErrorState` component
- **Empty states** using the reusable `EmptyState` component
- **Keyboard navigation** for accessible interactions

### State Management

- **Server state**: TanStack Query for API data fetching and caching
- **Client state**: Zustand for local UI state (notifications, theme)
- **URL state**: TanStack Router for routing and URL parameters

### Styling

The project uses Tailwind CSS v4 with:
- CSS variables for theming
- Class Variance Authority (CVA) for component variants
- `cn()` utility for conditional class merging

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.
