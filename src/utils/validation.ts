// Form validation utilities

export interface ValidationRule {
  required?: boolean;
  message: string;
  trigger?: string;
  type?: 'string' | 'number' | 'boolean' | 'array';
  min?: number;
  max?: number;
}

// Factory function for creating required field rules
export const createRequiredRule = (fieldName: string, trigger: string = 'blur'): ValidationRule => ({
  required: true,
  message: `Please select a ${fieldName}`,
  trigger,
});

// Factory function for creating array validation rules
export const createArrayRequiredRule = (fieldName: string, minItems: number = 1): ValidationRule => ({
  required: true,
  type: 'array',
  min: minItems,
  message: `At least ${minItems} ${fieldName} ${minItems === 1 ? 'is' : 'are'} required`,
  trigger: 'change',
});

// Common validation rules
export const commonRules = {
  // Typography rules
  headlineFont: [createRequiredRule('headline font')],
  headlineWeight: [createRequiredRule('headline font weight')],
  contentFont: [createRequiredRule('content font')],
  contentWeight: [createRequiredRule('content font weight')],
  headlineFontSize: [createRequiredRule('headline font size')],
  contentFontSize: [createRequiredRule('content font size')],
  
  // Color rules
  textColor: [createRequiredRule('text color')],
  borderColor: [createRequiredRule('border color')],
  backgroundColor: [createRequiredRule('background color')],
  buttonBgColor: [createRequiredRule('button background color')],
  buttonTextColor: [createRequiredRule('button text color')],
  
  // Feature-specific rules
  mostPopularBorderColor: [createRequiredRule('most popular border color')],
  mostPopularBgColor: [createRequiredRule('most popular background color')],
  mostPopularLabelColor: [createRequiredRule('most popular label color')],
  featuredBorderColor: [createRequiredRule('featured border color')],
  featuredBgColor: [createRequiredRule('featured background color')],
  featuredLabelColor: [createRequiredRule('featured label color')],
  
  // Business rules
  businessName: [{ required: true, message: 'Business name is required', trigger: 'blur' }],
  categoryIds: [createArrayRequiredRule('category', 1)],
  locationIds: [createArrayRequiredRule('location', 1)],
  
  // Contact rules
  email: [
    { required: false, trigger: 'blur' },
    { 
      type: 'string' as const, 
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
      message: 'Please enter a valid email address',
      trigger: 'blur' 
    }
  ],
  phone: [
    { required: false, trigger: 'blur' },
    { 
      type: 'string' as const,
      pattern: /^[\+]?[1-9][\d]{0,15}$/,
      message: 'Please enter a valid phone number',
      trigger: 'blur'
    }
  ],
  website: [
    { required: false, trigger: 'blur' },
    {
      type: 'string' as const,
      pattern: /^https?:\/\/.+/,
      message: 'Please enter a valid URL starting with http:// or https://',
      trigger: 'blur'
    }
  ],
  agencyWebsite: [
    { required: false, trigger: 'blur' },
    {
      type: 'string' as const,
      pattern: /^https?:\/\/.+/,
      message: 'Please enter a valid URL starting with http:// or https://',
      trigger: 'blur'
    }
  ],
  agencyRootDomain: [
    { required: false, trigger: 'blur' },
    {
      type: 'string' as const,
      pattern: /^https?:\/\/.+/,
      message: 'Please enter a valid URL starting with http:// or https://',
      trigger: 'blur'
    }
  ],
  agencyLogo: [
    { required: false, trigger: 'blur' },
    {
      type: 'string' as const,
      pattern: /^https?:\/\/.+\.(png|jpg|jpeg|gif|svg|webp)(\?.*)?$/i,
      message: 'Please enter a valid image URL (PNG, JPG, JPEG, GIF, SVG, or WebP)',
      trigger: 'blur'
    }
  ]
};

// Helper function to merge custom rules with common rules
export const createValidationRules = (customRules: Record<string, ValidationRule[]> = {}) => {
  return { ...commonRules, ...customRules };
};

// Validation helpers for specific field types
export const validateRequired = (value: any): boolean => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return value !== null && value !== undefined && value !== '';
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const validateImageUrl = (url: string): boolean => {
  if (!url) return true; // Allow empty URLs
  const imageUrlRegex = /^https?:\/\/.+\.(png|jpg|jpeg|gif|svg|webp)(\?.*)?$/i;
  return imageUrlRegex.test(url);
};