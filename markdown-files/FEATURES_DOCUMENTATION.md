# Business Directory Widget - Features Documentation

This document provides a comprehensive overview of all features organized by tabs, with detailed implementation notes for recreating this project from scratch.

## Table of Contents
1. [Businesses Tab](#businesses-tab)
2. [Layout Tab](#layout-tab)
3. [Display Options Tab](#display-options-tab)
4. [Categories Tab](#categories-tab)
5. [Locations Tab](#locations-tab)
6. [Agency Settings Tab](#agency-settings-tab)
7. [Phased Implementation Plan](#phased-implementation-plan)

---

## Businesses Tab

### Overview
The Businesses tab manages all business entries in the directory. It provides a table view of all businesses with the ability to add, edit, and delete businesses.

### Features

#### 1. Business List View
- **Table Display**
  - Shows all businesses in a sortable table
  - Columns: Business Name, Status (Featured/Popular badges)
  - Sorted by: Featured → Popular → Rating (desc) → Name (asc)
  - Empty state message when no businesses exist
  - Click on any row to edit

#### 2. Add/Edit Business Form

**Basic Information:**
- Business Name (required)
- Tagline (optional)
- Business Image URL (optional)
- Description (optional, textarea)

**Contact Information:**
- Phone
- Email (validated as email format)
- Website
- Address
- City
- State
- Zip Code
- Country

**Categorization:**
- Categories (multi-select, required) - Note: Based on refactoring, this should be single-select but current code shows multi-select
- Locations (multi-select, optional)

**Business Details:**
- Price Range (dropdown: Budget ($), Moderate ($$), Premium ($$$), Luxury ($$$$))
- Rating (0-5 stars, using rate component)

**Directory URL Configuration:**
- Root Domain (from Agency Settings, read-only display)
- Business Slug (auto-generated from name, editable)
  - Auto-generates URL-friendly slug from business name
  - Slug pattern: lowercase, spaces to hyphens, remove special chars
  - Full URL preview shown: `{agencyRootDomain}/{business-slug}`
  - Updates `buttonAction` field with full URL
- Warning displayed if agency root domain not set

**Badges:**
- Featured Business (checkbox)
- Popular Business (checkbox)

**Form Actions:**
- Save/Update button (with loading state)
- Cancel button (resets form)
- Delete button (only shown when editing, with confirmation popup)

**Validation:**
- Business name required
- At least one category required
- Email validation if provided
- Prevents double submission

### Data Model
```typescript
interface BusinessInterface {
  id: string;
  name: string;
  tagline?: string;
  image?: string;
  description?: string;
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  categoryIds: string[]; // Multiple categories
  locationIds: string[];
  buttonAction?: string; // Full directory URL
  featured?: boolean;
  popular?: boolean;
  rating?: number; // 0-5
  priceRange?: string; // '$', '$$', '$$$', '$$$$'
  price?: number; // Numeric for filtering
  createdAt?: string; // ISO date string
}
```

### Implementation Notes
- Uses auto-save on field changes (watchers)
- Slug auto-generation watches business name
- URL construction watches both slug and agency root domain
- Form validation before submission
- Error handling with user-friendly messages

---

## Layout Tab

### Overview
Controls the overall layout structure and display settings for the business directory grid/list view.

### Features

#### 1. Layout Type Selection
- **Grid View** (Image on top)
  - Cards arranged in columns
  - Image displayed above content
- **List View** (Image on left)
  - 2 cards per row
  - Image displayed on left side of card
  - Content on right

#### 2. Grid Layout Settings
- **Grid Columns** (dropdown)
  - Options: 2, 3, or 4 columns
  - Validates selection

#### 3. List Layout Settings
- **Image Width** (text input)
  - Accepts CSS values: percentages (e.g., 40%), pixels (250px), rems (15rem)
- **Item Spacing** (text input)
  - Spacing between list items (e.g., 1.5rem, 20px)
- **Content Gap** (text input)
  - Gap between image and content in list view (e.g., 1.5rem, 20px)

#### 4. Business Display Settings
- **Maximum Businesses to Display** (number input)
  - Minimum: 1
  - No maximum limit
  - Step: 1
  - Controls how many businesses appear on initial load

### Data Model
```typescript
interface LayoutSettings {
  layoutType: 'grid' | 'list';
  gridColumns: number; // 2, 3, or 4
  maxBusinessesDisplay: number; // Minimum 1, no max
  listImageWidth?: string; // e.g., '40%', '250px', '15rem'
  listItemSpacing?: string; // e.g., '1.5rem', '20px'
  listContentGap?: string; // e.g., '1.5rem', '20px'
}
```

### Implementation Notes
- Layout changes apply immediately via watchers
- Grid columns validated to be 2, 3, or 4
- Default values set if invalid
- Auto-saves on change

---

## Display Options Tab

### Overview
Controls visibility of various content elements on business cards.

### Features

#### Content Visibility Settings
All checkboxes with immediate save on change:

**Primary Content:**
- ✅ Display business images on cards
- ✅ Display business taglines
- ✅ Display business descriptions
- ✅ Display business categories
- ✅ Display location tags
- ✅ Display business ratings
- ✅ Display price ranges
- ✅ Display badges (Featured/Popular)

**Contact Information:**
- ✅ Display phone numbers
- ✅ Display email addresses
- ✅ Display website links
- ✅ Display physical addresses

**Agency Information:**
- ✅ Display agency attribution
  - Shows agency name and link at bottom of cards
  - Configured in Agency Settings tab

### Data Model
```typescript
interface DisplayOptions {
  showImage: boolean;
  showTagline: boolean;
  showDescription: boolean;
  showCategories: boolean;
  showLocation: boolean;
  showAddress: boolean;
  showPhone: boolean;
  showEmail: boolean;
  showWebsite: boolean;
  showRating: boolean;
  showPriceRange: boolean;
  showBadges: boolean;
  showAgencyAttribution: boolean;
}
```

### Implementation Notes
- All settings are boolean flags
- Auto-save on checkbox change via watchers
- Default values: most are `true`, `showEmail` and `showDescription` are `false`
- Changes reflect immediately in preview

---

## Categories Tab

### Overview
Manages business categories with color customization and tag system.

### Features

#### 1. Category Management
- **Add Category** button
- **Edit Category** (click edit icon on category card)
- **Delete Category** (click delete icon on category card)
- Grid display of all categories

#### 2. Category Form Fields

**Basic Information:**
- Category Name (required)
  - Unique name identifier
  - Validated: non-empty, trimmed

**Color Options:**
- Background Color (color picker)
  - Default: #10b981 (green)
  - Predefined swatches available
  - No alpha channel
- Text Color (color picker)
  - Default: #ffffff (white)
  - Predefined swatches available
  - No alpha channel

**Tags System:**
- Tags input field (optional)
- Add tags by:
  - Typing and pressing Enter
  - Typing and clicking "Add Tag" button
- Display existing tags as removable chips
- Tags are unique per category
- Empty state message when no tags
- Purpose: Filter businesses within category

#### 3. Category Display
- Card-based grid layout (1-3 columns responsive)
- Shows category name with color styling
- Edit and Delete buttons on hover
- Empty state when no categories exist

### Data Model
```typescript
interface CategoryInterface {
  id: string;
  name: string;
  color?: string; // Default: #10b981
  textColor?: string; // Default: #ffffff
  tags?: string[]; // Optional array of tag strings
}
```

### Implementation Notes
- Auto-generated IDs using utility function
- Validation before save
- Tags trimmed and filtered (removes empty strings)
- When category deleted, businesses referencing it have category cleared
- Tags used for filtering in search

---

## Locations Tab

### Overview
Manages physical locations that businesses can be associated with.

### Features

#### 1. Location Management
- **Add Location** button
- **Edit Location** (click edit icon on location card)
- **Delete Location** (click delete icon on location card)
- Grid display of all locations

#### 2. Location Form Fields

**Basic Information:**
- Location Name (required)
  - Unique name identifier
  - Validated: non-empty, trimmed
- Address (optional)
  - Full address text

**Color Options:**
- Background Color (color picker)
  - Default: #3b82f6 (blue)
  - Predefined swatches available
  - No alpha channel
- Text Color (color picker)
  - Default: #ffffff (white)
  - Predefined swatches available
  - No alpha channel

#### 3. Location Display
- Card-based grid layout (1-3 columns responsive)
- Shows location name with:
  - Location icon
  - Color-coded badge styling
  - Name text
- Edit and Delete buttons on hover
- Empty state when no locations exist

### Data Model
```typescript
interface LocationInterface {
  id: string;
  name: string;
  address?: string; // Optional
  color?: string; // Default: #3b82f6
  textColor?: string; // Default: #ffffff
}
```

### Implementation Notes
- Auto-generated IDs using utility function
- Validation before save
- Location icon displayed in badge
- Businesses can have multiple locations
- When location deleted, businesses still retain location reference (no cascade)

---

## Agency Settings Tab

### Overview
Configuration for agency branding, directory URLs, and navigation settings.

### Features

#### 1. Agency Information Section

**Agency Name:**
- Text input (optional)
- Used for attribution display
- Placeholder: "e.g., Mira Marketing"

**Agency Website:**
- URL input (optional)
- Validated as URL format (http:// or https://)
- Placeholder: "e.g., https://miramarketing.com"
- Used as link target for agency attribution

**Agency Logo URL:**
- URL input (optional)
- Validated as image URL (PNG, JPG, JPEG, GIF, SVG, or WebP)
- Placeholder: "e.g., https://miramarketing.com/logo.png"
- Logo Preview shown when URL provided
- Preview displays 80x80px, with error handling

#### 2. Directory Settings Section

**Directory Root Domain:**
- URL input (optional)
- Validated as URL format
- Placeholder: "e.g., https://directory.miramarketing.com"
- Used to generate business directory page URLs

**Example Generated URL Preview:**
- Shows live preview: `{agencyRootDomain}/elite-fitness-center`
- Updates as root domain changes
- Explains slug generation from business names

#### 3. Navigation Settings Section

**Business Title Link Destination:**
- Radio button group
- Options:
  - **Link to directory listing page** (default)
    - Uses `buttonAction` field (agencyRootDomain + business slug)
    - Opens in same tab
  - **Link to business website**
    - Uses `business.contact.website`
    - Opens in new tab (`_blank` with `noopener noreferrer`)

#### 4. Helper Information
- Info box explaining how directory URLs work
- Numbered list of URL generation steps

### Data Model
```typescript
interface AgencySettings {
  agencyName?: string;
  agencyWebsite?: string;
  agencyRootDomain?: string;
  agencyLogo?: string;
  titleLinkDestination?: 'directory' | 'website'; // Default: 'directory'
}
```

### Implementation Notes
- All fields optional but validated when provided
- Logo preview with error handling (hides on load error)
- Auto-save on field changes via watchers
- URL validation for website and root domain fields
- Image URL validation for logo
- Changes apply immediately to preview

---

## Additional Features (Not in Requested Tabs)

### Advanced Filters (in Preview)
- Keyword search
- Category multi-select filter
- Location multi-select filter
- Tags filter (dynamically filtered by selected categories)
- Price range filter (multi-select checkboxes)
- Rating filter (radio buttons, 5-1 stars + N/A)
- Featured toggle switch
- Sort options (Featured, Latest, Oldest, Popular, Rating, Name A-Z/Z-A, Price, Random)
- View switcher (Grid/List/Reset)
- Mobile-optimized layout

### Card Styling Tab
- Card padding, border radius, colors, shadows
- Image styling options
- Content spacing

### Typography Tab
- Font, weight, size, color for:
  - Business Name (Title)
  - Tagline
  - Description
  - Contact Info
  - Price Range
  - Agency Attribution

### Tags & Indicators Tab
- Badge styling (Featured/Popular)
- Rating star styling
- Category tag styling

### Filters Styling Tab
- Filter button styling
- Dropdown styling

### Responsive Settings Tab
- Mobile-specific styling options

---

## Phased Implementation Plan

### Phase 1: Foundation & Core Data Models
**Goal:** Set up basic structure and data models

**Tasks:**
1. Set up project structure (Vue 3 + TypeScript + Vite)
2. Install dependencies (Naive UI, Vue Icons, etc.)
3. Create TypeScript interfaces:
   - `BusinessInterface`
   - `CategoryInterface`
   - `LocationInterface`
   - `BusinessStylesInterface`
   - `BusinessContactInterface`
4. Set up basic store/reactive state management
5. Create mock data fixtures
6. Set up routing/navigation structure

**Deliverables:**
- Project scaffold
- Type definitions
- Basic store with mock data
- Tab navigation structure

**Estimated Time:** 1-2 days

---

### Phase 2: Businesses Tab - Core Functionality
**Goal:** Implement business CRUD operations

**Tasks:**
1. Create BusinessListingView component
   - Table/list display
   - Sort functionality (Featured → Popular → Rating → Name)
   - Empty state
2. Create AddEditBusiness form component
   - Basic information fields
   - Contact information fields
   - Form validation
   - Save functionality
3. Implement business store actions:
   - `createBusiness`
   - `updateBusinessById`
   - `deleteBusiness`
4. Add form state management
5. Error handling

**Deliverables:**
- Working Businesses tab
- Can add, edit, delete businesses
- Form validation

**Estimated Time:** 2-3 days

---

### Phase 3: Categories Tab
**Goal:** Category management with tags

**Tasks:**
1. Create CategoryManager component
   - Grid display of categories
   - Add/Edit form
   - Delete functionality
2. Implement category store actions
3. Add tag management:
   - Tag input field
   - Add/remove tags
   - Tag display as chips
4. Color picker integration
5. Validation

**Deliverables:**
- Working Categories tab
- Can add categories with tags
- Color customization

**Estimated Time:** 1-2 days

---

### Phase 4: Locations Tab
**Goal:** Location management

**Tasks:**
1. Create LocationManager component
   - Grid display of locations
   - Add/Edit form
   - Delete functionality
2. Implement location store actions
3. Color picker integration
4. Validation

**Deliverables:**
- Working Locations tab
- Can add locations with colors

**Estimated Time:** 1 day

---

### Phase 5: Business Form - Categories & Locations Integration
**Goal:** Connect businesses to categories and locations

**Tasks:**
1. Add category selection to AddEditBusiness
   - Multi-select dropdown
   - Category options from store
   - Validation (at least one required)
2. Add location selection to AddEditBusiness
   - Multi-select dropdown
   - Location options from store
3. Update business data model to include:
   - `categoryIds: string[]`
   - `locationIds: string[]`
4. Save/load category and location associations

**Deliverables:**
- Businesses can be assigned categories and locations
- Form validation

**Estimated Time:** 1 day

---

### Phase 6: Layout Tab
**Goal:** Layout configuration

**Tasks:**
1. Create LayoutView component
2. Layout type selection (Grid/List)
3. Grid settings:
   - Column count selector (2/3/4)
4. List settings:
   - Image width input
   - Item spacing input
   - Content gap input
5. Business display limit:
   - Number input (min 1, no max)
6. Store integration
7. Auto-save on change

**Deliverables:**
- Working Layout tab
- Layout changes save to store

**Estimated Time:** 1-2 days

---

### Phase 7: Display Options Tab
**Goal:** Visibility toggles

**Tasks:**
1. Create DisplayOptionsView component
2. Add all checkbox toggles:
   - Primary content visibility
   - Contact information visibility
   - Agency attribution toggle
3. Store integration
4. Auto-save on checkbox change
5. Default values

**Deliverables:**
- Working Display Options tab
- All visibility toggles functional

**Estimated Time:** 1 day

---

### Phase 8: Agency Settings Tab - Basic
**Goal:** Agency information and directory URLs

**Tasks:**
1. Create AgencySettings component
2. Agency Information section:
   - Name input
   - Website URL input (with validation)
   - Logo URL input (with validation)
   - Logo preview
3. Directory Settings section:
   - Root domain input (with validation)
   - URL preview
4. Store integration
5. Auto-save on change

**Deliverables:**
- Working Agency Settings tab (basic)
- URL validation working

**Estimated Time:** 1-2 days

---

### Phase 9: Business Form - Directory URL Integration
**Goal:** Auto-generate business directory URLs

**Tasks:**
1. Add slug generation function:
   - Convert name to URL-friendly slug
   - Handle special characters
2. Add slug field to business form:
   - Auto-generated from name
   - Editable
   - Preview full URL
3. Watch name changes → update slug
4. Watch slug/root domain → update buttonAction
5. Extract slug from existing buttonAction when editing
6. Display warning if root domain not set

**Deliverables:**
- Auto-generated business URLs
- Editable slugs
- URL preview

**Estimated Time:** 1-2 days

---

### Phase 10: Agency Settings - Navigation Options
**Goal:** Title link destination setting

**Tasks:**
1. Add Navigation Settings section to AgencySettings
2. Add radio button group for title link destination
3. Update store with `titleLinkDestination` field
4. Update business card preview to use setting
5. Implement `getTitleLinkUrl` helper function

**Deliverables:**
- Title link destination option working
- Links redirect correctly based on setting

**Estimated Time:** 0.5 days

---

### Phase 11: Preview & Testing
**Goal:** Verify all features work together

**Tasks:**
1. Create Preview tab component
2. Display businesses using current settings
3. Test all combinations:
   - Layout types
   - Display options
   - Categories and locations
   - Agency settings
4. Fix any bugs
5. Test edge cases

**Deliverables:**
- Working preview
- All features tested

**Estimated Time:** 2-3 days

---

### Phase 12: Additional Features (Optional)
**Goal:** Enhanced functionality

**Tasks:**
1. Advanced Filters
2. Card Styling options
3. Typography settings
4. Responsive settings
5. Export/Import functionality
6. Widget code generation

**Estimated Time:** 5-7 days

---

## Total Estimated Timeline

**Core Features (Phases 1-11):** 12-17 days
**Full Features (All Phases):** 17-24 days

---

## Key Technical Decisions

### State Management
- Use Vue 3 Composition API with reactive refs
- Central store pattern with composables
- Separate composables for business, category, location operations

### Form Validation
- Use Naive UI form validation
- Custom validators for URLs, emails
- Client-side validation before API calls

### Auto-Save Pattern
- Use Vue watchers to auto-save on field changes
- Prevent saving during initialization
- Debounce if needed for performance

### URL Generation
- Auto-generate slugs from business names
- Allow manual override
- Validate slug format
- Construct full URLs from agency root domain

### Color System
- Use hex color codes
- Provide predefined swatches
- No alpha channel for simplicity
- Separate background and text colors

### Data Persistence
- Consider localStorage or backend API
- Handle migration for schema changes
- Backward compatibility for existing data

---

## Notes for Implementation

1. **Category System:** The system supports tags on categories for filtering. When implementing, ensure tags are properly associated with categories and filter logic uses category tags.

2. **Single vs Multiple Categories:** Review the actual implementation - some code shows multiple categories (`categoryIds`), others show single (`categoryId`). Document the intended behavior and implement consistently.

3. **Mobile Responsiveness:** Consider mobile optimization from the start, especially for forms and card displays.

4. **Error Handling:** Implement comprehensive error handling for all user actions, especially API calls and validation.

5. **Performance:** Consider lazy loading, virtualization for large lists, and debouncing for auto-save operations.

6. **Accessibility:** Ensure all form inputs have proper labels, ARIA attributes, and keyboard navigation.

