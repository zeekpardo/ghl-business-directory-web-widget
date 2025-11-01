# Code Generation

## HTML Generation Strategy

1. **Inline Styles**: All styles are inline for maximum portability
2. **Semantic Structure**: Clean, accessible HTML markup
3. **Responsive Grid**: CSS Grid with mobile-first breakpoints
4. **Google Fonts**: Dynamic font imports based on selection

## Generated Code Example

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

## JavaScript Generation

- Event listeners for button clicks
- URL opening functionality
- No external dependencies
- Clean, minimal code

## useTranspiler Composable

The core code generation logic is handled by the `useTranspiler` composable:

```typescript
export const useTranspiler = () => {
  const { businesses, displayOptions, layoutSettings, agencySettings } = useStore();
  
  // Environment detection for consistent rendering
  const environment = detectEnvironment();

  // HTML generation
  const html = computed(() => {
    const maxBusinesses = layoutSettings.value.maxBusinessesDisplay;
    const businessesToShow = businesses.value.slice(0, maxBusinesses);
    
    return `
      <div class="business-directory">
        <div class="business-grid" data-grid-columns="${layoutSettings.value.gridColumns}">
          ${businessesToShow.map(generateBusinessCard).join('')}
        </div>
      </div>
    `;
  });

  // CSS generation with environment-specific optimizations
  const css = computed(() => {
    const baseCSS = generateBaseCSS();
    const environmentCSS = generateNormalizedCSS(environment);
    return `<style>${baseCSS}${environmentCSS}</style>`;
  });

  // JavaScript generation
  const js = computed(() => generateNormalizedJS(environment));

  // Combined HTML preview
  const htmlPreview = computed(() => `${css.value}${html.value}`);

  return { htmlPreview, js, environment };
};
```

## Business Card Template

Each business is rendered using a consistent template:

```typescript
const generateBusinessCard = (business: BusinessInterface) => `
  <div class="business-card" onclick="handleBusinessClick('${business.buttonAction || '#'}')">
    ${generateBadges(business)}
    ${generateImageContainer(business)}
    ${generateContent(business)}
    ${generateAgencyAttribution()}
  </div>
`;
```

## CSS Generation

### Base Styles
```css
/* Environment-specific normalization */
*, *::before, *::after { 
  box-sizing: border-box; 
  margin: 0; 
  padding: 0; 
}

/* Font loading and rendering consistency */
body { 
  -webkit-font-smoothing: antialiased; 
  -moz-osx-font-smoothing: grayscale; 
  text-rendering: optimizeLegibility; 
}
```

### Responsive Grid System
```css
.business-grid { 
  display: grid; 
  gap: 1.5rem; 
  width: 100%;
  grid-template-columns: repeat(3, 1fr); /* Default 3 columns */
}

.business-grid[data-grid-columns="1"] { grid-template-columns: 1fr; }
.business-grid[data-grid-columns="2"] { grid-template-columns: repeat(2, 1fr); }
.business-grid[data-grid-columns="3"] { grid-template-columns: repeat(3, 1fr); }
.business-grid[data-grid-columns="4"] { grid-template-columns: repeat(4, 1fr); }
.business-grid[data-grid-columns="5"] { grid-template-columns: repeat(5, 1fr); }

@media (max-width: 768px) { 
  .business-grid { 
    grid-template-columns: 1fr !important; 
  } 
}
```

## JavaScript Generation

### Environment-Aware Click Handling
```javascript
// Environment detection
window.widgetEnvironment = {
  isPreview: true/false,
  isGHLCanvas: true/false,
  isLiveWebsite: true/false
};

// Consistent click handling across environments
function handleBusinessClick(url) {
  if (!url || url === '#') return;
  
  const environment = window.widgetEnvironment;
  
  if (environment.isGHLCanvas) {
    // GHL Canvas behavior - emit custom event
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'ghl-widget-action',
        action: 'navigate',
        url: url,
        source: 'business-directory'
      }, '*');
    }
  } else if (environment.isPreview) {
    // Preview behavior - open in new tab for testing
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    // Live website behavior - normal navigation
    window.location.href = url;
  }
}
```

### DOM Initialization
```javascript
document.addEventListener('DOMContentLoaded', function() {
  // Add cursor pointer to all business cards
  document.querySelectorAll('.business-card').forEach(card => {
    card.style.cursor = 'pointer';
  });
  
  // Handle image loading errors consistently
  document.querySelectorAll('.business-image').forEach(img => {
    img.onerror = function() {
      this.classList.add('hidden');
      this.nextElementSibling.classList.remove('hidden');
      this.nextElementSibling.classList.add('show');
    };
  });
});
```

## Environment Optimization

### GHL Canvas Optimizations
- Remove CSS transitions for better performance
- Strip console logs in production
- Force full-width layouts with `!important`
- Add z-index adjustments for proper layering

### Preview Tab Features
- Keep all debugging information
- Preserve console logs for development
- Add validation warnings
- Max-width constraints for desktop viewing

### Live Website Optimizations
- Production-optimized JavaScript
- Remove development-only features
- Minimal logging
- Standard responsive behavior

## Code Validation

The generated code goes through validation checks:

```typescript
export const validateConsistency = (generatedHTML: string, generatedJS: string): string[] => {
  const issues: string[] = [];
  
  // Check for hardcoded dimensions
  if (generatedHTML.includes('width="') || generatedHTML.includes('height="')) {
    issues.push('Hardcoded dimensions detected. Use CSS for responsive design.');
  }
  
  // Check for missing alt attributes on images
  const imgTags = generatedHTML.match(/<img[^>]*>/g) || [];
  const missingAlt = imgTags.filter(img => !img.includes('alt=')).length;
  if (missingAlt > 0) {
    issues.push(`${missingAlt} images missing alt attributes.`);
  }
  
  // Check JavaScript consistency
  if (!generatedJS.includes('handleBusinessClick')) {
    issues.push('Missing consistent click handler function.');
  }
  
  return issues;
};
```

## Performance Monitoring

The code generation system tracks performance metrics:

- Bundle size reduction (44% for GHL Canvas)
- HTML/CSS optimization statistics
- JavaScript minification results
- Validation issue tracking

## Output Structure

The final generated output includes:

1. **HTML**: Semantic business directory structure
2. **CSS**: Embedded stylesheet with responsive design
3. **JavaScript**: Interactive functionality and event handlers
4. **Metadata**: Environment information and generation timestamps