# Business Directory Widget - GHL Testing Package

## Overview
This is a Business Directory Widget designed for GoHighLevel funnel builder integration. It generates customizable business directory listings with full responsive design and real-time preview capabilities.

## Key Features
- 🏢 **11 Sample Businesses** across 7 categories
- 🎨 **Visual Style Editor** with real-time preview
- 📱 **Fully Responsive** (mobile-first design)
- 🔧 **Customizable Display Options**
- ⭐ **Rating System** with star displays
- 🎯 **Featured & Popular Business Badges**
- 🌍 **Multi-Location Support**
- 📞 **Contact Information Display**
- 🔗 **Clickable Business Cards**

## Sample Business Categories
1. **Fitness & Wellness** - Gyms, yoga studios, spas
2. **Restaurants & Cafes** - Dining establishments
3. **Technology & Services** - IT support, digital marketing
4. **Retail & Shopping** - Bookstores, specialty shops
5. **Automotive Services** - Auto repair, maintenance
6. **Beauty & Personal Care** - Hair salons, skincare
7. **Healthcare & Medical** - Veterinary, medical clinics

## Technical Specifications
- **Framework**: Vue 3 + TypeScript
- **UI Library**: Naive UI
- **Communication**: Postmate for iframe integration
- **Bundle Size**: 313KB main bundle (optimized with code splitting)
- **Generated Code**: Self-contained HTML/CSS/JS with no external dependencies

## Installation in GoHighLevel

### Step 1: Upload Widget Files
1. Extract the contents of `business-directory-widget-v1.0.zip`
2. Upload the entire `dist/` folder to your web hosting
3. Note the public URL of the `index.html` file

### Step 2: Add to Funnel Builder
1. In GHL Funnel Builder, add a "Custom Code" or "Widget" element
2. Configure as an iframe widget:
   ```html
   <iframe src="YOUR_HOSTED_URL/index.html" 
           width="100%" 
           height="800px" 
           frameborder="0">
   </iframe>
   ```

### Step 3: Configure Postmate Communication
If using GHL's widget system, ensure Postmate is configured to receive:
- `code` events with generated HTML/CSS/JS
- `elementStore` data for state persistence

## Widget Interface

### Main Navigation
- **Businesses Tab**: Manage business listings (currently displays 11 sample businesses)
- **Styles Tab**: Customize fonts, colors, and layout
- **Preview Tab**: Real-time preview of generated output

### Generated Output Features
- **Responsive Grid**: 1 column mobile, 3 columns desktop (configurable)
- **Business Cards**: Image, title, tagline, contact info, ratings
- **Interactive Elements**: Clickable cards, hover effects
- **Badge System**: Featured and Popular business indicators
- **Star Ratings**: Visual 5-star rating system
- **Contact Links**: Phone numbers and Google Maps integration

## Testing Checklist

### Basic Functionality
- [ ] Widget loads without errors
- [ ] All three tabs are accessible
- [ ] Business listings display correctly
- [ ] Preview updates in real-time
- [ ] Style changes apply immediately

### Responsive Design
- [ ] Mobile view (1 column layout)
- [ ] Tablet view (responsive)
- [ ] Desktop view (3 column layout)
- [ ] Hover effects work properly
- [ ] Touch interactions work on mobile

### Generated Code
- [ ] HTML output is clean and semantic
- [ ] CSS is properly embedded
- [ ] JavaScript functions correctly
- [ ] No external dependencies
- [ ] Works standalone when copied

### Sample Data Testing
- [ ] All 11 businesses display
- [ ] Images load (with fallback for broken images)
- [ ] Star ratings display correctly
- [ ] Contact information is clickable
- [ ] Featured/Popular badges show
- [ ] Google Maps links work

## Sample Business Data Included

### Featured Businesses
1. **Elite Fitness Center** (Manhattan) - Fitness & Wellness
2. **Urban Yoga Studio** (Austin) - Fitness & Wellness  
3. **Phoenix Auto Repair** (Phoenix) - Automotive Services

### Popular Businesses
1. **Bella's Italian Restaurant** (Brooklyn) - Restaurants & Cafes
2. **Digital Marketing Pro** (Chicago) - Technology & Services
3. **Creative Hair Studio** (Denver) - Beauty & Personal Care

### Regular Listings
1. **Tech Solutions Inc** (San Francisco) - Technology & Services
2. **Green Leaf Café** (Portland) - Restaurants & Cafes
3. **Sunset Spa & Wellness** (Miami) - Fitness & Wellness
4. **The Book Nook** (Seattle) - Retail & Shopping
5. **Mountain View Veterinary** (Boulder) - Healthcare & Medical

## Customization Options

### Display Settings
- Show/hide business images
- Show/hide taglines and descriptions
- Show/hide contact information
- Show/hide ratings and price ranges
- Show/hide featured/popular badges

### Layout Settings
- Grid vs List view
- Number of columns (2, 3, or 4)
- Maximum businesses to display
- Spacing and gap configuration

### Style Settings
- Font family selection (Google Fonts)
- Font sizes and weights
- Color scheme customization
- Border and background colors
- Button styling
- Featured/Popular business highlighting

## Technical Notes

### Performance
- Code splitting reduces initial bundle size
- Lazy loading for style and business view components
- Optimized CSS with class-based styling
- Minimal JavaScript for generated output

### Browser Support
- Modern browsers (ES2015+)
- Mobile Safari and Chrome
- Desktop Chrome, Firefox, Safari, Edge

### Security
- Input sanitization for generated HTML
- URL validation for business links
- Secure iframe communication via Postmate
- No eval() or dynamic code execution

## Troubleshooting

### Common Issues
1. **Widget doesn't load**: Check iframe src URL and CORS settings
2. **Styles not applying**: Verify CSS is being included in generated output
3. **Images not showing**: Check image URLs and fallback handling
4. **Click handlers not working**: Ensure JavaScript is properly embedded

### Debug Mode
Open browser console to see:
- Postmate communication logs
- Generated HTML/CSS/JS output
- Any JavaScript errors or warnings

## Next Steps for Production Use

1. **Replace Sample Data**: Add your actual business directory data
2. **Customize Styling**: Match your brand colors and fonts
3. **Configure Categories**: Set up relevant business categories
4. **Add Locations**: Define geographic coverage areas
5. **Set Display Options**: Choose what information to show
6. **Test Integration**: Verify proper GHL communication

## Support & Documentation

For detailed development documentation, see:
- `WIDGET_DEVELOPMENT_GUIDE.md` - Comprehensive development guide
- `CLAUDE.md` - Project overview and architecture
- Source code with TypeScript interfaces and comments

## Version Information
- **Version**: 1.0
- **Build Date**: 2024
- **Framework**: Vue 3.4+
- **TypeScript**: 5.0+
- **Bundle Size**: ~314KB (gzipped: ~99KB)