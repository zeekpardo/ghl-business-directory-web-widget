# Best Practices

## Code Organization & Architecture

### 1. Modular Store Architecture
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

### 2. Component Composition
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

### 3. Shared Components Library
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

## DRY (Don't Repeat Yourself) Principles

### 1. Validation Utilities
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

### 2. CSS Class Constants
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

### 3. CRUD Operations Abstraction
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

## Performance Optimization

### 1. Code Splitting & Lazy Loading
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

### 2. CSS Optimization
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

### 3. Bundle Size Optimization
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

## Vue 3 Development

### 1. Composition API Best Practices
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

### 2. TypeScript Integration
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

### 3. Reactive State Management
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

## Code Generation Best Practices

### 1. Template Optimization
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

### 2. Responsive Design
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

### 3. JavaScript Minimization
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

## Widget Development

### 1. Error Handling & Resilience
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

### 2. State Persistence
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

### 3. Performance Monitoring
Track bundle sizes and performance metrics:

```bash
# ✅ Regular performance monitoring
npm run build

# Check bundle sizes
# Main bundle should stay under 400KB
# Individual chunks under 50KB
# Monitor for performance regressions
```

## Security Considerations

### 1. Input Sanitization
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

### 2. URL Validation
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

### 3. Secure Communication
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

## Testing & Quality Assurance

### 1. Component Testing
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

### 2. Generated Code Validation
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

### 3. Performance Testing
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

## Categories Feature Implementation

### Overview
The categories feature provides a complete CRUD system for managing business categories with associated tags. Each category can have multiple tags for more granular business classification, and the system includes cascade deletion to maintain data integrity.

### Architecture Patterns

#### 1. Reusable CRUD Component
The categories feature introduces a generic `CrudManager` component that can be reused for any entity management:

```vue
<!-- Usage Example -->
<CrudManager
  title="Categories"
  description="Manage business categories with tags for better organization"
  :items="categories"
  :create-default="createDefaultCategory"
  :validation="validationRules"
  :get-business-count="getBusinessCount"
  :on-after-delete="handleAfterDelete"
  :show-tags="true"
  :show-colors="true"
>
  <template #form="{ formData, isLoading, newTag, addTag, removeTag }">
    <!-- Dynamic form content here -->
  </template>
</CrudManager>
```

**Benefits:**
- **DRY Principle**: Single component handles all CRUD operations
- **Type Safety**: Fully typed with TypeScript generics
- **Flexibility**: Configurable features (tags, colors, validation)
- **Consistency**: Uniform UX across all entity types

#### 2. Data Model Integration
Categories are fully integrated with the business directory data model:

```typescript
interface CategoryInterface {
  id: string;
  name: string;
  color?: string;
  textColor?: string;
  tags?: string[];
}

interface BusinessInterface {
  // ... other fields
  categoryIds: string[]; // Multiple categories supported
}
```

#### 3. Cascade Deletion Pattern
When categories are deleted, all business references are automatically cleaned up:

```typescript
const handleAfterDelete = (deletedCategory: CategoryInterface) => {
  // Remove category from businesses when deleted
  businesses.value.forEach(business => {
    const index = business.categoryIds.indexOf(deletedCategory.id);
    if (index > -1) {
      business.categoryIds.splice(index, 1);
    }
  });
};
```

### Display Integration

#### 1. Preview Integration
Categories are displayed in the generated HTML with dynamic styling:

```typescript
// In useTranspiler.ts
${business.categoryIds.length > 0 && displayOptions.value.showCategories ? `
  <div class="business-categories">
    ${getBusinessCategories(business.categoryIds)
      .map(category => `
        <span class="category-tag" style="background-color: ${category.color}; color: ${category.textColor};">
          ${category.name}
        </span>
      `).join('')}
  </div>
` : ''}
```

#### 2. Responsive CSS
Category tags are styled to be responsive and visually appealing:

```css
.business-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.category-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  transition: opacity 0.2s ease;
}
```

### Component Reusability

#### 1. Generic CRUD Component
The `CrudManager` component is designed for reuse across different entities:

```typescript
// For Categories
<CrudManager
  title="Categories"
  :show-tags="true"
  :show-colors="true"
  // ... other props
/>

// For Locations (future implementation)
<CrudManager
  title="Locations"
  :show-tags="false"
  :show-colors="true"
  // ... other props
/>
```

#### 2. Shared Form Components
Common form elements are extracted into reusable components:

```vue
<!-- FormField.vue -->
<template>
  <n-form-item :label="label" :path="path">
    <n-input v-if="type === 'input'" v-model:value="modelValue" />
    <n-color-picker v-else-if="type === 'color'" v-model:value="modelValue" />
    <!-- ... other input types -->
  </n-form-item>
</template>
```

### Best Practices Demonstrated

#### 1. TypeScript Integration
- Full type safety with generic constraints
- Interface definitions for all data structures
- Proper type validation in forms

#### 2. Reactive State Management
- Vue 3 Composition API with reactive refs
- Centralized store pattern with domain separation
- Auto-save functionality with watchers

#### 3. Component Architecture
- Single responsibility principle
- Slot-based customization
- Event-driven communication

#### 4. Error Handling
- Form validation with user-friendly messages
- Confirmation dialogs for destructive actions
- Graceful error states and recovery

#### 5. Performance Optimization
- Lazy loading of heavy components
- Computed properties for derived data
- Efficient re-rendering with proper keys

### Testing Strategy

#### 1. Component Testing
Test the CrudManager component with different configurations:

```typescript
test('CrudManager displays categories correctly', () => {
  const wrapper = mount(CrudManager, {
    props: {
      title: 'Categories',
      items: mockCategories,
      showTags: true,
      showColors: true
    }
  });
  
  expect(wrapper.find('.business-categories')).toBeTruthy();
});
```

#### 2. Integration Testing
Test the complete workflow from category creation to business assignment:

```typescript
test('category deletion removes from businesses', async () => {
  // Create category
  // Assign to business
  // Delete category
  // Verify business no longer has category
});
```

### Migration and Compatibility

#### 1. Backward Compatibility
The categories feature maintains compatibility with existing data:

```typescript
// Handle existing businesses without categoryIds
const categoryIds = business.categoryIds || [];
```

#### 2. Data Migration
When updating existing installations:

```typescript
// Migrate existing category references
businesses.value.forEach(business => {
  if (business.category && !business.categoryIds) {
    business.categoryIds = [business.category];
    delete business.category;
  }
});
```

### Extension Points

#### 1. Tag Filtering
The tag system can be extended for advanced filtering:

```typescript
const filterBusinessesByTag = (tag: string) => {
  return businesses.value.filter(business => 
    business.categoryIds.some(catId => {
      const category = getCategoryById(catId);
      return category?.tags?.includes(tag);
    })
  );
};
```

#### 2. Category Analytics
Business count tracking provides insights:

```typescript
const getCategoryAnalytics = () => {
  return categories.value.map(category => ({
    ...category,
    businessCount: getBusinessCount(category.id),
    popularTags: getPopularTags(category.id)
  }));
};
```

This implementation demonstrates modern Vue 3 development practices while maintaining flexibility for future enhancements and ensuring excellent developer experience through comprehensive TypeScript support.