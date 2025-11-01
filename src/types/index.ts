// Business Directory Interfaces
export interface BusinessContactInterface {
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface BusinessInterface {
  id: string;
  name: string;
  tagline?: string;
  image?: string;
  description?: string;
  contact?: BusinessContactInterface;
  categoryIds: string[];
  locationIds: string[];
  buttonAction?: string;
  featured?: boolean;
  popular?: boolean;
  rating?: number;
  priceRange?: string;
  price?: number;
  createdAt?: string;
}

// Legacy Pricing Plan Interfaces (for backward compatibility)
export interface FeatureInterface {
  text: string;
  available: boolean;
}

export interface PlanInterface {
  name: string;
  price: string;
  annualPrice: string;
  buttonText: string;
  buttonAction: string;
  mostPopular?: boolean;
  features: FeatureInterface[];
}

// Category Interface
export interface CategoryInterface {
  id: string;
  name: string;
  color?: string; // Default: #10b981
  textColor?: string; // Default: #ffffff
  tags?: string[]; // Optional array of tag strings
}

// Location Interface
export interface LocationInterface {
  id: string;
  name: string;
  address?: string;
  color?: string; // Default: #3b82f6
  textColor?: string; // Default: #ffffff
}

// Display Options Interface
export interface DisplayOptionsInterface {
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

// Layout Settings Interface
export interface LayoutSettingsInterface {
  layoutType: 'grid' | 'list';
  gridColumns: number; // 2, 3, or 4
  maxBusinessesDisplay: number; // Minimum 1, no max
  listImageWidth?: string; // e.g., '40%', '250px', '15rem'
  listItemSpacing?: string; // e.g., '1.5rem', '20px'
  listContentGap?: string; // e.g., '1.5rem', '20px'
}
