# Component Structure

## Core Components

### App.vue
- Root component establishing Postmate connection
- Loads initial configuration from parent
- Wraps the main Setting component

### Setting.vue
- Main UI container with sidebar navigation
- Manages active view state (Businesses/Styles/Preview)
- Handles overall layout and navigation

### BusinessView.vue
- Displays list of business listings
- Add/Edit/Delete business functionality
- Category and location management

### StyleView.vue
- Global styling configuration
- Font selection and sizing
- Color scheme customization
- Special styling for "Featured" and "Popular" businesses

### Preview.vue
- Real-time preview of generated business directory
- Shows exact output as it will appear
- Updates automatically on any change

### AddEditBusiness.vue
- Modal for creating/editing individual businesses
- Contact information management
- Category and location assignment
- Input validation

## Shared Components

### BusinessCard.vue
Reusable business card component used across the application:

```vue
<template>
  <div class="business-card" @click="$emit('edit', business)">
    <div class="business-header">
      <h3>{{ business.name }}</h3>
      <div class="business-actions">
        <button @click.stop="$emit('edit', business)">Edit</button>
        <button @click.stop="$emit('delete', business.id)">Delete</button>
      </div>
    </div>
    <p v-if="business.tagline">{{ business.tagline }}</p>
    <div class="business-contact" v-if="business.contact">
      <span v-if="business.contact.phone">📞 {{ business.contact.phone }}</span>
      <span v-if="business.contact.address">📍 {{ business.contact.address }}</span>
    </div>
  </div>
</template>
```

### FormField.vue
Generic form field component for consistent styling:

```vue
<template>
  <div class="form-field">
    <label>{{ label }}</label>
    <n-input v-if="type === 'input'" v-model:value="modelValue" />
    <n-select v-else-if="type === 'select'" v-model:value="modelValue" :options="options" />
    <n-color-picker v-else-if="type === 'color'" v-model:value="modelValue" />
    <n-checkbox v-else-if="type === 'checkbox'" v-model:checked="modelValue" />
  </div>
</template>
```

## Component Communication Patterns

### Parent-Child Communication
```vue
<!-- Using v-model for two-way binding -->
<BusinessView v-model:businesses="businesses" />

<!-- Event emission for actions -->
<AddEditBusiness 
  @success="handleSave"
  @close="showOverview = true"
/>
```

### Props and Emits Definition
```typescript
// TypeScript component definition
interface Props {
  business?: BusinessInterface;
  showActions?: boolean;
}

const emit = defineEmits<{
  (e: 'edit', business: BusinessInterface): void;
  (e: 'delete', id: string): void;
}>();
```

## Composition API Usage

### Script Setup Pattern
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from '@/store'

const { businesses, addBusiness } = useStore()
const searchTerm = ref('')

const filteredBusinesses = computed(() => 
  businesses.value.filter(b => 
    b.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
)
</script>
```

### Composable Integration
```typescript
// Using CRUD composable
const businessCrud = useCrud({
  items: businesses,
  createDefault: () => ({ 
    name: '', 
    categoryIds: [], 
    locationIds: [] 
  })
})

const { 
  create, 
  update, 
  remove, 
  startEdit, 
  saveItem 
} = businessCrud
```

## Component Best Practices

### Single Responsibility
Each component has a focused, single purpose:
- **BusinessView**: Manages business list display and CRUD operations
- **StyleView**: Handles styling configuration only
- **Preview**: Shows generated output without editing capabilities

### Reactive Data Flow
```vue
<!-- Data flows down via props -->
<BusinessCard 
  v-for="business in businesses"
  :key="business.id"
  :business="business"
  @edit="handleEdit"
  @delete="handleDelete"
/>
```

### Error Boundaries
```vue
<script setup>
const handleError = (error: Error) => {
  console.error('Component error:', error)
  // Show user-friendly error message
  showNotification('error', 'Something went wrong')
}
</script>

<template>
  <div v-try="handleError">
    <!-- Component content -->
  </div>
</template>
```

## Styling Architecture

### Scoped Styles
Components use scoped styles to avoid conflicts:

```vue
<style scoped>
.business-card {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.business-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>
```

### CSS Classes Constants
Centralized class definitions for consistency:

```typescript
// src/utils/const.ts
export const CSS_CLASSES = {
  TITLE_LARGE: 'text-2xl font-bold',
  GRID_RESPONSIVE: 'grid grid-cols-1 gap-2 md:grid-cols-2',
  BUTTON_PRIMARY: 'type-info',
  FLEX_BETWEEN: 'flex justify-between items-center'
} as const
```

## Performance Optimizations

### Lazy Loading
Heavy components are loaded asynchronously:

```typescript
// Lazy loading with code splitting
const BusinessView = defineAsyncComponent(() => import('./BusinessView.vue'))
const StyleView = defineAsyncComponent(() => import('./StyleView.vue'))
const Preview = defineAsyncComponent(() => import('./Preview.vue'))
```

### Virtual Scrolling
For large lists of businesses:

```vue
<template>
  <VirtualList
    :items="businesses"
    :item-height="120"
    v-slot="{ item }"
  >
    <BusinessCard :business="item" />
  </VirtualList>
</template>
```

### Memoization
Expensive computations are memoized:

```typescript
const expensiveComputation = computed(() => {
  // Complex business filtering/sorting logic
  return businesses.value
    .filter(filterLogic)
    .sort(sortLogic)
    .map(transformLogic)
})
```