import { ref } from "vue";
import { LocationInterface } from "../types";

export const locations = ref<LocationInterface[]>([
  {
    id: "manhattan",
    name: "Manhattan",
    address: "New York, NY"
  },
  {
    id: "brooklyn",
    name: "Brooklyn",
    address: "Brooklyn, NY"
  },
  {
    id: "sf-downtown",
    name: "San Francisco Downtown",
    address: "San Francisco, CA"
  },
  {
    id: "portland",
    name: "Portland",
    address: "Portland, OR"
  },
  {
    id: "austin",
    name: "Austin",
    address: "Austin, TX"
  },
  {
    id: "chicago",
    name: "Chicago",
    address: "Chicago, IL"
  },
  {
    id: "miami",
    name: "Miami",
    address: "Miami, FL"
  },
  {
    id: "seattle",
    name: "Seattle",
    address: "Seattle, WA"
  },
  {
    id: "phoenix",
    name: "Phoenix",
    address: "Phoenix, AZ"
  },
  {
    id: "denver",
    name: "Denver",
    address: "Denver, CO"
  },
  {
    id: "boulder",
    name: "Boulder",
    address: "Boulder, CO"
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