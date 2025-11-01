import { ref } from "vue";
import { CategoryInterface } from "../types";

export const categories = ref<CategoryInterface[]>([
  {
    id: "fitness",
    name: "Fitness & Wellness",
    color: "#10b981",
    textColor: "#ffffff",
    tags: ["gym", "yoga", "pilates", "personal training", "spa", "wellness"]
  },
  {
    id: "restaurant",
    name: "Restaurants & Cafes",
    color: "#ef4444",
    textColor: "#ffffff",
    tags: ["italian", "american", "asian", "cafe", "bar", "coffee"]
  },
  {
    id: "technology",
    name: "Technology & Services",
    color: "#3b82f6",
    textColor: "#ffffff",
    tags: ["IT support", "web design", "software", "consulting", "digital marketing"]
  },
  {
    id: "retail",
    name: "Retail & Shopping",
    color: "#8b5cf6",
    textColor: "#ffffff",
    tags: ["bookstore", "clothing", "electronics", "home goods"]
  },
  {
    id: "automotive",
    name: "Automotive Services",
    color: "#f59e0b",
    textColor: "#ffffff",
    tags: ["auto repair", "car service", "maintenance", "mechanic"]
  },
  {
    id: "beauty",
    name: "Beauty & Personal Care",
    color: "#ec4899",
    textColor: "#ffffff",
    tags: ["hair salon", "nail salon", "skincare", "barbershop"]
  },
  {
    id: "healthcare",
    name: "Healthcare & Medical",
    color: "#06b6d4",
    textColor: "#ffffff",
    tags: ["veterinary", "dental", "medical", "clinic", "wellness"]
  }
]);

// Category-specific operations
export const useCategoryStore = () => {
  const addCategory = (category: CategoryInterface) => {
    categories.value.push(category);
  };

  const updateCategory = (updatedCategory: CategoryInterface) => {
    const index = categories.value.findIndex(c => c.id === updatedCategory.id);
    if (index !== -1) {
      categories.value[index] = updatedCategory;
    }
  };

  const deleteCategory = (categoryId: string) => {
    const index = categories.value.findIndex(c => c.id === categoryId);
    if (index !== -1) {
      categories.value.splice(index, 1);
    }
  };

  const getCategoryById = (id: string) => {
    return categories.value.find(c => c.id === id);
  };

  const getCategoryNames = (categoryIds: string[]) => {
    return categoryIds.map(id => {
      const category = categories.value.find(cat => cat.id === id);
      return category ? category.name : '';
    }).filter(Boolean);
  };

  const getCategoriesWithBusinessCount = (businesses: any[]) => {
    return categories.value.map(category => ({
      ...category,
      businessCount: businesses.filter(b => b.categoryIds.includes(category.id)).length
    }));
  };

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getCategoryNames,
    getCategoriesWithBusinessCount,
  };
};