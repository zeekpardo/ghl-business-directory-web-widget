// Re-export from domain-specific stores
import { businesses } from './businesses';
import { categories } from './categories';
import { locations } from './locations';
import { 
  displayOptions, 
  layoutSettings, 
  cardStyles, 
  agencySettings 
} from './settings';

// Re-export store functions for use in other parts of the app
export { useBusinessStore } from './businesses';
export { useCategoryStore } from './categories';
export { useLocationStore } from './locations';
export { useSettingsStore } from './settings';

export const useStore = () => {
  return {
    businesses,
    categories,
    locations,
    displayOptions,
    layoutSettings,
    cardStyles,
    agencySettings,
  };
};

export default useStore;
