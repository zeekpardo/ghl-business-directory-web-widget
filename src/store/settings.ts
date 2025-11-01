import { ref } from "vue";
import { DisplayOptionsInterface, LayoutSettingsInterface } from "../types";

// Display Options
export const displayOptions = ref<DisplayOptionsInterface>({
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
});

// Layout Settings
export const layoutSettings = ref<LayoutSettingsInterface>({
  layoutType: 'grid',
  gridColumns: 3,
  maxBusinessesDisplay: 9,
  listImageWidth: '40%',
  listItemSpacing: '1.5rem',
  listContentGap: '1.5rem'
});

// Card Styles (renamed from defaultStyles for clarity)
export const cardStyles = ref({
  // Typography
  titleFont: "Inter",
  contentFont: "Inter",
  titleWeight: "700",
  contentWeight: "400",
  titleFontSize: "24px",
  contentFontSize: "14px",
  
  // Colors
  borderColor: "#e5e7eb",
  backgroundColor: "#ffffff",
  textColor: "#111827",
  secondaryTextColor: "#6b7280",
  
  // Featured Business Styling
  featuredBorderColor: "#fbbf24",
  featuredBgColor: "#fffbeb",
  featuredLabelColor: "#d97706",
  
  // Popular Business Styling
  popularBorderColor: "#2563eb",
  popularBgColor: "#eff6ff",
  popularLabelColor: "#2563eb",
  
  // Button Styling
  buttonBgColor: "#1f2937",
  buttonTextColor: "#ffffff",
  buttonHoverBgColor: "#374151",
  
  // Card Styling
  cardPadding: "1.5rem",
  cardBorderRadius: "0.5rem",
  cardShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
});

// Agency Settings
export const agencySettings = ref({
  agencyName: "",
  agencyWebsite: "",
  agencyRootDomain: "",
  agencyLogo: "",
  titleLinkDestination: 'directory' as 'directory' | 'website'
});

// Settings-specific operations
export const useSettingsStore = () => {
  const updateDisplayOptions = (options: Partial<DisplayOptionsInterface>) => {
    displayOptions.value = { ...displayOptions.value, ...options };
  };

  const updateLayoutSettings = (settings: Partial<LayoutSettingsInterface>) => {
    layoutSettings.value = { ...layoutSettings.value, ...settings };
  };

  const updateCardStyles = (styles: Partial<typeof cardStyles.value>) => {
    cardStyles.value = { ...cardStyles.value, ...styles };
  };

  const updateAgencySettings = (settings: Partial<typeof agencySettings.value>) => {
    agencySettings.value = { ...agencySettings.value, ...settings };
  };

  const resetToDefaults = () => {
    displayOptions.value = {
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
    };

    layoutSettings.value = {
      layoutType: 'grid',
      gridColumns: 3,
      maxBusinessesDisplay: 9,
      listImageWidth: '40%',
      listItemSpacing: '1.5rem',
      listContentGap: '1.5rem'
    };

    cardStyles.value = {
      titleFont: "Inter",
      contentFont: "Inter",
      titleWeight: "700",
      contentWeight: "400",
      titleFontSize: "24px",
      contentFontSize: "14px",
      borderColor: "#e5e7eb",
      backgroundColor: "#ffffff",
      textColor: "#111827",
      secondaryTextColor: "#6b7280",
      featuredBorderColor: "#fbbf24",
      featuredBgColor: "#fffbeb",
      featuredLabelColor: "#d97706",
      popularBorderColor: "#2563eb",
      popularBgColor: "#eff6ff",
      popularLabelColor: "#2563eb",
      buttonBgColor: "#1f2937",
      buttonTextColor: "#ffffff",
      buttonHoverBgColor: "#374151",
      cardPadding: "1.5rem",
      cardBorderRadius: "0.5rem",
      cardShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    };
  };

  return {
    displayOptions,
    layoutSettings,
    cardStyles,
    agencySettings,
    updateDisplayOptions,
    updateLayoutSettings,
    updateCardStyles,
    updateAgencySettings,
    resetToDefaults,
  };
};