export const googleFonts = [
  { label: "Roboto", value: "Roboto" },
  { label: "Open Sans", value: "Open Sans" },
  { label: "Noto Sans JP", value: "Noto Sans JP" },
  { label: "Montserrat", value: "Montserrat" },
  { label: "Lato", value: "Lato" },
  { label: "Poppins", value: "Poppins" },
  { label: "Roboto Condensed", value: "Roboto Condensed" },
  { label: "Inter", value: "Inter" },
  { label: "Roboto Mono", value: "Roboto Mono" },
  { label: "Oswald", value: "Oswald" },
  { label: "Raleway", value: "Raleway" },
  { label: "Noto Sans", value: "Noto Sans" },
  { label: "Nunito Sans", value: "Nunito Sans" },
  { label: "Roboto Slab", value: "Roboto Slab" },
  { label: "Ubuntu", value: "Ubuntu" },
  { label: "Nunito", value: "Nunito" },
  { label: "Playfair Display", value: "Playfair Display" },
  { label: "Merriweather", value: "Merriweather" },
  { label: "Rubik", value: "Rubik" },
  { label: "PT Sans", value: "PT Sans" },
  { label: "Kanit", value: "Kanit" },
  { label: "Arial", value: "Arial" },
  { label: "Times", value: "Times" },
  { label: "Palatino", value: "Palatino" },
  { label: "Garamond", value: "Garamond" },
];

export const fontWeights = [
  { label: "100", value: "100" },
  { label: "200", value: "200" },
  { label: "300", value: "300" },
  { label: "400", value: "400" },
  { label: "500", value: "500" },
  { label: "600", value: "600" },
  { label: "700", value: "700" },
  { label: "800", value: "800" },
  { label: "900", value: "900" },
];

export const fontSizes = [
  { label: "Extra Small", value: "12px" },
  { label: "Small", value: "16px" },
  { label: "Medium", value: "24px" },
  { label: "Large", value: "32px" },
  { label: "Extra Large", value: "48px" },
];

// UI Constants
export const LAYOUT_TYPES = {
  GRID: 'grid',
  LIST: 'list'
} as const;

export const DEFAULT_GRID_COLUMNS = 3;
export const MIN_GRID_COLUMNS = 1;
export const MAX_GRID_COLUMNS = 6;

// CSS Class Names (to reduce hardcoded strings)
export const CSS_CLASSES = {
  // Layout
  LAYOUT_CONTAINER: 'h-full',
  LAYOUT_SIDER: 'mt-1',
  LAYOUT_CONTENT: 'overflow-hidden bg-gray-100',
  
  // Grid
  GRID_RESPONSIVE: 'grid grid-cols-1 gap-2 md:grid-cols-2',
  GRID_FORM: 'grid grid-cols-1 gap-4 lg:grid-cols-2',
  
  // Typography
  TITLE_LARGE: 'text-2xl font-bold',
  TITLE_MEDIUM: 'text-lg font-semibold',
  TEXT_MUTED: 'text-gray-500',
  TEXT_SECONDARY: 'text-gray-600',
  
  // Spacing
  PADDING_SECTION: 'p-8',
  MARGIN_SECTION: 'my-5',
  
  // Buttons
  BUTTON_PRIMARY: 'type-info',
  
  // Forms
  FORM_CONTAINER: 'w-full',
  
  // Business Card
  BUSINESS_CARD: 'business-card-preview bg-white border border-gray-200 rounded-lg p-4 shadow-sm',
  
  // Badges
  BADGE_FEATURED: 'px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-800 rounded',
  BADGE_POPULAR: 'px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded',
  
  // Flex utilities
  FLEX_BETWEEN: 'flex justify-between items-center',
  FLEX_END: 'flex justify-end',
  FLEX_CENTER: 'flex items-center justify-center',
  FLEX_GAP_2: 'flex gap-2',
} as const;

// Price Range Options
export const priceRangeOptions = [
  { label: "Budget ($)", value: "$" },
  { label: "Moderate ($$)", value: "$$" },
  { label: "Premium ($$$)", value: "$$$" },
  { label: "Luxury ($$$$)", value: "$$$$" },
];

// Grid Column Options
export const gridColumnOptions = [
  { label: "2 Columns", value: 2 },
  { label: "3 Columns", value: 3 },
  { label: "4 Columns", value: 4 },
];

// Display option defaults
export const DEFAULT_DISPLAY_OPTIONS = {
  showImage: true,
  showTagline: true,
  showDescription: false,
  showCategories: true,
  showLocation: true,
  showAddress: true,
  showPhone: true,
  showEmail: false,
  showWebsite: true,
  showRating: true,
  showPriceRange: true,
  showBadges: true,
  showAgencyAttribution: true
} as const;

// Layout defaults
export const DEFAULT_LAYOUT_SETTINGS = {
  layoutType: LAYOUT_TYPES.GRID,
  gridColumns: DEFAULT_GRID_COLUMNS,
  maxBusinessesDisplay: 9,
  listImageWidth: '40%',
  listItemSpacing: '1.5rem',
  listContentGap: '1.5rem'
} as const;

// Menu configuration
export const MENU_ITEMS = [
  { label: "Businesses", key: "businesses" },
  { label: "Categories", key: "categories" },
  { label: "Locations", key: "locations" },
  { label: "Layout", key: "layout" },
  { label: "Display Options", key: "display-options" },
  { label: "Card Styling", key: "card-styling" },
  { label: "Agency Settings", key: "agency-settings" },
  { label: "Preview", key: "preview" },
] as const;

// Validation constants
export const VALIDATION_TRIGGERS = {
  BLUR: 'blur',
  CHANGE: 'change',
} as const;

// API/External service constants
export const EXTERNAL_SERVICES = {
  GOOGLE_MAPS_SEARCH: 'https://www.google.com/maps/search/?api=1&query=',
  GOOGLE_FONTS_API: 'https://fonts.googleapis.com/css2',
} as const;

// Utility function to generate unique IDs
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Utility function to create URL-friendly slug
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Utility function to format address for maps
export const formatAddressForMaps = (contact: any): string => {
  const parts = [
    contact.address,
    contact.city,
    contact.state,
    contact.zipCode,
    contact.country
  ].filter(Boolean);
  
  return parts.join(', ');
};
