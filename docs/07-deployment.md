# Deployment

## Local Development

```bash
npm run dev
# Opens at http://localhost:5173
```

## Production Build

```bash
# Type check and build
npm run build

# Preview production build
npm run preview
```

## GitHub Pages Deployment

```bash
# Automated build and deploy
npm run deploy
```

This command will:
1. Build the project for production
2. Create a `gh-pages` branch (if it doesn't exist)
3. Push the built files to GitHub Pages
4. Your widget will be available at `https://username.github.io/repository-name`

## GoHighLevel Integration

### 1. Build and Host
```bash
# Build the widget
npm run build

# The dist/ folder contains all files needed for deployment
```

### 2. Hosting Options

#### Option A: GitHub Pages (Recommended)
1. Run `npm run deploy`
2. Use the GitHub Pages URL in GHL iframe

#### Option B: Custom Server
1. Upload `dist/` folder contents to your web server
2. Ensure CORS headers are configured
3. Use your domain URL in GHL iframe

#### Option C: CDN Deployment
```bash
# Example with Netlify
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### 3. Configure in GoHighLevel
1. Create a new widget element in your funnel
2. Set iframe source to your hosted URL
3. Configure Postmate communication
4. Test widget functionality

## Environment Configuration

### Development Environment
```bash
# .env.development
VITE_APP_ENV=development
VITE_DEBUG_MODE=true
VITE_API_BASE_URL=http://localhost:3000
```

### Production Environment
```bash
# .env.production
VITE_APP_ENV=production
VITE_DEBUG_MODE=false
VITE_API_BASE_URL=https://api.yourdomain.com
```

## Build Optimization

### Bundle Analysis
```bash
# Analyze bundle size
npm run build -- --analyze
```

### Performance Monitoring
```bash
# Check bundle sizes after build
npm run build

# Typical sizes:
# - Main bundle: ~300KB (optimized)
# - Chunks: <50KB each
# - Total gzipped: ~100KB
```

## Deployment Checklist

### Pre-Deployment Testing
- [ ] Test in multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Verify mobile responsiveness
- [ ] Check Postmate communication
- [ ] Validate generated code functionality
- [ ] Test state persistence
- [ ] Verify all images load correctly
- [ ] Test error handling scenarios

### Production Deployment
- [ ] Run `npm run build` successfully
- [ ] No TypeScript errors
- [ ] All tests passing (if applicable)
- [ ] Bundle size within acceptable limits
- [ ] Environment variables configured
- [ ] CORS headers configured on server
- [ ] HTTPS enabled (required for iframe embedding)

### Post-Deployment Verification
- [ ] Widget loads in iframe context
- [ ] Postmate communication working
- [ ] Generated code renders correctly
- [ ] Button interactions function properly
- [ ] State persists between sessions
- [ ] Mobile device testing
- [ ] Performance monitoring

## Server Configuration

### CORS Headers
If hosting on your own server, ensure these headers are set:

```nginx
# Nginx configuration
add_header Access-Control-Allow-Origin "*";
add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
add_header Access-Control-Allow-Headers "Origin, Content-Type, Accept";
```

```apache
# Apache configuration
Header always set Access-Control-Allow-Origin "*"
Header always set Access-Control-Allow-Methods "GET, POST, OPTIONS"
Header always set Access-Control-Allow-Headers "Origin, Content-Type, Accept"
```

### HTTPS Configuration
```nginx
# Force HTTPS redirect
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

## Continuous Deployment

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Netlify Deployment
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "16"
```

## Monitoring and Analytics

### Error Tracking
```typescript
// Add to main.ts for production error tracking
if (import.meta.env.PROD) {
  window.addEventListener('error', (event) => {
    // Send error to monitoring service
    console.error('Widget error:', event.error);
  });
}
```

### Performance Monitoring
```typescript
// Track widget load time
const startTime = performance.now();

onMounted(() => {
  const loadTime = performance.now() - startTime;
  console.log(`Widget loaded in ${loadTime}ms`);
  
  // Send metrics to analytics service if needed
});
```

## Troubleshooting Deployment

### Common Issues

1. **CORS Errors**
   - Ensure server has correct CORS headers
   - Use HTTPS for production deployment
   - Check browser console for specific errors

2. **Build Failures**
   - Check TypeScript errors: `npm run type-check`
   - Verify all dependencies installed: `npm ci`
   - Clear node_modules and reinstall if needed

3. **Widget Not Loading in GHL**
   - Verify iframe URL is correct and accessible
   - Check browser developer tools for errors
   - Ensure HTTPS is used for production

4. **Postmate Communication Issues**
   - Verify parent page has Postmate configured
   - Check for same-origin policy violations
   - Monitor browser console for communication errors

### Debug Mode
```typescript
// Enable debug logging in development
if (import.meta.env.DEV) {
  console.log('Widget environment:', environment);
  console.log('Generated code size:', htmlPreview.value.length);
}
```