# Troubleshooting

## Common Issues

### 1. Postmate Connection Fails
**Symptoms:**
- Widget loads but doesn't communicate with parent
- No code emission to GoHighLevel
- Console errors about Postmate

**Solutions:**
- Check parent has Postmate configured correctly
- Verify same-origin or CORS settings
- Look for console errors in both parent and iframe
- Ensure iframe URL is accessible via HTTPS

**Debug Steps:**
```javascript
// In widget console
console.log('Postmate handshake:', handshake);

// In parent console  
parent.on('code', (data) => {
  console.log('Received code from widget:', data);
});
```

### 2. Styles Not Applying
**Symptoms:**
- Generated code looks different than preview
- CSS not rendering correctly
- Layout broken in target environment

**Solutions:**
- Ensure inline styles are properly formatted
- Check for CSS specificity issues
- Verify font imports are working
- Use `!important` for critical styles in GHL context

**Debug Steps:**
```css
/* Add debugging styles */
.business-directory {
  border: 2px solid red !important; /* Should be visible if CSS loads */
}
```

### 3. State Not Persisting
**Symptoms:**
- Changes lost when refreshing
- Widget resets to default state
- GoHighLevel not saving configuration

**Solutions:**
- Confirm elementStore is being emitted correctly
- Check parent is saving the data
- Verify data structure matches expected format
- Monitor Postmate communication

**Debug Steps:**
```typescript
// Monitor state emission
watch([businesses, categories], () => {
  console.log('State changed, emitting:', {
    businesses: businesses.value,
    categories: categories.value
  });
  emitCode();
});
```

### 4. JavaScript Errors in Generated Code
**Symptoms:**
- Click handlers not working
- Console errors in generated output
- Functionality broken when embedded

**Solutions:**
- Check for syntax errors in generated JavaScript
- Ensure all required functions are included
- Verify event listeners are properly attached
- Test generated code in isolation

**Debug Steps:**
```html
<!-- Test generated code independently -->
<!DOCTYPE html>
<html>
<head>
  <title>Widget Test</title>
</head>
<body>
  <!-- Paste generated HTML here -->
  <!-- Paste generated CSS here -->
  <!-- Paste generated JavaScript here -->
</body>
</html>
```

### 5. Mobile Responsiveness Issues
**Symptoms:**
- Layout broken on mobile devices
- Cards not stacking properly
- Text too small or large

**Solutions:**
- Test responsive CSS media queries
- Verify viewport meta tag in parent page
- Check touch interactions work properly
- Ensure images scale correctly

**Debug Steps:**
```css
/* Add mobile debugging */
@media (max-width: 768px) {
  .business-grid {
    background: yellow !important; /* Should be yellow on mobile */
    grid-template-columns: 1fr !important;
  }
}
```

### 6. Images Not Loading
**Symptoms:**
- Broken image icons
- Image placeholders not showing
- Error handling not working

**Solutions:**
- Check image URLs are valid and accessible
- Verify CORS headers for external images
- Ensure error handling JavaScript is working
- Test with different image formats

**Debug Steps:**
```javascript
// Test image loading
document.querySelectorAll('.business-image').forEach(img => {
  img.onload = () => console.log('Image loaded:', img.src);
  img.onerror = () => console.error('Image failed:', img.src);
});
```

## Debug Mode

### Enable Comprehensive Logging
```typescript
// Add to main.ts or App.vue
if (import.meta.env.DEV) {
  // Enable all console logs
  console.log('Widget environment:', environment);
  console.log('Store state:', JSON.stringify(store, null, 2));
  
  // Monitor all state changes
  watchEffect(() => {
    console.log('Businesses changed:', businesses.value);
  });
  
  watchEffect(() => {
    console.log('Generated HTML size:', htmlPreview.value.length);
  });
}
```

### Postmate Communication Debugging
```typescript
// Monitor all Postmate events
handshake.then(parent => {
  console.log('✅ Postmate connected');
  
  // Log all emissions
  const originalEmit = parent.emit;
  parent.emit = function(event, data) {
    console.log(`📤 Emitting ${event}:`, data);
    return originalEmit.call(this, event, data);
  };
});
```

### Generated Code Validation
```typescript
// Add validation checks
const validateGeneratedCode = () => {
  const issues = [];
  
  // Check HTML structure
  if (!htmlPreview.value.includes('business-grid')) {
    issues.push('Missing business grid container');
  }
  
  // Check JavaScript functionality
  if (!js.value.includes('handleBusinessClick')) {
    issues.push('Missing click handler function');
  }
  
  // Check CSS presence
  if (!htmlPreview.value.includes('<style>')) {
    issues.push('Missing embedded styles');
  }
  
  if (issues.length > 0) {
    console.warn('🚨 Generated code issues:', issues);
  }
  
  return issues;
};
```

## GoHighLevel Specific Issues

### 1. Widget Not Loading in GHL
**Symptoms:**
- Iframe shows blank or error page
- Widget doesn't appear in funnel

**Solutions:**
- Verify iframe URL is HTTPS
- Check CORS headers on hosting server
- Ensure widget URL is publicly accessible
- Test URL in standalone browser tab first

### 2. GHL Funnel Integration Problems
**Symptoms:**
- Button clicks don't navigate to funnels
- Custom events not triggering

**Solutions:**
- Verify GHL event message format
- Check parent window message handlers
- Use correct GHL funnel URLs
- Test with GHL debugging tools

### 3. Styling Conflicts in GHL
**Symptoms:**
- Widget styles overridden by GHL CSS
- Layout broken in GHL context

**Solutions:**
- Use more specific CSS selectors
- Add `!important` to critical styles
- Isolate widget styles with unique classes
- Test in actual GHL environment

## Performance Issues

### 1. Slow Loading Times
**Solutions:**
- Optimize images (use WebP format, compress)
- Minimize generated JavaScript
- Use code splitting for large components
- Enable gzip compression on server

### 2. Memory Leaks
**Solutions:**
- Clean up event listeners properly
- Avoid circular references in state
- Use WeakMap/WeakSet for temporary data
- Monitor memory usage in DevTools

### 3. Large Bundle Sizes
**Solutions:**
- Implement lazy loading for components
- Remove unused dependencies
- Use tree shaking for imports
- Minimize generated CSS

## Testing Strategies

### 1. Cross-Browser Testing
```bash
# Test in multiple browsers
open -a "Google Chrome" http://localhost:5173
open -a "Firefox" http://localhost:5173
open -a "Safari" http://localhost:5173
```

### 2. Mobile Device Testing
```bash
# Use browser DevTools device simulation
# Test on actual mobile devices
# Verify touch interactions work
```

### 3. Network Conditions Testing
```javascript
// Simulate slow network
// Test with images disabled
// Verify graceful degradation
```

## Error Reporting

### Production Error Tracking
```typescript
// Add global error handler
window.addEventListener('error', (event) => {
  const errorData = {
    message: event.error?.message,
    stack: event.error?.stack,
    filename: event.filename,
    lineno: event.lineno,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  // Send to error tracking service
  console.error('Widget error:', errorData);
});

// Track unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
```

### User Feedback Collection
```typescript
// Provide feedback mechanism
const reportIssue = (issue: string) => {
  console.log('User reported issue:', issue);
  // Send to support system
};
```

## Getting Help

### Development Support
- Check browser console for errors
- Enable debug mode for detailed logging
- Test in isolation before embedding
- Use Vue DevTools for component debugging

### Community Resources
- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Vue Guide](https://vuejs.org/guide/typescript/overview.html)
- [GoHighLevel Community](https://community.gohighlevel.com/)
- [Postmate Issues](https://github.com/dollarshaveclub/postmate/issues)

### Creating Bug Reports
When reporting issues, include:
1. **Environment details** (browser, OS, GHL version)
2. **Steps to reproduce** the issue
3. **Expected vs actual behavior**
4. **Console errors** and logs
5. **Widget configuration** (anonymized)
6. **Screenshots or screen recordings**