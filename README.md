# Augur Security — Threat Intelligence Dashboard

> Frontend Engineering Take-Home Assignment

## Overview

Build a **Threat Intelligence Dashboard** that displays, filters, and explores threat indicators (malicious IPs, domains, file hashes, URLs). Your implementation should match the visual design provided in `design-reference.html` and consume data from the included mock API.

## Quick Start

```bash
npm install
npm run dev
```

This starts both the React dev server (`localhost:5173`) and the mock API (`localhost:3001`). The Vite dev server proxies `/api/*` requests to the API automatically.

## Design Reference

Open `design-reference.html` in your browser. This is your design spec — it includes:

- **Full dashboard mockup** — sidebar, stats, table, detail panel, filters
- **Complete color palette** — all CSS variables with hex values
- **Typography** — DM Sans (UI) + JetBrains Mono (technical data)
- **Component library** — badges, tags, buttons, confidence bars, inputs
- **Layout dimensions** — sidebar, panel, header, modal sizes
- **Interaction states** — hover, selected, focus, loading

Use browser DevTools to inspect exact values. All design tokens are defined as CSS variables in `:root`.

## API Documentation

Base URL: `http://localhost:3001` (proxied to `/api` in dev)

| Endpoint | Method | Description |
|---|---|---|
| `/api/indicators` | GET | Paginated indicator list |
| `/api/indicators/:id` | GET | Single indicator details |
| `/api/stats` | GET | Summary statistics |

### Query Parameters for `/api/indicators`

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max 100) |
| `severity` | string | — | Filter: `critical`, `high`, `medium`, `low` |
| `type` | string | — | Filter: `ip`, `domain`, `hash`, `url` |
| `search` | string | — | Partial match on value, source, or tags |

### Response Shape

```json
{
  "data": [
    {
      "id": "uuid",
      "value": "185.220.101.34",
      "type": "ip",
      "severity": "critical",
      "source": "AbuseIPDB",
      "firstSeen": "2025-11-08T14:22:00.000Z",
      "lastSeen": "2026-02-03T19:45:00.000Z",
      "tags": ["tor-exit", "botnet"],
      "confidence": 94
    }
  ],
  "total": 500,
  "page": 1,
  "totalPages": 25
}
```

## Project Structure

```
├── design-reference.html   ← Visual spec (open in browser)
├── server/
│   ├── index.js            ← Express API server
│   └── data.js             ← Mock data generator (500 indicators)
├── src/
│   ├── api/                ← Your API client functions
│   ├── components/         ← Your React components
│   ├── hooks/              ← Your custom hooks
│   ├── styles/             ← Your stylesheets
│   │   └── global.css      ← Base reset (extend as needed)
│   ├── types/
│   │   └── indicator.ts    ← TypeScript interfaces (provided)
│   ├── App.tsx             ← Entry component (start here)
│   └── main.tsx            ← React bootstrap
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

## What To Build

Refer to the assignment document for full requirements. In short:

1. **Dashboard layout** — Sidebar navigation, page header, stats row, data table, detail panel
2. **Data table** — Fetch and display indicators with sorting by column
3. **Filtering** — Search input + severity/type/source dropdowns
4. **Detail panel** — Click a row to show full indicator details in a side panel
5. **State management** — Loading, error, and empty states
6. **Pagination** — Navigate through the full dataset

## Testing

```bash
npm test          # Run tests
npm run test:ui   # Run with Vitest UI
```

The project includes Vitest + React Testing Library. Write tests for your key components and hooks.

## Submission

1. Ensure `npm install && npm run dev` works cleanly
2. Ensure `npm test` passes
3. Add your notes below, then zip the project (excluding `node_modules`)

---

### Candidate Notes

# 📌 Design Decisions, Trade-offs & Future Improvements

---

## 🏗 Architecture & Structure

- Built using a modular and reusable component architecture.
- Clear separation between UI, business logic, and data handling.
- Components are designed to be composable and scalable.
- Avoided unnecessary global state to reduce complexity and keep the solution lightweight.

### Trade-off

Given the scope of the challenge, I prioritized simplicity and clarity over introducing heavier architectural patterns.  

For a production-grade system, I would consider:
- A more structured server-state management strategy
- URL-driven state synchronization

---

## 📊 Data Handling & Pagination

- Pagination logic is isolated and easily extensible.

### Improvements (with more time)

- Improved loading states and page transition UX

---

## 🎨 Styling Strategy

- Tailwind CSS used for rapid and consistent UI development.

### Improvements

- Reorganize CSS structure for better maintainability
- Lean further into Tailwind patterns to reduce custom styles
- Improve design token consistency (spacing, typography, color usage)

---

## 🧪 Testing Strategy

Current tests focus on core logic and primary components.

### With more time, I would:

- Increase unit test coverage
- Improve API mocking strategy

The goal would be to increase confidence in refactors and ensure stability as new features are introduced.

---

## ✨ UX Improvements

### Detail Section

- The detail view is functional but could benefit from smoother transitions.
- Loading states and micro-interactions could be improved to enhance perceived performance.

---

## 🚀 Potential New Features

### 📁 Export Functionality (CSV / XLSX)

- Export filtered results
- Export selected rows

### ➕ Add Indicator Feature

- Form with validation

---

## 📈 Scalability Considerations

For a production-ready system, I would prioritize:
 
- Error boundaries  
- Accessibility improvements (ARIA, keyboard navigation)  

---

## 🧠 Final Notes

Within the challenge constraints, I focused on:

- Clean and readable code  
- Maintainable structure  
- Extensibility  
- Product-aware decisions  
- Avoiding premature optimization  

The goal was to build a solid foundation capable of evolving into a production-grade system.