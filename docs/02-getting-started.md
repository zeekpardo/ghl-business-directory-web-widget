# Getting Started

## Prerequisites
- Node.js 16+ and npm
- Basic knowledge of Vue 3 and TypeScript
- Understanding of iframe communication (helpful but not required)

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd marketing-price-banner-main

# Install dependencies
npm install

# Start development server
npm run dev
```

## Development Environment Setup

1. The widget runs on `http://localhost:5173` by default
2. To test iframe communication, you'll need a parent page with Postmate
3. Use the browser console to monitor Postmate messages

## Development Workflow

### 1. Understanding the Data Models

```typescript
// Core business directory structure
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

// Category and Location structures
interface CategoryInterface {
  id: string;
  name: string;
  color?: string;
  textColor?: string;
  tags?: string[];
}

interface LocationInterface {
  id: string;
  name: string;
  address?: string;
  color?: string;
  textColor?: string;
}
```

### 2. Component Communication Pattern

```vue
<!-- Parent-child communication via v-model -->
<BusinessView v-model:businesses="businesses" />

<!-- Event handling -->
<AddEditBusiness 
  @success="handleSave"
  @close="showOverview = true"
/>
```

### 3. State Management with Composables

```typescript
// Accessing the store
import { useStore } from '@/store'

const { businesses, categories, locations, cardStyles } = useStore()

// The store provides reactive references
// Changes automatically trigger UI updates and code regeneration
```

### 4. Code Generation Flow

The `useTranspiler` composable handles all code generation:

```typescript
const { htmlPreview, js } = useTranspiler()

// htmlPreview: Complete HTML with inline styles and CSS
// js: JavaScript for button click handling
```

## Project Structure

```
src/
├── components/
│   ├── BusinessView.vue       # Business management UI
│   ├── StyleView.vue          # Styling configuration
│   ├── Preview.vue            # Real-time preview
│   ├── AddEditBusiness.vue    # Business form modal
│   └── shared/                # Reusable components
├── composition/
│   ├── useTranspiler.ts       # Code generation logic
│   └── usePostmate.ts         # Parent communication
├── store/
│   ├── index.ts               # Main store aggregator
│   ├── businesses.ts          # Business data management
│   ├── categories.ts          # Category management
│   ├── locations.ts           # Location management
│   └── settings.ts            # UI settings and styles
├── types/
│   └── index.ts               # TypeScript interfaces
└── utils/
    ├── const.ts               # Constants and defaults
    ├── validation.ts          # Form validation rules
    └── environmentSync.ts     # Environment detection
```

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

## Testing the Widget

### Standalone Testing
1. Run `npm run dev`
2. Open browser to `http://localhost:5173`
3. Use the UI to add businesses and customize styles
4. Check the Preview tab to see generated output

### Iframe Testing
1. Create a test HTML file with Postmate integration
2. Embed the widget as an iframe
3. Monitor browser console for communication events
4. Verify state persistence and code emission

### Generated Code Testing
1. Copy HTML/CSS/JS from the widget output
2. Create a standalone HTML file
3. Test functionality independently
4. Verify responsive design and interactions