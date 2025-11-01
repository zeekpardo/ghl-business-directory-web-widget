# Business Directory Widget - Development Guide

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Getting Started](#getting-started)
4. [Development Workflow](#development-workflow)
5. [GoHighLevel Integration](#gohighlevel-integration)
6. [Component Structure](#component-structure)
7. [Code Generation](#code-generation)
8. [Customization Guide](#customization-guide)
9. [Deployment](#deployment)
10. [Best Practices](#best-practices)

## Overview

The Business Directory Widget is a Vue 3 + TypeScript application designed to generate customizable business directory listings for GoHighLevel (GHL) funnels and websites. It operates as an iframe-embedded widget that communicates with the parent application using Postmate.

### Key Features
- 🎨 Visual editor for business listings and styles
- 🏢 Support for multiple business categories and locations
- 🔄 Real-time code generation and preview
- 📱 Responsive design (mobile-first approach)
- 💾 State persistence between sessions
- 🚀 Zero external dependencies in generated code
- 🔌 Seamless GoHighLevel integration

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Parent Window (GHL)                    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │                  Postmate Bridge                  │  │
│  └──────────────────▲────────────┬──────────────────┘  │
│                     │            │                      │
│                     │            │                      │
└─────────────────────┼────────────┼──────────────────────┘
                      │            │
                      │            ▼
┌─────────────────────┼────────────────────────────────────┐
│                     │      Widget (Vue App)              │
│                     │                                    │
│  ┌──────────────────▼────────────────────────────────┐  │
│  │               App.vue (Postmate Model)             │  │
│  │                                                    │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │            Setting.vue (Main UI)            │  │  │
│  │  │  ┌─────────┐ ┌──────────┐ ┌─────────────┐  │  │  │
│  │  │  │Business │ │StyleView │ │  Preview    │  │  │  │
│  │  │  │   View  │ │          │ │             │  │  │  │
│  │  │  └─────────┘ └──────────┘ └─────────────┘  │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                                                    │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │     useTranspiler (Code Generation)         │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### Data Flow
1. **Configuration Input** → User modifies businesses/styles in UI
2. **State Management** → Changes update Vue reactive store
3. **Code Generation** → useTranspiler computes HTML/CSS/JS
4. **Parent Communication** → Postmate emits generated code
5. **Persistence** → Parent saves elementStore data

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Basic knowledge of Vue 3 and TypeScript
- Understanding of iframe communication (helpful but not required)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd marketing-price-banner-main

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Environment Setup
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

## GoHighLevel Integration

### Widget Communication Protocol

1. **Initialization Handshake**
   ```typescript
   // Widget establishes connection
   const handshake = new Postmate.Model({})
   
   // Parent sends initial configuration
   handshake.then(parent => {
     if (parent.model.elementStore) {
       // Load saved configuration
     }
   })
   ```

2. **Code Emission Pattern**
   ```typescript
   parent.emit("code", {
     html: generatedHTML,
     js: generatedJS,
     elementStore: {
       businesses: currentBusinesses,
       categories: currentCategories,
       locations: currentLocations,
       cardStyles: currentStyles
     }
   })
   ```

3. **Custom Events (Future Enhancement)**
   ```javascript
   // In generated JS code
   button.addEventListener('click', () => {
     window.parent.postMessage({
       type: 'customWidgetOpenPopup',
       url: 'https://example.com'
     }, '*')
   })
   ```

### GoHighLevel Requirements Checklist
- ✅ No absolute URLs in widget code
- ✅ Self-contained output (inline styles)
- ✅ Responsive design support
- ✅ State persistence via elementStore
- ✅ Real-time code updates
- ✅ Clean separation between widget and output

## Component Structure

### Core Components

#### App.vue
- Root component establishing Postmate connection
- Loads initial configuration from parent
- Wraps the main Setting component

#### Setting.vue
- Main UI container with sidebar navigation
- Manages active view state (Businesses/Styles/Preview)
- Handles overall layout and navigation

#### BusinessView.vue
- Displays list of business listings
- Add/Edit/Delete business functionality
- Category and location management

#### StyleView.vue
- Global styling configuration
- Font selection and sizing
- Color scheme customization
- Special styling for "Featured" and "Popular" businesses

#### Preview.vue
- Real-time preview of generated business directory
- Shows exact output as it will appear
- Updates automatically on any change

#### AddEditBusiness.vue
- Modal for creating/editing individual businesses
- Contact information management
- Category and location assignment
- Input validation

## Code Generation

### HTML Generation Strategy
1. **Inline Styles**: All styles are inline for maximum portability
2. **Semantic Structure**: Clean, accessible HTML markup
3. **Responsive Grid**: CSS Grid with mobile-first breakpoints
4. **Google Fonts**: Dynamic font imports based on selection

### Generated Code Example
```html
<div style="padding: 2rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div class="business-grid">
    <!-- Individual business cards -->
  </div>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  .business-grid {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
  @media (max-width: 768px) {
    .business-grid {
      grid-template-columns: 1fr !important;
    }
  }
</style>
```

### JavaScript Generation
- Event listeners for button clicks
- URL opening functionality
- No external dependencies
- Clean, minimal code

## Customization Guide

### Adding New Business Properties

1. **Update TypeScript Interface**
   ```typescript
   // src/types/index.ts
   interface BusinessInterface {
     // ... existing properties
     hours?: string;  // New property for business hours
   }
   ```

2. **Update UI Components**
   ```vue
   <!-- AddEditBusiness.vue -->
   <n-input v-model:value="form.hours" placeholder="e.g., Mon-Fri 9AM-5PM" />
   ```

3. **Update Code Generation**
   ```typescript
   // useTranspiler.ts
   ${business.hours ? `<span class="hours">${business.hours}</span>` : ''}
   ```

### Styling Customization

1. **Add New Style Options**
   ```typescript
   // src/store/index.ts
   cardStyles: {
     // ... existing styles
     accentColor: '#FF6B6B'
   }
   ```

2. **Create UI Controls**
   ```vue
   <!-- StyleView.vue -->
   <n-color-picker v-model:value="cardStyles.accentColor" />
   ```

### Custom Button Actions

Currently supports URLs, but can be extended for:
- GoHighLevel funnel navigation
- Popup triggers
- Form submissions
- Custom JavaScript actions

## Deployment

### Local Development
```bash
npm run dev
# Opens at http://localhost:5173
```

### Production Build
```bash
# Type check and build
npm run build

# Preview production build
npm run preview
```

### GitHub Pages Deployment
```bash
# Automated build and deploy
npm run deploy
```

### GoHighLevel Integration
1. Build the widget: `npm run build`
2. Host the `dist` folder on a web server
3. Configure iframe URL in GoHighLevel
4. Enable Postmate communication

### Deployment Checklist
- [ ] Test in multiple browsers
- [ ] Verify mobile responsiveness
- [ ] Check Postmate communication
- [ ] Validate generated code
- [ ] Test state persistence
- [ ] Ensure CORS headers are configured

## Best Practices

### Code Organization & Architecture

#### 1. **Modular Store Architecture**
Break large stores into domain-specific modules for better maintainability:

```typescript
// ❌ Avoid: Monolithic store
const store = {
  businesses: [...],
  categories: [...],
  locations: [...],
  settings: {...}
}

// ✅ Preferred: Domain-specific modules
// src/store/businesses.ts
export const useBusinessStore = () => ({
  businesses,
  addBusiness,
  updateBusiness,
  deleteBusiness
})

// src/store/categories.ts  
export const useCategoryStore = () => ({
  categories,
  getCategoryNames,
  addCategory
})
```

#### 2. **Component Composition**
Create reusable, focused components following single responsibility principle:

```vue
<!-- ❌ Avoid: Monolithic components -->
<template>
  <div>
    <!-- 200+ lines of mixed concerns -->
  </div>
</template>

<!-- ✅ Preferred: Composed components -->
<template>
  <div>
    <BusinessCard 
      v-for="business in businesses"
      :key="business.id"
      :business="business"
      @edit="handleEdit"
      @delete="handleDelete"
    />
  </div>
</template>
```

#### 3. **Shared Components Library**
Develop reusable UI components to eliminate duplication:

```typescript
// src/components/shared/FormField.vue
interface Props {
  label: string;
  type: 'input' | 'select' | 'color' | 'checkbox';
  modelValue: any;
  options?: Array<{ label: string; value: any }>;
}

// Usage across multiple forms
<FormField 
  label="Business Name" 
  type="input" 
  v-model="form.name" 
/>
```

### DRY (Don't Repeat Yourself) Principles

#### 1. **Validation Utilities**
Extract common validation patterns into reusable functions:

```typescript
// ❌ Avoid: Repeated validation rules
const rules1 = {
  name: [{ required: true, message: "Name is required", trigger: "blur" }]
}
const rules2 = {
  email: [{ required: true, message: "Email is required", trigger: "blur" }]
}

// ✅ Preferred: Validation factory functions
// src/utils/validation.ts
export const createRequiredRule = (fieldName: string) => ({
  required: true,
  message: `Please enter a ${fieldName}`,
  trigger: "blur"
})

// Usage
const rules = {
  name: [createRequiredRule('business name')],
  email: [createRequiredRule('email address')]
}
```

#### 2. **CSS Class Constants**
Centralize CSS class names to reduce hardcoded strings:

```typescript
// src/utils/const.ts
export const CSS_CLASSES = {
  TITLE_LARGE: 'text-2xl font-bold',
  GRID_RESPONSIVE: 'grid grid-cols-1 gap-2 md:grid-cols-2',
  BUTTON_PRIMARY: 'type-info',
  FLEX_BETWEEN: 'flex justify-between items-center'
} as const

// Usage in components
<div :class="CSS_CLASSES.TITLE_LARGE">{{ title }}</div>
```

#### 3. **CRUD Operations Abstraction**
Create generic CRUD composables for data management:

```typescript
// src/composables/useCrud.ts
export const useCrud = <T extends CrudItem>(options: CrudOptions<T>) => {
  return {
    create,
    update,
    remove,
    findById,
    startEdit,
    saveItem
  }
}

// Usage in components
const businessCrud = useCrud({
  items: businesses,
  createDefault: () => ({ name: '', categoryIds: [] })
})
```

### Performance Optimization

#### 1. **Code Splitting & Lazy Loading**
Implement dynamic imports for heavy components:

```typescript
// ❌ Avoid: Eager loading all components
import BusinessView from './BusinessView.vue'
import StyleView from './StyleView.vue'
import Preview from './Preview.vue'

// ✅ Preferred: Lazy loading with code splitting
const BusinessView = defineAsyncComponent(() => import('./BusinessView.vue'))
const StyleView = defineAsyncComponent(() => import('./StyleView.vue'))
const Preview = defineAsyncComponent(() => import('./Preview.vue'))
```

#### 2. **CSS Optimization**
Replace inline styles with CSS classes for better performance:

```typescript
// ❌ Avoid: Extensive inline styles
const html = `
  <div style="padding: 1.25rem; border-radius: 0.5rem; border: 1px solid rgb(229, 231, 235);">
    <h3 style="font-family: Inter, sans-serif; font-size: 24px; font-weight: 700;">
      ${business.name}
    </h3>
  </div>
`

// ✅ Preferred: CSS classes with embedded stylesheet
const html = `
  <div class="business-card">
    <h3 class="business-title">${business.name}</h3>
  </div>
`
const css = `
  <style>
    .business-card { padding: 1.25rem; border-radius: 0.5rem; border: 1px solid rgb(229, 231, 235); }
    .business-title { font-family: Inter, sans-serif; font-size: 24px; font-weight: 700; }
  </style>
`
```

#### 3. **Bundle Size Optimization**
Monitor and optimize bundle sizes:

```bash
# Before optimization: 562KB main bundle
# After optimization: 314KB main bundle (44% reduction)

npm run build
# ✅ Code splitting into focused chunks:
# - BusinessView: 33KB
# - StyleView: 35KB  
# - Main bundle: 314KB
```

### Vue 3 Development

#### 1. **Composition API Best Practices**
Use `<script setup>` and composables for clean, reusable code:

```vue
<script setup lang="ts">
// ✅ Preferred: Composition API with setup
import { ref, computed } from 'vue'
import { useBusinessStore } from '@/store/businesses'

const { businesses, addBusiness } = useBusinessStore()
const searchTerm = ref('')

const filteredBusinesses = computed(() => 
  businesses.value.filter(b => 
    b.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
)
</script>
```

#### 2. **TypeScript Integration**
Leverage TypeScript for type safety and better developer experience:

```typescript
// ✅ Strong typing for props and emits
interface Props {
  business?: BusinessInterface;
  showActions?: boolean;
}

const emit = defineEmits<{
  (e: 'edit', business: BusinessInterface): void;
  (e: 'delete', id: string): void;
}>()
```

#### 3. **Reactive State Management**
Use reactive patterns for automatic UI updates:

```typescript
// ✅ Reactive store with computed values
export const useBusinessStore = () => {
  const businesses = ref<BusinessInterface[]>([])
  
  const featuredBusinesses = computed(() => 
    businesses.value.filter(b => b.featured)
  )
  
  const businessCount = computed(() => businesses.value.length)
  
  return { businesses, featuredBusinesses, businessCount }
}
```

### Code Generation Best Practices

#### 1. **Template Optimization**
Generate clean, semantic HTML with minimal dependencies:

```typescript
// ✅ Optimized template generation
const generateBusinessCard = (business: BusinessInterface) => `
  <div class="business-card" onclick="handleBusinessClick('${business.buttonAction}')">
    ${business.image ? `<img src="${business.image}" alt="${business.name}" class="business-image" />` : ''}
    <h3 class="business-title">
      <a href="${business.buttonAction}">${business.name}</a>
    </h3>
    ${business.tagline ? `<p class="business-tagline">${business.tagline}</p>` : ''}
  </div>
`
```

#### 2. **Responsive Design**
Generate mobile-first responsive layouts:

```css
/* ✅ Mobile-first responsive grid */
.business-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr; /* Mobile default */
}

@media (min-width: 768px) {
  .business-grid {
    grid-template-columns: repeat(var(--grid-columns, 3), 1fr);
  }
}
```

#### 3. **JavaScript Minimization**
Generate only essential JavaScript:

```javascript
// ✅ Minimal, focused JavaScript
function handleBusinessClick(url) {
  if (url && url !== '#') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

document.querySelectorAll('.business-card').forEach(card => {
  card.style.cursor = 'pointer';
});
```

### Widget Development

#### 1. **Error Handling & Resilience**
Implement graceful error handling that doesn't break the parent page:

```typescript
// ✅ Graceful error handling
const handshake = usePostmate().then(parent => {
  try {
    if (parent.model?.elementStore) {
      loadConfiguration(parent.model.elementStore)
    }
  } catch (error) {
    console.warn('Failed to load configuration:', error)
    // Continue with defaults
    emitCode()
  }
})
```

#### 2. **State Persistence**
Ensure user work is preserved across sessions:

```typescript
// ✅ Comprehensive state emission
const emitCode = () => {
  if (parent) {
    parent.emit('code', {
      html: htmlPreview.value,
      js: js.value,
      elementStore: {
        businesses: businesses.value,
        categories: categories.value,
        locations: locations.value,
        displayOptions: displayOptions.value,
        layoutSettings: layoutSettings.value,
        cardStyles: cardStyles.value,
        agencySettings: agencySettings.value
      }
    })
  }
}
```

#### 3. **Performance Monitoring**
Track bundle sizes and performance metrics:

```bash
# ✅ Regular performance monitoring
npm run build

# Check bundle sizes
# Main bundle should stay under 400KB
# Individual chunks under 50KB
# Monitor for performance regressions
```

### Security Considerations

#### 1. **Input Sanitization**
Always sanitize user inputs to prevent XSS:

```typescript
// ✅ Input sanitization
const sanitizeHTML = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

// Usage in template generation
`<h3>${sanitizeHTML(business.name)}</h3>`
```

#### 2. **URL Validation**
Validate URLs before including in generated code:

```typescript
// ✅ URL validation
export const validateUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}
```

#### 3. **Secure Communication**
Use Postmate for secure iframe communication:

```typescript
// ✅ Secure Postmate communication
import Postmate from 'postmate'

const model = new Postmate.Model({
  // Define secure API methods only
  getData: () => getWidgetData(),
  updateData: (data) => updateWidgetData(data)
})
```

### Testing & Quality Assurance

#### 1. **Component Testing**
Test components in isolation with proper mocking:

```typescript
// ✅ Component testing example
import { mount } from '@vue/test-utils'
import BusinessCard from '@/components/shared/BusinessCard.vue'

test('displays business information correctly', () => {
  const business = {
    id: '1',
    name: 'Test Business',
    tagline: 'Test Tagline'
  }
  
  const wrapper = mount(BusinessCard, {
    props: { business }
  })
  
  expect(wrapper.find('.business-title').text()).toBe('Test Business')
  expect(wrapper.find('.business-tagline').text()).toBe('Test Tagline')
})
```

#### 2. **Generated Code Validation**
Test generated code in isolation:

```typescript
// ✅ Generated code testing
test('generated HTML is valid and functional', () => {
  const { html, js } = useTranspiler()
  
  // Test HTML validity
  const parser = new DOMParser()
  const doc = parser.parseFromString(html.value, 'text/html')
  expect(doc.querySelector('.business-grid')).toBeTruthy()
  
  // Test JavaScript functionality
  expect(js.value).toContain('handleBusinessClick')
})
```

#### 3. **Performance Testing**
Monitor bundle sizes and load times:

```bash
# ✅ Performance testing checklist
- [ ] Bundle size under limits (main < 400KB)
- [ ] First contentful paint < 2s
- [ ] Time to interactive < 3s  
- [ ] No memory leaks in long sessions
- [ ] Responsive on mobile devices
```

These practices ensure your widget remains maintainable, performant, and scalable as the codebase grows.

## Troubleshooting

### Common Issues

1. **Postmate Connection Fails**
   - Check parent has Postmate configured
   - Verify same-origin or CORS settings
   - Look for console errors

2. **Styles Not Applying**
   - Ensure inline styles are properly formatted
   - Check for CSS specificity issues
   - Verify font imports are working

3. **State Not Persisting**
   - Confirm elementStore is being emitted
   - Check parent is saving the data
   - Verify data structure matches

### Debug Mode
```typescript
// Enable console logging
console.info("Emitting code to parent", parent);

// Log generated code
console.log('Generated HTML:', htmlPreview.value);

// Monitor state changes
watch(businesses, (newBusinesses) => {
  console.log('Businesses updated:', newBusinesses);
});
```

## Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Vue Guide](https://vuejs.org/guide/typescript/overview.html)
- [GoHighLevel Widget Docs](https://marketplace.gohighlevel.com/docs/marketplace-modules/Widgets)
- [Postmate Library](https://github.com/dollarshaveclub/postmate)
- [Naive UI Components](https://www.naiveui.com/)

## Contributing

1. Follow existing code patterns and conventions
2. Add TypeScript types for new features
3. Test thoroughly in widget and standalone contexts
4. Update documentation for significant changes
5. Ensure generated code remains portable