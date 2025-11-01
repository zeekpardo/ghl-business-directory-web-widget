# GoHighLevel Integration

## Widget Communication Protocol

### 1. Initialization Handshake
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

### 2. Code Emission Pattern
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

### 3. Custom Events (Future Enhancement)
```javascript
// In generated JS code
button.addEventListener('click', () => {
  window.parent.postMessage({
    type: 'customWidgetOpenPopup',
    url: 'https://example.com'
  }, '*')
})
```

## GoHighLevel Requirements Checklist
- ✅ No absolute URLs in widget code
- ✅ Self-contained output (inline styles)
- ✅ Responsive design support
- ✅ State persistence via elementStore
- ✅ Real-time code updates
- ✅ Clean separation between widget and output

## Environment Detection

The widget automatically detects when it's running in different environments:

```typescript
// src/utils/environmentSync.ts
export const detectEnvironment = (): EnvironmentContext => {
  const isInIframe = window !== window.parent;
  const isGHLCanvas = isInIframe && (
    userAgent.includes('GoHighLevel') ||
    currentUrl.includes('gohighlevel') ||
    document.referrer.includes('gohighlevel')
  );
  
  return { isPreview, isGHLCanvas, isLiveWebsite };
}
```

## GHL-Specific Optimizations

### Performance Optimizations
- **Bundle size reduction**: 44% smaller JavaScript for GHL Canvas
- **Transition removal**: CSS transitions disabled for better performance
- **Console log removal**: Production builds strip debugging output

### Layout Adjustments
```css
/* GHL Canvas specific adjustments */
.business-directory { 
  margin: 0 !important; 
  padding: 1rem !important; 
  width: 100% !important;
  max-width: none !important;
}
```

### Click Handler Behavior
```javascript
function handleBusinessClick(url) {
  const environment = window.widgetEnvironment;
  
  if (environment.isGHLCanvas) {
    // Emit custom GHL event
    window.parent.postMessage({
      type: 'ghl-widget-action',
      action: 'navigate',
      url: url
    }, '*');
  } else if (environment.isPreview) {
    // Open in new tab for testing
    window.open(url, '_blank');
  } else {
    // Normal navigation for live site
    window.location.href = url;
  }
}
```

## Integration Steps

### 1. Widget Setup in GHL
1. Build the widget: `npm run build`
2. Host the `dist` folder on a web server
3. Configure iframe URL in GoHighLevel
4. Enable Postmate communication

### 2. State Persistence
```typescript
// Comprehensive state emission
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

### 3. Error Handling
```typescript
// Graceful error handling
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

## Testing in GHL Environment

### Development Testing
1. Use GHL Sandbox/Test environment
2. Create test funnel with widget element
3. Monitor browser console for communication
4. Verify state persistence across sessions

### Production Deployment
1. Test in staging GHL account
2. Verify all features work in iframe context
3. Check responsive behavior on mobile
4. Validate generated code functionality

## Troubleshooting GHL Integration

### Common Issues

1. **Postmate Connection Fails**
   - Check parent has Postmate configured
   - Verify same-origin or CORS settings
   - Look for console errors

2. **State Not Persisting**
   - Confirm elementStore is being emitted
   - Check parent is saving the data
   - Verify data structure matches

3. **Styling Issues in GHL**
   - Use `!important` declarations for critical styles
   - Test with GHL's CSS framework
   - Verify inline styles are working

### Debug Mode
```typescript
// Enable console logging for GHL testing
console.info("Emitting code to parent", parent);

// Log generated code
console.log('Generated HTML:', htmlPreview.value);

// Monitor state changes
watch(businesses, (newBusinesses) => {
  console.log('Businesses updated:', newBusinesses);
});
```