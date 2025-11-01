import { computed } from "vue";
import useStore from "../store";
import { 
  detectEnvironment, 
  generateNormalizedCSS, 
  generateNormalizedJS, 
  validateConsistency,
  optimizeForEnvironment 
} from "../utils/environmentSync";

export const useTranspiler = () => {
  const { businesses, categories, locations, displayOptions, layoutSettings, agencySettings } = useStore();
  
  // Detect current environment for consistent rendering
  const environment = detectEnvironment();

  // SVG Icons
  const icons = {
    business: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>`,
    starFilled: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M394 480a16 16 0 0 1-9.39-3L256 383.76L127.39 477a16 16 0 0 1-24.55-18.08L153 310.35L23 221.2a16 16 0 0 1 9-29.2h160.38l48.4-148.95a16 16 0 0 1 30.44 0l48.4 149H480a16 16 0 0 1 9.05 29.2L359 310.35l50.13 148.53A16 16 0 0 1 394 480z" fill="currentColor"></path></svg>`,
    starEmpty: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M480 208H308L256 48l-52 160H32l140 96l-54 160l138-100l138 100l-54-160z" fill="none" stroke="currentColor" stroke-linejoin="round" style="stroke-width: 32px;"></path></svg>`,
    phone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M391 480c-19.52 0-46.94-7.06-88-30c-49.93-28-88.55-53.85-138.21-103.38C116.91 298.77 93.61 267.79 61 208.45c-36.84-67-30.56-102.12-23.54-117.13C45.82 73.38 58.16 62.65 74.11 52a176.3 176.3 0 0 1 28.64-15.2c1-.43 1.93-.84 2.76-1.21c4.95-2.23 12.45-5.6 21.95-2c6.34 2.38 12 7.25 20.86 16c18.17 17.92 43 57.83 52.16 77.43c6.15 13.21 10.22 21.93 10.23 31.71c0 11.45-5.76 20.28-12.75 29.81c-1.31 1.79-2.61 3.5-3.87 5.16c-7.61 10-9.28 12.89-8.18 18.05c2.23 10.37 18.86 41.24 46.19 68.51s57.31 42.85 67.72 45.07c5.38 1.15 8.33-.59 18.65-8.47c1.48-1.13 3-2.3 4.59-3.47c10.66-7.93 19.08-13.54 30.26-13.54h.06c9.73 0 18.06 4.22 31.86 11.18c18 9.08 59.11 33.59 77.14 51.78c8.77 8.84 13.66 14.48 16.05 20.81c3.6 9.53.21 17-2 22c-.37.83-.78 1.74-1.21 2.75a176.49 176.49 0 0 1-15.29 28.58c-10.63 15.9-21.4 28.21-39.38 36.58A67.42 67.42 0 0 1 391 480z" fill="currentColor"></path></svg>`,
    location: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><circle cx="256" cy="192" r="32" fill="currentColor"></circle><path d="M256 32c-88.22 0-160 68.65-160 153c0 40.17 18.31 93.59 54.42 158.78c29 52.34 62.55 99.67 80 123.22a31.75 31.75 0 0 0 51.22 0c17.42-23.55 51-70.88 80-123.22C397.69 278.61 416 225.19 416 185c0-84.35-71.78-153-160-153zm0 224a64 64 0 1 1 64-64a64.07 64.07 0 0 1-64 64z" fill="currentColor"></path></svg>`
  };

  const generateStarRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(`<i role="img" class="n-icon star-icon star-filled">${icons.starFilled}</i>`);
      } else {
        stars.push(`<i role="img" class="n-icon star-icon star-empty">${icons.starEmpty}</i>`);
      }
    }
    return stars.join('');
  };

  const getBusinessCategories = (categoryIds: string[]) => {
    return categoryIds
      .map(id => categories.value.find(cat => cat.id === id))
      .filter(Boolean)
      .map(category => category!);
  };

  const getBusinessLocations = (locationIds: string[]) => {
    return locationIds
      .map(id => locations.value.find(loc => loc.id === id))
      .filter(Boolean)
      .map(location => location!);
  };

  const html = computed(() => {
    const maxBusinesses = layoutSettings.value.maxBusinessesDisplay;
    const businessesToShow = businesses.value.slice(0, maxBusinesses);
    
    return `
      <div class="business-directory">
        <div class="business-grid" data-grid-columns="${layoutSettings.value.gridColumns}">
          ${businessesToShow
            .map((business) => {
              
              return `
                <div class="business-card" onclick="handleBusinessClick('${business.buttonAction || '#'}')">
                  ${(business.popular || business.featured) && displayOptions.value.showBadges ? `
                    <div class="badges-container">
                      ${business.popular ? `<div class="badge popular">Popular</div>` : ''}
                      ${business.featured ? `<div class="badge featured">Featured</div>` : ''}
                    </div>
                  ` : ''}

                  <div class="image-container">
                    ${business.image && displayOptions.value.showImage ? `
                      <img src="${business.image}" 
                           alt="${business.name}" 
                           class="business-image"
                           onerror="this.classList.add('hidden'); this.nextElementSibling.classList.remove('hidden'); this.nextElementSibling.classList.add('show');" />
                      <div class="image-placeholder hidden">${icons.business}</div>
                    ` : `
                      <div class="image-placeholder">${icons.business}</div>
                    `}
                    
                    <div class="overlay-container">
                      ${business.priceRange && displayOptions.value.showPriceRange ? `
                        <span class="price-range-overlay">${business.priceRange}</span>
                      ` : '<span></span>'}
                      
                      ${business.rating && displayOptions.value.showRating ? `
                        <div class="rating-overlay">
                          ${generateStarRating(business.rating)}
                        </div>
                      ` : ''}
                    </div>
                  </div>

                  <div class="business-content">
                    <h3 class="business-title">
                      <a href="${business.buttonAction || '#'}">${business.name}</a>
                    </h3>

                    ${business.tagline && displayOptions.value.showTagline ? `
                      <p class="business-tagline">${business.tagline}</p>
                    ` : ''}

                    ${business.description && displayOptions.value.showDescription ? `
                      <p class="business-description">${business.description}</p>
                    ` : ''}

                    ${(business.categoryIds.length > 0 && displayOptions.value.showCategories) || (business.locationIds.length > 0 && displayOptions.value.showLocation) ? `
                      <div class="business-tags">
                        ${business.categoryIds.length > 0 && displayOptions.value.showCategories ? getBusinessCategories(business.categoryIds)
                          .map(category => `
                            <span class="category-tag">
                              ${category.name}
                            </span>
                          `).join('') : ''}
                        ${business.locationIds.length > 0 && displayOptions.value.showLocation ? getBusinessLocations(business.locationIds)
                          .map(location => `
                            <span class="location-tag">
                              ${location.name}
                            </span>
                          `).join('') : ''}
                      </div>
                    ` : ''}

                    <div class="contact-info">
                      ${business.contact?.phone && displayOptions.value.showPhone ? `
                        <div class="contact-item">
                          <i role="img" class="n-icon contact-icon">${icons.phone}</i>
                          <a href="tel:${business.contact.phone}">${business.contact.phone}</a>
                        </div>
                      ` : ''}
                      
                      ${business.contact?.address && displayOptions.value.showAddress ? `
                        <div class="contact-item">
                          <i role="img" class="n-icon contact-icon">${icons.location}</i>
                          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.contact.address + (business.contact.city ? ', ' + business.contact.city : '') + (business.contact.state ? ', ' + business.contact.state : '') + (business.contact.zipCode ? ', ' + business.contact.zipCode : '') + (business.contact.country ? ', ' + business.contact.country : ''))}" 
                             target="_blank" 
                             rel="noopener noreferrer">
                            ${business.contact.address}${business.contact.city ? ', ' + business.contact.city : ''}${business.contact.state ? ', ' + business.contact.state : ''}${business.contact.zipCode ? ', ' + business.contact.zipCode : ''}${business.contact.country ? ', ' + business.contact.country : ''}
                          </a>
                        </div>
                      ` : ''}
                    </div>
                  </div>

                  ${agencySettings.value.agencyName && displayOptions.value.showAgencyAttribution ? `
                    <div class="agency-attribution">
                      <a href="${agencySettings.value.agencyWebsite || '#'}" 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         class="agency-link">
                        <span class="agency-logo">
                          ${agencySettings.value.agencyLogo ? `
                            <img src="${agencySettings.value.agencyLogo}" alt="Agency Logo" />
                          ` : `
                            <span class="agency-logo-placeholder">🏢</span>
                          `}
                        </span>
                        <span class="agency-name">${agencySettings.value.agencyName}</span>
                      </a>
                    </div>
                  ` : ''}
                </div>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
  });

  const css = computed(() => {
    const baseCSS = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      
      /* Environment-specific normalization */
      ${generateNormalizedCSS(environment)}
      
      /* Container styles */
      .business-directory { 
        padding: 2rem; 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        width: 100%;
      }
      
      /* Grid layout - Fixed for proper full-width display */
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
      
      /* Business card base styles */
      .business-card { 
        padding: 1.25rem; 
        border-radius: 0.5rem; 
        border: 1px solid rgb(229, 231, 235); 
        background-color: rgb(255, 255, 255); 
        box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px; 
        transform: translateY(0px); 
        transition: all 0.3s ease; 
        height: auto; 
        overflow: hidden; 
        display: flex; 
        flex-direction: column; 
        position: relative; 
        cursor: pointer;
        width: 100%;
      }
      
      .business-card:hover { 
        transform: translateY(-4px); 
        box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 12px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px; 
      }
      
      /* Badge styles */
      .badges-container { 
        position: absolute; 
        top: 1rem; 
        left: 1rem; 
        display: flex; 
        gap: 0.5rem; 
        z-index: 20; 
      }
      
      .badge { 
        font-family: Inter, sans-serif; 
        font-size: 12px; 
        font-weight: 600; 
        padding: 0.25rem 0.5rem; 
        border-radius: 0.25rem; 
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .badge.popular { 
        background-color: rgb(255, 193, 7); 
        color: rgb(0, 0, 0); 
      }
      
      .badge.featured { 
        background-color: rgb(255, 87, 34); 
        color: rgb(255, 255, 255); 
      }
      
      /* Image container */
      .image-container { 
        margin: -1.25rem -1.25rem 1rem -1.25rem; 
        overflow: hidden; 
        border-radius: 0px; 
        height: 200px; 
        position: relative;
        width: calc(100% + 2.5rem);
      }
      
      .business-image { 
        width: 100%; 
        height: 100%; 
        object-fit: cover; 
        transition: 0.3s; 
        display: block;
      }
      
      .image-placeholder { 
        width: 100%; 
        height: 100%; 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        color: white; 
      }
      
      .image-placeholder svg {
        width: 48px !important;
        height: 48px !important;
        display: block !important;
      }
      
      /* Overlay container - Fixed positioning for stars */
      .overlay-container { 
        position: absolute; 
        bottom: 0.75rem; 
        left: 0.75rem; 
        right: 0.75rem; 
        display: flex; 
        justify-content: space-between; 
        align-items: flex-end; 
        pointer-events: none;
        z-index: 10;
      }
      
      .price-range-overlay { 
        font-family: Inter, sans-serif; 
        font-size: 16px; 
        font-weight: 700; 
        color: rgb(255, 255, 255); 
        letter-spacing: 0.05em; 
        text-shadow: rgba(0, 0, 0, 0.8) 0px 2px 4px, rgba(0, 0, 0, 0.6) 0px 1px 2px; 
        padding: 0.25rem 0.5rem;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 0.25rem;
      }
      
      /* Star rating overlay - Enhanced visibility */
      .rating-overlay { 
        display: flex;
        align-items: center;
        gap: 2px; 
        padding: 0.25rem 0.5rem;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 0.25rem;
        backdrop-filter: blur(4px);
      }
      
      /* Star icon styles - Fixed sizing and colors */
      .star-icon { 
        width: 16px !important;
        height: 16px !important;
        display: inline-block !important;
        flex-shrink: 0;
      }
      
      .star-icon svg {
        width: 100% !important;
        height: 100% !important;
        display: block !important;
      }
      
      .star-filled {
        color: rgb(251, 191, 36) !important;
      }
      
      .star-empty {
        color: rgba(255, 255, 255, 0.5) !important;
      }
      
      /* Content area */
      .business-content { 
        padding-top: 1rem; 
        display: flex; 
        flex-direction: column; 
        gap: 0.5rem; 
        flex: 1; 
      }
      
      .business-title { 
        font-family: Inter, sans-serif; 
        font-size: 24px; 
        font-weight: 700; 
        color: rgb(31, 41, 55); 
        line-height: 1.3; 
        margin: 0; 
      }
      
      .business-title a { 
        color: rgb(31, 41, 55); 
        text-decoration: none; 
      }
      
      .business-tagline, .business-description { 
        font-family: Inter, sans-serif; 
        font-size: 14px; 
        font-weight: 400; 
        color: rgb(107, 114, 128); 
        line-height: 1.5; 
        margin: 0; 
      }

      /* Business categories */
      .business-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin: 0.5rem 0;
      }

      .category-tag {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-family: Inter, sans-serif;
        font-size: 12px;
        font-weight: 500;
        line-height: 1.2;
        text-decoration: none;
        white-space: nowrap;
        background-color: #f3f4f6;
        color: #374151;
        border: 1px solid #d1d5db;
        transition: opacity 0.2s ease;
      }

      .category-tag:hover {
        opacity: 0.8;
      }


      .location-tag {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-family: Inter, sans-serif;
        font-size: 12px;
        font-weight: 500;
        line-height: 1.2;
        text-decoration: none;
        white-space: nowrap;
        background-color: #dbeafe;
        color: #1d4ed8;
        border: 1px solid #bfdbfe;
      }

      .location-tag:hover {
        opacity: 0.8;
      }
      
      /* Contact info */
      .contact-info { 
        font-family: Inter, sans-serif; 
        font-size: 14px; 
        color: rgb(107, 114, 128); 
        display: flex; 
        flex-direction: column; 
        gap: 0.5rem; 
      }
      
      .contact-item { 
        display: flex; 
        align-items: center; 
        gap: 0.25rem; 
      }
      
      .contact-item a { 
        color: rgb(107, 114, 128); 
        text-decoration: none; 
      }
      
      .contact-icon { 
        font-size: 16px; 
        width: 16px; 
        height: 16px; 
        flex-shrink: 0; 
      }
      
      .contact-icon svg {
        width: 100% !important;
        height: 100% !important;
        display: block !important;
      }
      
      /* Agency attribution */
      .agency-attribution { 
        margin-top: auto; 
        padding-top: 1.5rem; 
        border-top: 1px solid rgb(229, 231, 235); 
        display: flex; 
        align-items: center; 
        gap: 0.5rem; 
      }
      
      .agency-link { 
        display: flex; 
        align-items: center; 
        gap: 0.5rem; 
        text-decoration: none; 
        font-size: 0.875rem; 
      }
      
      .agency-logo { 
        width: 32px; 
        height: 32px; 
        border-radius: 50%; 
        background-color: rgb(243, 244, 246); 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        overflow: hidden; 
      }
      
      .agency-logo img { 
        width: 100%; 
        height: 100%; 
        object-fit: cover; 
      }
      
      .agency-name { 
        font-family: Inter, sans-serif; 
        font-weight: 500; 
        color: rgb(107, 114, 128); 
      }
      
      .agency-logo-placeholder {
        font-size: 12px; 
        color: rgb(107, 114, 128);
      }
      
      /* Utility classes */
      .hidden { 
        display: none !important; 
      }
      
      .show { 
        display: flex !important; 
      }
      
      /* Icon base styles */
      .n-icon { 
        display: inline-flex !important; 
        align-items: center; 
        justify-content: center; 
        vertical-align: middle;
      }
      
      /* Responsive design */
      @media (max-width: 768px) { 
        .business-grid { 
          grid-template-columns: 1fr !important; 
        } 
        .business-directory { 
          padding: 1rem; 
        } 
      }
      
      @media (min-width: 769px) { 
        .business-grid[data-grid-columns="1"] { grid-template-columns: 1fr !important; }
        .business-grid[data-grid-columns="2"] { grid-template-columns: repeat(2, 1fr) !important; }
        .business-grid[data-grid-columns="3"] { grid-template-columns: repeat(3, 1fr) !important; }
        .business-grid[data-grid-columns="4"] { grid-template-columns: repeat(4, 1fr) !important; }
        .business-grid[data-grid-columns="5"] { grid-template-columns: repeat(5, 1fr) !important; }
      }
      
      /* Force layout for GHL canvas */
      @media (min-width: 1024px) {
        .business-directory {
          max-width: none;
        }
        .business-grid {
          max-width: none;
        }
      }
    `;
    
    return `<style>${baseCSS}</style>`;
  });

  const htmlPreview = computed(() => {
    return `
      ${css.value}
      ${html.value}
    `;
  });

  const js = computed(() => {
    const baseJS = generateNormalizedJS(environment);
    return baseJS;
  });

  // Optimized output for different environments
  const optimizedOutput = computed(() => {
    const optimized = optimizeForEnvironment(
      html.value,
      css.value,
      js.value,
      environment
    );
    
    // Validate consistency in development
    if (import.meta.env.DEV) {
      const issues = validateConsistency(optimized.html, optimized.js);
      if (issues.length > 0) {
        console.warn('🔄 Environment Sync Issues:', issues);
      }
    }
    
    return optimized;
  });

  return { 
    htmlPreview, 
    js,
    // New exports for enhanced consistency
    optimizedHTML: computed(() => optimizedOutput.value.html),
    optimizedCSS: computed(() => optimizedOutput.value.css),
    optimizedJS: computed(() => optimizedOutput.value.js),
    environment,
    validationIssues: computed(() => validateConsistency(html.value, js.value))
  };
};