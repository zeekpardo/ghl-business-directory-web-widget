# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Business Directory Widget - a Vue 3 + TypeScript application that creates customizable business directory listings. It's designed to be embedded as an iframe widget that communicates with parent applications via Postmate.

**Note**: This project has transitioned from a pricing banner generator to a business directory widget.

## Essential Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production (runs TypeScript check first)
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## Architecture Overview

### Core Components Flow
1. **App.vue** - Root component that establishes Postmate communication with parent window
2. **Setting.vue** - Main UI with sidebar navigation (Businesses, Styles, Preview tabs)
3. **Store (src/store/index.ts)** - Central state management for businesses, categories, locations, and styles using Vue refs
4. **useTranspiler (src/composition/useTranspiler.ts)** - Generates HTML/CSS/JS code from current state

### Key Data Models

```typescript
interface BusinessInterface {
  id: string;
  name: string;
  tagline?: string;
  image?: string;
  description?: string;
  contact?: BusinessContactInterface;
  categoryIds: string[];
  locationIds: string[];
  buttonAction?: string;
  featured?: boolean;
  popular?: boolean;
  rating?: number;
  priceRange?: string;
  price?: number;
  createdAt?: string;
}

interface BusinessContactInterface {
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}
```

### State Management Pattern
The application uses a simple composable-based store pattern. The `useStore` composable provides access to:
- `businesses`: Array of business listings
- `categories`: Array of business categories
- `locations`: Array of geographic locations
- `displayOptions`: Configuration for what information to show
- `layoutSettings`: Grid/list layout configuration
- `cardStyles`: Style configuration object (aliased as `defaultStyles` for compatibility)
- `agencySettings`: Agency branding configuration

### Parent-Child Communication
The application communicates with its parent window using Postmate:
- Receives initial configuration on mount
- Emits generated code whenever state changes
- Message format: `{ type: 'code', code: { html, css, js } }`

## Development Notes

- The application uses Naive UI as its component library
- Tailwind CSS is configured for utility classes
- TypeScript is enforced with `vue-tsc` during builds
- The generated business directory is responsive (1 column mobile, 3 columns desktop)
- All styling is inline in the generated HTML for maximum portability