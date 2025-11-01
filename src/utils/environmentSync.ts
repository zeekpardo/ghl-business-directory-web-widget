// Environment synchronization utilities for consistent rendering across all contexts

export interface EnvironmentContext {
  isPreview: boolean;
  isGHLCanvas: boolean;
  isLiveWebsite: boolean;
  containerWidth?: number;
  viewportWidth?: number;
}

// Detect current environment context
export const detectEnvironment = (): EnvironmentContext => {
  const isInIframe = window !== window.parent;
  const userAgent = navigator.userAgent;
  const currentUrl = window.location.href;
  
  // Check if we're in GHL canvas/preview
  const isGHLCanvas = isInIframe && (
    userAgent.includes('GoHighLevel') ||
    currentUrl.includes('gohighlevel') ||
    document.referrer.includes('gohighlevel') ||
    window.frameElement?.getAttribute('data-ghl') === 'true'
  );
  
  // Check if we're in our own preview tab
  const isPreview = !isInIframe && currentUrl.includes('localhost');
  
  // Everything else is considered live website
  const isLiveWebsite = !isPreview && !isGHLCanvas;
  
  return {
    isPreview,
    isGHLCanvas,
    isLiveWebsite,
    containerWidth: document.documentElement.clientWidth,
    viewportWidth: window.innerWidth
  };
};

// CSS normalization for consistent rendering
export const generateNormalizedCSS = (context: EnvironmentContext) => {
  const baseCSS = `
    /* CSS Reset for consistent rendering */
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
    
    /* Ensure consistent image rendering */
    img { 
      max-width: 100%; 
      height: auto; 
      -webkit-user-drag: none;
      -khtml-user-drag: none;
      -moz-user-drag: none;
      -o-user-drag: none;
      user-drag: none;
    }
    
    /* SVG consistency */
    svg { 
      display: block; 
      max-width: 100%; 
      height: auto; 
    }
  `;

  // Environment-specific CSS adjustments
  const environmentCSS = context.isGHLCanvas 
    ? `
      /* GHL Canvas specific adjustments */
      .business-directory { 
        margin: 0 !important; 
        padding: 1rem !important; 
        width: 100% !important;
        max-width: none !important;
      }
      .business-grid { 
        width: 100% !important; 
        max-width: none !important;
      }
      /* Force proper z-index in GHL */
      .badges-container { z-index: 999 !important; }
      .overlay-container { z-index: 998 !important; }
    `
    : context.isPreview
    ? `
      /* Preview tab specific adjustments */
      .business-directory { 
        max-width: 1200px; 
        margin: 0 auto; 
      }
    `
    : `
      /* Live website adjustments */
      .business-directory { 
        max-width: 1200px; 
        margin: 0 auto; 
      }
    `;

  return baseCSS + environmentCSS;
};

// JavaScript consistency helpers
export const generateNormalizedJS = (context: EnvironmentContext) => {
  return `
    // Environment detection
    window.widgetEnvironment = ${JSON.stringify(context)};
    
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
        const destination = '${context.isGHLCanvas ? 'website' : 'directory'}';
        if (destination === 'website') {
          window.open(url, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = url;
        }
      }
    }
    
    // Ensure consistent event handling
    document.addEventListener('DOMContentLoaded', function() {
      // Add cursor pointer to all business cards
      document.querySelectorAll('.business-card').forEach(card => {
        card.style.cursor = 'pointer';
      });
      
      // Handle image loading errors consistently
      document.querySelectorAll('.business-image').forEach(img => {
        img.onerror = function() {
          this.style.display = 'none';
          const placeholder = this.nextElementSibling;
          if (placeholder && placeholder.classList.contains('image-placeholder')) {
            placeholder.style.display = 'flex';
          }
        };
      });
      
      // Force layout recalculation for GHL
      if (window.widgetEnvironment.isGHLCanvas) {
        setTimeout(() => {
          const grids = document.querySelectorAll('.business-grid');
          grids.forEach(grid => {
            grid.style.display = 'none';
            grid.offsetHeight; // Force reflow
            grid.style.display = 'grid';
          });
        }, 100);
      }
    });
    
    // Responsive handling
    let resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Update environment context on resize
        window.widgetEnvironment.containerWidth = document.documentElement.clientWidth;
        window.widgetEnvironment.viewportWidth = window.innerWidth;
        
        // Emit resize event for GHL
        if (window.widgetEnvironment.isGHLCanvas && window.parent !== window) {
          window.parent.postMessage({
            type: 'ghl-widget-resize',
            width: window.widgetEnvironment.containerWidth,
            height: document.documentElement.scrollHeight
          }, '*');
        }
      }, 150);
    });
  `;
};

// Validate rendered output consistency
export const validateConsistency = (generatedHTML: string, generatedJS: string): string[] => {
  const issues: string[] = [];
  
  // Check for common inconsistency patterns
  if (generatedHTML.includes('style="')) {
    // Check if CSS classes are used instead of inline styles where possible
    const inlineStyleCount = (generatedHTML.match(/style="/g) || []).length;
    if (inlineStyleCount > 10) {
      issues.push(`High inline style usage (${inlineStyleCount}). Consider using CSS classes for consistency.`);
    }
  }
  
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

// Performance optimization for different environments
export const optimizeForEnvironment = (html: string, css: string, js: string, context: EnvironmentContext) => {
  let optimizedHTML = html;
  let optimizedCSS = css;
  let optimizedJS = js;
  
  if (context.isGHLCanvas) {
    // GHL Canvas optimizations
    optimizedCSS = optimizedCSS.replace(/transition:[^;]+;/g, ''); // Remove transitions for performance
    optimizedJS = optimizedJS.replace(/console\.(log|info|warn)/g, '// console.$1'); // Remove console logs
  } else if (context.isPreview) {
    // Preview optimizations - keep all features for testing
    optimizedJS = `// Preview Mode\n${optimizedJS}`;
  } else {
    // Live website optimizations
    optimizedJS = optimizedJS.replace(/console\.(log|info|warn)/g, '// console.$1'); // Remove console logs
  }
  
  return {
    html: optimizedHTML,
    css: optimizedCSS,
    js: optimizedJS
  };
};