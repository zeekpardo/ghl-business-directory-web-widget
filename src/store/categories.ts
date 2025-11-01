import { ref } from "vue";
import { CategoryInterface } from "../types";

export const categories = ref<CategoryInterface[]>([
  {
    id: "fitness",
    name: "Fitness & Wellness",
    tags: ["gym", "yoga", "pilates", "personal training", "spa", "wellness"]
  },
  {
    id: "restaurant",
    name: "Restaurants & Cafes",
    tags: ["italian", "american", "asian", "cafe", "bar", "coffee"]
  },
  {
    id: "technology",
    name: "Technology & Services",
    tags: ["IT support", "web design", "software", "consulting", "digital marketing"]
  },
  {
    id: "retail",
    name: "Retail & Shopping",
    tags: ["bookstore", "clothing", "electronics", "home goods"]
  },
  {
    id: "automotive",
    name: "Automotive Services",
    tags: ["auto repair", "car service", "maintenance", "mechanic"]
  },
  {
    id: "beauty",
    name: "Beauty & Personal Care",
    tags: ["hair salon", "nail salon", "skincare", "barbershop"]
  },
  {
    id: "healthcare",
    name: "Healthcare & Medical",
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

  const deleteTag = (categoryId: string, tagToDelete: string) => {
    const category = categories.value.find(c => c.id === categoryId);
    if (category && category.tags) {
      const tagIndex = category.tags.indexOf(tagToDelete);
      if (tagIndex > -1) {
        category.tags.splice(tagIndex, 1);
      }
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
    deleteTag,
    getCategoryById,
    getCategoryNames,
    getCategoriesWithBusinessCount,
  };
};