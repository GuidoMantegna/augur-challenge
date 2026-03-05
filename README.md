<div align="center">

# 🛡️ Augur Security — Threat Intelligence Dashboard

### Real-time threat indicator monitoring and campaign intelligence

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-augur--challenge.vercel.app-6383ff?style=for-the-badge)](https://augur-challenge.vercel.app/)
[![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff?style=flat&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06b6d4?style=flat&logo=tailwindcss)](https://tailwindcss.com/)

[Live Demo](https://augur-challenge.vercel.app/) • [Features](#features) • [Quick Start](#quick-start) • [API Docs](#complete-api-documentation)

</div>

---

## 📋 Overview

**Augur Security** is a modern, enterprise-grade threat intelligence dashboard built with React 19, TypeScript, and Tailwind CSS. It provides security analysts with real-time visibility into threat indicators including malicious IPs, domains, file hashes, and URLs.

### ✨ Features

- 🎯 **Real-time Threat Monitoring** — Track 500+ threat indicators across multiple sources
- 🔍 **Advanced Filtering** — Search and filter by severity, type, source, and custom queries
- 📊 **Interactive Dashboard** — Live statistics with severity-based categorization
- 📱 **Responsive Design** — Fully responsive layout optimized for all screen sizes
- ⚡ **High Performance** — Optimized rendering with React 19 and Vite
- 🎨 **Modern UI/UX** — Dark theme with custom design system and smooth animations
- 📈 **Sortable Data Tables** — Multi-column sorting with visual indicators
- 🔎 **Detail Panel** — Slide-in panel with comprehensive indicator information
- 💾 **CSV Export** — Export filtered results for offline analysis
- ➕ **Add Indicators** — Create new threat indicators with validation
- 🧪 **Fully Tested** — Comprehensive test coverage with Vitest + React Testing Library

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ti-dashboard-starter-repo

# Install dependencies
npm install

# Start development servers (API + Client)
npm run dev
```

This command starts:
- **React dev server** at `http://localhost:5173`
- **Mock API server** at `http://localhost:3001`

The Vite dev server automatically proxies `/api/*` requests to the API server.

### Available Scripts

```bash
npm run dev          # Start both API and client dev servers
npm run dev:client   # Start only the React dev server
npm run dev:api      # Start only the Express API server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests in watch mode
npm run test:ui      # Run tests with Vitest UI
npm run lint         # Lint code with ESLint
```

---

## 🎨 Design Reference

Open `design-reference.html` in your browser to view the complete design specification:

### Design System Includes

- **🎨 Complete Color Palette** — All CSS variables with hex values for backgrounds, borders, text, severity levels, and status colors
- **🔤 Typography System** — DM Sans for UI, JetBrains Mono for technical data, with complete font weight scale
- **📐 Layout Dimensions** — Sidebar (220px), header (56px), detail panel (400px), spacing scale
- **🧩 Component Library** — Buttons, inputs, badges, tags, confidence bars, stat cards, modals
- **🎭 Interaction States** — Hover, selected, focus, active, loading, and disabled states
- **🌈 Severity System** — Critical (red), High (orange), Medium (yellow), Low (green) with backgrounds and borders
- **📏 Spacing & Radii** — Consistent spacing scale (4px–64px) and border radius values

**Pro Tip:** Use browser DevTools to inspect exact values. All design tokens are defined as CSS variables in `:root`.

---

## 📚 Complete API Documentation

### Base URL

- **Development:** `http://localhost:3001` (proxied to `/api` in dev)
- **Production:** Deployed API endpoint

### Endpoints

#### `GET /api/indicators`

Retrieve a paginated list of threat indicators with optional filtering and sorting.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | `number` | `1` | Page number (1-indexed) |
| `limit` | `number` | `20` | Items per page (max: 100) |
| `severity` | `string` | — | Filter by severity: `critical`, `high`, `medium`, `low` |
| `type` | `string` | — | Filter by type: `ip`, `domain`, `hash`, `url` |
| `source` | `string` | — | Filter by source (e.g., `AbuseIPDB`, `VirusTotal`) |
| `search` | `string` | — | Partial match on indicator value, source, or tags |
| `sort` | `string` | — | Sort field: `lastSeen`, `indicator` |
| `order` | `string` | — | Sort order: `aZ` (ascending), `Za` (descending) |

**Response:**

```typescript
{
  data: Indicator[];      // Array of indicator objects
  total: number;          // Total count of filtered results
  page: number;           // Current page number
  totalPages: number;     // Total number of pages
}
```

**Example Request:**

```bash
GET /api/indicators?page=1&limit=20&severity=critical&type=ip&search=tor
```

**Example Response:**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "value": "185.220.101.34",
      "type": "ip",
      "severity": "critical",
      "source": "AbuseIPDB",
      "firstSeen": "2025-11-08T14:22:00.000Z",
      "lastSeen": "2026-02-03T19:45:00.000Z",
      "tags": ["tor-exit", "botnet", "malware-c2"],
      "confidence": 94
    }
  ],
  "total": 342,
  "page": 1,
  "totalPages": 18
}
```

---

#### `GET /api/indicators/:id`

Retrieve a single threat indicator by ID.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Unique indicator ID (UUID) |

**Response:**

```typescript
Indicator // Single indicator object
```

**Example:**

```bash
GET /api/indicators/550e8400-e29b-41d4-a716-446655440000
```

---

#### `GET /api/stats`

Retrieve summary statistics for the dashboard.

**Response:**

```typescript
{
  total: number;          // Total indicators
  critical: number;       // Count of critical severity
  high: number;           // Count of high severity
  medium: number;         // Count of medium severity
  low: number;            // Count of low severity
  byType: {
    ip: number;           // Count of IP indicators
    domain: number;       // Count of domain indicators
    hash: number;         // Count of hash indicators
    url: number;          // Count of URL indicators
  }
}
```

**Example Response:**

```json
{
  "total": 500,
  "critical": 89,
  "high": 156,
  "medium": 178,
  "low": 77,
  "byType": {
    "ip": 125,
    "domain": 125,
    "hash": 125,
    "url": 125
  }
}
```

---

#### `GET /api/indicators/csv`

Export all indicators as CSV file.

**Response:** CSV file download with all indicator data.

---

#### `POST /api/indicators`

Create a new threat indicator.

**Request Body:**

```typescript
{
  id: string;             // UUID
  value: string;          // Indicator value
  type: IndicatorType;    // 'ip' | 'domain' | 'hash' | 'url'
  severity: Severity;     // 'critical' | 'high' | 'medium' | 'low'
  source: Source;         // Source name
  firstSeen: string;      // ISO 8601 timestamp
  lastSeen: string;       // ISO 8601 timestamp
  tags: string[];         // Array of tags
  confidence: number;     // 0-100
}
```

**Response:** `201 Created` with the created indicator object.

---

#### `PUT /api/indicators/:id`

Update an existing indicator.

**Request Body:** Partial indicator object with fields to update.

**Response:** `200 OK` with updated indicator object.

---

#### `DELETE /api/indicators/:id`

Delete an indicator by ID.

**Response:** `204 No Content`

---

### Data Types

```typescript
type IndicatorType = 'ip' | 'domain' | 'hash' | 'url';

type Severity = 'critical' | 'high' | 'medium' | 'low';

type Source = 'AbuseIPDB' | 'OTX AlienVault' | 'VirusTotal' | 
  'Emerging Threats' | 'MalwareBazaar' | 'PhishTank' | 'Spamhaus' | 
  'ThreatFox' | 'URLhaus' | 'CIRCL' | 'Shodan' | 'GreyNoise' | 
  'BinaryEdge' | 'Censys' | 'Silent Push' | 'DomainTools';

interface Indicator {
  id: string;
  value: string;
  type: IndicatorType;
  severity: Severity;
  source: Source;
  firstSeen: string;      // ISO 8601
  lastSeen: string;       // ISO 8601
  tags: string[];
  confidence: number;     // 0–100
}
```

---

## 📁 Project Structure

```
ti-dashboard-starter-repo/
├── 📄 design-reference.html        # Complete design specification
├── 📁 server/
│   ├── index.js                    # Express API server (500 indicators)
│   └── data.js                     # Mock data generator
├── 📁 src/
│   ├── 📁 api/
│   │   └── apiClient.ts            # Axios-based API client
│   ├── 📁 components/
│   │   ├── Dashboard.tsx           # Main dashboard container
│   │   ├── Header.tsx              # Page header with actions
│   │   ├── Sidebar.tsx             # Navigation sidebar
│   │   ├── StatCard.tsx            # Statistics card component
│   │   ├── Toolbar.tsx             # Filter toolbar
│   │   ├── TableRow.tsx            # Indicator table row
│   │   ├── Pagination.tsx          # Pagination controls
│   │   ├── DetailSection.tsx       # Indicator detail panel
│   │   ├── Modal.tsx               # Reusable modal component
│   │   ├── IndicatorForm.tsx       # Add/edit indicator form
│   │   └── index.ts                # Component exports
│   ├── 📁 hooks/
│   │   ├── useIndicators.ts        # Indicator data fetching hook
│   │   ├── useFilters.ts           # Filter state management hook
│   │   ├── useStats.ts             # Statistics hook
│   │   └── index.ts                # Hook exports
│   ├── 📁 types/
│   │   ├── indicator.ts            # TypeScript type definitions
│   │   └── stats.ts                # Statistics types
│   ├── 📁 utils/
│   │   └── helpers.ts              # Utility functions
│   ├── 📁 styles/
│   │   └── global.css              # Global styles and CSS variables
│   ├── 📁 test/
│   │   └── components/             # Component tests
│   ├── App.tsx                     # Root application component
│   ├── main.tsx                    # React entry point
│   └── vite-env.d.ts               # Vite type declarations
├── 📄 package.json                 # Dependencies and scripts
├── 📄 tsconfig.json                # TypeScript configuration
├── � vite.config.ts               # Vite configuration (with API proxy)
├── 📄 vitest.config.ts             # Vitest test configuration
├── 📄 eslint.config.js             # ESLint configuration
├── 📄 vercel.json                  # Vercel deployment config
└── 📄 README.md                    # This file
```

### Key Architecture Decisions

- **🧩 Component-Based Architecture** — Modular, reusable components with clear separation of concerns
- **🪝 Custom Hooks** — Encapsulated business logic for data fetching, filtering, and state management
- **📘 TypeScript** — Full type safety with comprehensive interfaces and type definitions
- **🎨 Tailwind CSS** — Utility-first styling with custom design tokens
- **⚡ Vite** — Lightning-fast HMR and optimized production builds
- **🧪 Vitest** — Fast unit testing with React Testing Library integration

---

## 🧪 Testing

The project includes comprehensive test coverage using **Vitest** and **React Testing Library**.

### Running Tests

```bash
# Run all tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests once (CI mode)
npm run test -- --run
```

### Test Coverage

- ✅ **Component Tests** — UI component rendering and interactions
- ✅ **Hook Tests** — Custom hook logic and state management
- ✅ **Integration Tests** — API client and data flow
- ✅ **Utility Tests** — Helper functions and formatters

### Test Files Location

```
src/
└── test/
    └── components/
        ├── Dashboard.test.tsx
        ├── Toolbar.test.tsx
        └── ...
```

---

## 🛠️ Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | React | 19.2.4 |
| **Language** | TypeScript | 5.6.3 |
| **Build Tool** | Vite | 6.0.0 |
| **Styling** | Tailwind CSS | 4.1.18 |
| **HTTP Client** | Axios | 1.13.5 |
| **Testing** | Vitest | 2.1.8 |
| **Testing Library** | React Testing Library | 16.1.0 |
| **Backend** | Express | 4.21.1 |
| **Linting** | ESLint | 9.15.0 |
| **Notifications** | React Toastify | 11.0.5 |
| **CSV Export** | @fast-csv/format | 5.0.5 |

---

## 🚀 Deployment

The application is deployed on **Vercel** with automatic deployments from the main branch.

**Live URL:** [https://augur-challenge.vercel.app/](https://augur-challenge.vercel.app/)

### Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ti-dashboard)

### Environment Variables

No environment variables are required for the default configuration. The API proxy is configured in `vite.config.ts`.

---

## 📝 License

This project is part of a frontend engineering assessment.

---

## 🙏 Acknowledgments

- Design system inspired by modern security platforms
- Mock data generator for realistic threat intelligence scenarios
- Built with modern React patterns and best practices

---

<div align="center">

**Built with ❤️ for Augur Security**

[⬆ Back to Top](#-augur-security--threat-intelligence-dashboard)

</div>