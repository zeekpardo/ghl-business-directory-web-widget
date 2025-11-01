import { ref } from "vue";
import { LocationInterface } from "../types";

export const locations = ref<LocationInterface[]>([
  {
    id: "manhattan",
    name: "Manhattan",
    address: "New York, NY",
    color: "#8b5cf6",
    textColor: "#ffffff"
  },
  {
    id: "brooklyn",
    name: "Brooklyn",
    address: "Brooklyn, NY",
    color: "#ec4899",
    textColor: "#ffffff"
  },
  {
    id: "sf-downtown",
    name: "San Francisco Downtown",
    address: "San Francisco, CA",
    color: "#14b8a6",
    textColor: "#ffffff"
  },
  {
    id: "portland",
    name: "Portland",
    address: "Portland, OR",
    color: "#10b981",
    textColor: "#ffffff"
  },
  {
    id: "austin",
    name: "Austin",
    address: "Austin, TX",
    color: "#f59e0b",
    textColor: "#ffffff"
  },
  {
    id: "chicago",
    name: "Chicago",
    address: "Chicago, IL",
    color: "#3b82f6",
    textColor: "#ffffff"
  },
  {
    id: "miami",
    name: "Miami",
    address: "Miami, FL",
    color: "#ef4444",
    textColor: "#ffffff"
  },
  {
    id: "seattle",
    name: "Seattle",
    address: "Seattle, WA",
    color: "#06b6d4",
    textColor: "#ffffff"
  },
  {
    id: "phoenix",
    name: "Phoenix",
    address: "Phoenix, AZ",
    color: "#dc2626",
    textColor: "#ffffff"
  },
  {
    id: "denver",
    name: "Denver",
    address: "Denver, CO",
    color: "#7c3aed",
    textColor: "#ffffff"
  },
  {
    id: "boulder",
    name: "Boulder",
    address: "Boulder, CO",
    color: "#059669",
    textColor: "#ffffff"
  }
]);

// Location-specific operations
export const useLocationStore = () => {
  const addLocation = (location: LocationInterface) => {
    locations.value.push(location);
  };

  const updateLocation = (updatedLocation: LocationInterface) => {
    const index = locations.value.findIndex(l => l.id === updatedLocation.id);
    if (index !== -1) {
      locations.value[index] = updatedLocation;
    }
  };

  const deleteLocation = (locationId: string) => {
    const index = locations.value.findIndex(l => l.id === locationId);
    if (index !== -1) {
      locations.value.splice(index, 1);
    }
  };

  const getLocationById = (id: string) => {
    return locations.value.find(l => l.id === id);
  };

  const getLocationNames = (locationIds: string[]) => {
    return locationIds.map(id => {
      const location = locations.value.find(loc => loc.id === id);
      return location ? location.name : '';
    }).filter(Boolean);
  };

  const getLocationsWithBusinessCount = (businesses: any[]) => {
    return locations.value.map(location => ({
      ...location,
      businessCount: businesses.filter(b => b.locationIds.includes(location.id)).length
    }));
  };

  return {
    locations,
    addLocation,
    updateLocation,
    deleteLocation,
    getLocationById,
    getLocationNames,
    getLocationsWithBusinessCount,
  };
};