import { ref } from "vue";
import { BusinessInterface } from "../types";

export const businesses = ref<BusinessInterface[]>([
  {
    id: "1",
    name: "Elite Fitness Center",
    tagline: "Transform Your Body, Transform Your Life",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
    description: "State-of-the-art gym with personal training and group classes",
    contact: {
      phone: "(555) 123-4567",
      email: "info@elitefitness.com",
      website: "https://elitefitness.com",
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    },
    categoryIds: ["fitness"],
    locationIds: ["manhattan"],
    buttonAction: "https://directory.example.com/elite-fitness-center",
    featured: true,
    popular: false,
    rating: 4.5,
    priceRange: "$$",
    price: 2,
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "Bella's Italian Restaurant",
    tagline: "Authentic Italian Cuisine Since 1985",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    description: "Family-owned restaurant serving traditional Italian dishes",
    contact: {
      phone: "(555) 234-5678",
      email: "reservations@bellasitalian.com",
      website: "https://bellasitalian.com",
      address: "456 Oak Avenue",
      city: "Brooklyn",
      state: "NY",
      zipCode: "11201",
      country: "USA"
    },
    categoryIds: ["restaurant"],
    locationIds: ["brooklyn"],
    buttonAction: "https://directory.example.com/bellas-italian-restaurant",
    featured: false,
    popular: true,
    rating: 4.8,
    priceRange: "$$$",
    price: 3,
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    name: "Tech Solutions Inc",
    tagline: "Your Local IT Support Partner",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400",
    description: "Comprehensive IT services for businesses of all sizes",
    contact: {
      phone: "(555) 345-6789",
      email: "support@techsolutions.com",
      website: "https://techsolutions.com",
      address: "789 Tech Park",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "USA"
    },
    categoryIds: ["technology"],
    locationIds: ["sf-downtown"],
    buttonAction: "https://directory.example.com/tech-solutions-inc",
    featured: false,
    popular: false,
    rating: 4.2,
    priceRange: "$$",
    price: 2,
    createdAt: new Date().toISOString()
  },
  {
    id: "4",
    name: "Green Leaf Café",
    tagline: "Organic Coffee & Fresh Pastries",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400",
    description: "Cozy neighborhood café serving organic coffee and homemade pastries",
    contact: {
      phone: "(555) 456-7890",
      email: "hello@greenleafcafe.com",
      website: "https://greenleafcafe.com",
      address: "321 Garden Street",
      city: "Portland",
      state: "OR",
      zipCode: "97201",
      country: "USA"
    },
    categoryIds: ["restaurant"],
    locationIds: ["portland"],
    buttonAction: "https://directory.example.com/green-leaf-cafe",
    featured: false,
    popular: false,
    rating: 4.6,
    priceRange: "$",
    price: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: "5",
    name: "Urban Yoga Studio",
    tagline: "Find Your Inner Peace",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
    description: "Modern yoga studio offering classes for all skill levels",
    contact: {
      phone: "(555) 567-8901",
      email: "info@urbanyoga.com",
      website: "https://urbanyoga.com",
      address: "654 Wellness Way",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      country: "USA"
    },
    categoryIds: ["fitness"],
    locationIds: ["austin"],
    buttonAction: "https://directory.example.com/urban-yoga-studio",
    featured: true,
    popular: false,
    rating: 4.7,
    priceRange: "$$",
    price: 2,
    createdAt: new Date().toISOString()
  },
  {
    id: "6",
    name: "Digital Marketing Pro",
    tagline: "Grow Your Business Online",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
    description: "Full-service digital marketing agency specializing in small businesses",
    contact: {
      phone: "(555) 678-9012",
      email: "contact@digitalmarketingpro.com",
      website: "https://digitalmarketingpro.com",
      address: "987 Marketing Blvd",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "USA"
    },
    categoryIds: ["technology"],
    locationIds: ["chicago"],
    buttonAction: "https://directory.example.com/digital-marketing-pro",
    featured: false,
    popular: true,
    rating: 4.4,
    priceRange: "$$$",
    price: 3,
    createdAt: new Date().toISOString()
  },
  {
    id: "7",
    name: "Sunset Spa & Wellness",
    tagline: "Relax, Rejuvenate, Restore",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    description: "Luxury spa offering massage therapy, facials, and wellness treatments",
    contact: {
      phone: "(555) 789-0123",
      email: "bookings@sunsetspa.com",
      website: "https://sunsetspa.com",
      address: "159 Serenity Lane",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      country: "USA"
    },
    categoryIds: ["fitness"],
    locationIds: ["miami"],
    buttonAction: "https://directory.example.com/sunset-spa-wellness",
    featured: false,
    popular: false,
    rating: 4.9,
    priceRange: "$$$$",
    price: 4,
    createdAt: new Date().toISOString()
  },
  {
    id: "8",
    name: "The Book Nook",
    tagline: "Your Local Literary Haven",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
    description: "Independent bookstore with rare finds and cozy reading corners",
    contact: {
      phone: "(555) 890-1234",
      email: "info@thebooknook.com",
      website: "https://thebooknook.com",
      address: "742 Library Street",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "USA"
    },
    categoryIds: ["retail"],
    locationIds: ["seattle"],
    buttonAction: "https://directory.example.com/the-book-nook",
    featured: false,
    popular: false,
    rating: 4.3,
    priceRange: "$$",
    price: 2,
    createdAt: new Date().toISOString()
  },
  {
    id: "9",
    name: "Phoenix Auto Repair",
    tagline: "Expert Auto Care Since 1998",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400",
    description: "Professional auto repair services with certified mechanics",
    contact: {
      phone: "(555) 901-2345",
      email: "service@phoenixauto.com",
      website: "https://phoenixauto.com",
      address: "258 Motor Way",
      city: "Phoenix",
      state: "AZ",
      zipCode: "85001",
      country: "USA"
    },
    categoryIds: ["automotive"],
    locationIds: ["phoenix"],
    buttonAction: "https://directory.example.com/phoenix-auto-repair",
    featured: true,
    popular: false,
    rating: 4.1,
    priceRange: "$$",
    price: 2,
    createdAt: new Date().toISOString()
  },
  {
    id: "10",
    name: "Creative Hair Studio",
    tagline: "Style That Speaks",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
    description: "Modern hair salon offering cuts, color, and styling services",
    contact: {
      phone: "(555) 012-3456",
      email: "book@creativehair.com",
      website: "https://creativehair.com",
      address: "369 Style Avenue",
      city: "Denver",
      state: "CO",
      zipCode: "80201",
      country: "USA"
    },
    categoryIds: ["beauty"],
    locationIds: ["denver"],
    buttonAction: "https://directory.example.com/creative-hair-studio",
    featured: false,
    popular: true,
    rating: 4.8,
    priceRange: "$$$",
    price: 3,
    createdAt: new Date().toISOString()
  },
  {
    id: "11",
    name: "Mountain View Veterinary",
    tagline: "Caring for Your Best Friend",
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400",
    description: "Full-service veterinary clinic providing compassionate pet care",
    contact: {
      phone: "(555) 123-4567",
      email: "care@mountainviewvet.com",
      website: "https://mountainviewvet.com",
      address: "147 Pet Care Drive",
      city: "Boulder",
      state: "CO",
      zipCode: "80301",
      country: "USA"
    },
    categoryIds: ["healthcare"],
    locationIds: ["boulder"],
    buttonAction: "https://directory.example.com/mountain-view-veterinary",
    featured: false,
    popular: false,
    rating: 4.7,
    priceRange: "$$$",
    price: 3,
    createdAt: new Date().toISOString()
  }
]);

// Business-specific operations
export const useBusinessStore = () => {
  const addBusiness = (business: BusinessInterface) => {
    businesses.value.push(business);
  };

  const updateBusiness = (updatedBusiness: BusinessInterface) => {
    const index = businesses.value.findIndex(b => b.id === updatedBusiness.id);
    if (index !== -1) {
      businesses.value[index] = updatedBusiness;
    }
  };

  const deleteBusiness = (businessId: string) => {
    const index = businesses.value.findIndex(b => b.id === businessId);
    if (index !== -1) {
      businesses.value.splice(index, 1);
    }
  };

  const getBusinessById = (id: string) => {
    return businesses.value.find(b => b.id === id);
  };

  const getBusinessesByCategory = (categoryId: string) => {
    return businesses.value.filter(b => b.categoryIds.includes(categoryId));
  };

  const getBusinessesByLocation = (locationId: string) => {
    return businesses.value.filter(b => b.locationIds.includes(locationId));
  };

  const getFeaturedBusinesses = () => {
    return businesses.value.filter(b => b.featured);
  };

  const getPopularBusinesses = () => {
    return businesses.value.filter(b => b.popular);
  };

  return {
    businesses,
    addBusiness,
    updateBusiness,
    deleteBusiness,
    getBusinessById,
    getBusinessesByCategory,
    getBusinessesByLocation,
    getFeaturedBusinesses,
    getPopularBusinesses,
  };
};