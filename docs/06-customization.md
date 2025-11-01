# Customization Guide

## Adding New Business Properties

### 1. Update TypeScript Interface
```typescript
// src/types/index.ts
interface BusinessInterface {
  // ... existing properties
  hours?: string;  // New property for business hours
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}
```

### 2. Update UI Components
```vue
<!-- AddEditBusiness.vue -->
<FormField 
  label="Business Hours" 
  type="input" 
  v-model="form.hours" 
  placeholder="e.g., Mon-Fri 9AM-5PM" 
/>

<FormField 
  label="Facebook URL" 
  type="input" 
  v-model="form.socialMedia.facebook" 
  placeholder="https://facebook.com/business" 
/>
```

### 3. Update Code Generation
```typescript
// useTranspiler.ts
const generateBusinessCard = (business: BusinessInterface) => `
  <div class="business-card">
    ${business.hours ? `<span class="hours">${business.hours}</span>` : ''}
    ${generateSocialLinks(business.socialMedia)}
    <!-- ... rest of card content -->
  </div>
`;

const generateSocialLinks = (socialMedia?: BusinessInterface['socialMedia']) => {
  if (!socialMedia) return '';
  
  return `
    <div class="social-links">
      ${socialMedia.facebook ? `<a href="${socialMedia.facebook}" target="_blank">📘</a>` : ''}
      ${socialMedia.instagram ? `<a href="${socialMedia.instagram}" target="_blank">📷</a>` : ''}
      ${socialMedia.twitter ? `<a href="${socialMedia.twitter}" target="_blank">🐦</a>` : ''}
    </div>
  `;
};
```

### 4. Update Store Management
```typescript
// src/store/businesses.ts
export const useBusinessStore = () => {
  const createDefaultBusiness = (): BusinessInterface => ({
    id: '',
    name: '',
    categoryIds: [],
    locationIds: [],
    hours: '', // Include new property in defaults
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: ''
    }
  });
  
  // ... rest of store logic
};
```

## Styling Customization

### 1. Add New Style Options
```typescript
// src/store/settings.ts
export const useSettingsStore = () => {
  const cardStyles = ref({
    // ... existing styles
    accentColor: '#FF6B6B',
    borderRadius: '8px',
    shadowIntensity: 'medium'
  });
  
  return { cardStyles };
};
```

### 2. Create UI Controls
```vue
<!-- StyleView.vue -->
<div class="style-section">
  <h3>Card Appearance</h3>
  
  <FormField 
    label="Accent Color" 
    type="color" 
    v-model="cardStyles.accentColor" 
  />
  
  <FormField 
    label="Border Radius" 
    type="select" 
    v-model="cardStyles.borderRadius"
    :options="[
      { label: 'None', value: '0px' },
      { label: 'Small', value: '4px' },
      { label: 'Medium', value: '8px' },
      { label: 'Large', value: '16px' }
    ]"
  />
  
  <FormField 
    label="Shadow Intensity" 
    type="select" 
    v-model="cardStyles.shadowIntensity"
    :options="[
      { label: 'None', value: 'none' },
      { label: 'Light', value: 'light' },
      { label: 'Medium', value: 'medium' },
      { label: 'Heavy', value: 'heavy' }
    ]"
  />
</div>
```

### 3. Apply Styles in Code Generation
```typescript
// useTranspiler.ts
const generateCardStyles = () => {
  const { cardStyles } = useStore();
  
  const shadowMap = {
    none: 'none',
    light: '0 1px 3px rgba(0,0,0,0.1)',
    medium: '0 4px 12px rgba(0,0,0,0.15)',
    heavy: '0 8px 25px rgba(0,0,0,0.25)'
  };
  
  return `
    .business-card {
      border-radius: ${cardStyles.value.borderRadius};
      box-shadow: ${shadowMap[cardStyles.value.shadowIntensity]};
      border-left: 4px solid ${cardStyles.value.accentColor};
    }
    
    .business-title {
      color: ${cardStyles.value.accentColor};
    }
  `;
};
```

## Custom Display Options

### 1. Add Display Toggles
```typescript
// src/store/settings.ts
export const useSettingsStore = () => {
  const displayOptions = ref({
    // ... existing options
    showHours: true,
    showSocialLinks: true,
    showQRCode: false,
    showMap: false
  });
  
  return { displayOptions };
};
```

### 2. Create UI Controls
```vue
<!-- StyleView.vue -->
<div class="display-options">
  <h3>Display Options</h3>
  
  <FormField 
    label="Show Business Hours" 
    type="checkbox" 
    v-model="displayOptions.showHours" 
  />
  
  <FormField 
    label="Show Social Media Links" 
    type="checkbox" 
    v-model="displayOptions.showSocialLinks" 
  />
  
  <FormField 
    label="Show QR Code" 
    type="checkbox" 
    v-model="displayOptions.showQRCode" 
  />
</div>
```

### 3. Conditional Rendering
```typescript
// useTranspiler.ts
const generateBusinessCard = (business: BusinessInterface) => {
  const { displayOptions } = useStore();
  
  return `
    <div class="business-card">
      <!-- Core content always shown -->
      <h3>${business.name}</h3>
      
      <!-- Conditional content based on display options -->
      ${displayOptions.value.showHours && business.hours ? 
        `<div class="hours">${business.hours}</div>` : ''}
      
      ${displayOptions.value.showSocialLinks ? 
        generateSocialLinks(business.socialMedia) : ''}
      
      ${displayOptions.value.showQRCode ? 
        generateQRCode(business.buttonAction) : ''}
    </div>
  `;
};
```

## Custom Button Actions

### 1. Define Action Types
```typescript
// src/types/index.ts
export type ButtonAction = 
  | { type: 'url'; value: string }
  | { type: 'phone'; value: string }
  | { type: 'email'; value: string }
  | { type: 'ghl-funnel'; value: string }
  | { type: 'popup'; value: { title: string; content: string } };

interface BusinessInterface {
  // ... other properties
  buttonAction?: ButtonAction;
}
```

### 2. Create Action Selector UI
```vue
<!-- AddEditBusiness.vue -->
<div class="button-action-section">
  <FormField 
    label="Button Action Type" 
    type="select" 
    v-model="form.buttonActionType"
    :options="[
      { label: 'Website URL', value: 'url' },
      { label: 'Phone Call', value: 'phone' },
      { label: 'Email', value: 'email' },
      { label: 'GHL Funnel', value: 'ghl-funnel' },
      { label: 'Popup', value: 'popup' }
    ]"
  />
  
  <!-- Dynamic fields based on action type -->
  <FormField 
    v-if="form.buttonActionType === 'url'"
    label="Website URL" 
    type="input" 
    v-model="form.buttonActionValue" 
  />
  
  <FormField 
    v-if="form.buttonActionType === 'phone'"
    label="Phone Number" 
    type="input" 
    v-model="form.buttonActionValue" 
  />
  
  <!-- Add more conditional fields -->
</div>
```

### 3. Generate Action-Specific JavaScript
```typescript
// useTranspiler.ts
const generateClickHandler = () => `
  function handleBusinessClick(actionData) {
    const action = JSON.parse(actionData);
    
    switch(action.type) {
      case 'url':
        window.open(action.value, '_blank');
        break;
        
      case 'phone':
        window.location.href = 'tel:' + action.value;
        break;
        
      case 'email':
        window.location.href = 'mailto:' + action.value;
        break;
        
      case 'ghl-funnel':
        if (window.parent !== window) {
          window.parent.postMessage({
            type: 'navigate-to-funnel',
            funnelId: action.value
          }, '*');
        }
        break;
        
      case 'popup':
        showCustomPopup(action.value.title, action.value.content);
        break;
    }
  }
`;
```

## Layout Customizations

### 1. Add Layout Options
```typescript
// src/store/settings.ts
export const useSettingsStore = () => {
  const layoutSettings = ref({
    // ... existing settings
    cardLayout: 'vertical', // 'vertical' | 'horizontal' | 'compact'
    imagePosition: 'top', // 'top' | 'left' | 'right' | 'background'
    contentAlignment: 'left' // 'left' | 'center' | 'right'
  });
  
  return { layoutSettings };
};
```

### 2. Generate Layout-Specific CSS
```typescript
// useTranspiler.ts
const generateLayoutCSS = () => {
  const { layoutSettings } = useStore();
  
  const layoutStyles = {
    vertical: `
      .business-card {
        flex-direction: column;
      }
      .image-container {
        width: 100%;
        margin-bottom: 1rem;
      }
    `,
    horizontal: `
      .business-card {
        flex-direction: row;
        align-items: flex-start;
      }
      .image-container {
        width: 200px;
        margin-right: 1rem;
        flex-shrink: 0;
      }
    `,
    compact: `
      .business-card {
        padding: 0.75rem;
      }
      .business-title {
        font-size: 1.25rem;
      }
    `
  };
  
  return layoutStyles[layoutSettings.value.cardLayout] || layoutStyles.vertical;
};
```

## Theme System

### 1. Define Theme Structure
```typescript
// src/utils/theme.ts
export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    border: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
}

export const themes: Record<string, Theme> = {
  modern: {
    name: 'Modern',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      background: '#FFFFFF',
      text: '#1F2937',
      border: '#E5E7EB'
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif'
    },
    spacing: {
      small: '0.5rem',
      medium: '1rem',
      large: '2rem'
    }
  },
  // Add more themes...
};
```

### 2. Apply Theme to Generated Code
```typescript
// useTranspiler.ts
const generateThemedCSS = () => {
  const { currentTheme } = useStore();
  const theme = themes[currentTheme.value];
  
  return `
    .business-directory {
      background-color: ${theme.colors.background};
      color: ${theme.colors.text};
      font-family: ${theme.fonts.body};
    }
    
    .business-card {
      border-color: ${theme.colors.border};
      background-color: ${theme.colors.background};
    }
    
    .business-title {
      color: ${theme.colors.primary};
      font-family: ${theme.fonts.heading};
    }
    
    .badge.featured {
      background-color: ${theme.colors.primary};
    }
    
    .badge.popular {
      background-color: ${theme.colors.secondary};
    }
  `;
};
```

This customization system allows for extensive flexibility while maintaining code organization and type safety throughout the application.