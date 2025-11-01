import { ref, Ref } from 'vue';
import { generateId } from '../utils/const';

export interface CrudItem {
  id: string;
  [key: string]: any;
}

export interface CrudOptions<T extends CrudItem> {
  items: Ref<T[]>;
  createDefault: () => Omit<T, 'id'>;
  onAfterCreate?: (item: T) => void;
  onAfterUpdate?: (item: T) => void;
  onAfterDelete?: (item: T) => void;
}

export const useCrud = <T extends CrudItem>(options: CrudOptions<T>) => {
  const { items, createDefault, onAfterCreate, onAfterUpdate, onAfterDelete } = options;
  
  const selectedItem = ref<T | undefined>();
  const isEditing = ref(false);
  const isLoading = ref(false);

  // Create new item
  const create = (data: Omit<T, 'id'>): T => {
    const newItem = {
      ...data,
      id: generateId(),
    } as T;
    
    items.value.push(newItem);
    onAfterCreate?.(newItem);
    return newItem;
  };

  // Update existing item
  const update = (id: string, data: Partial<T>): T | undefined => {
    const index = items.value.findIndex(item => item.id === id);
    if (index === -1) return undefined;
    
    const updatedItem = { ...items.value[index], ...data } as T;
    items.value[index] = updatedItem;
    onAfterUpdate?.(updatedItem);
    return updatedItem;
  };

  // Delete item
  const remove = (id: string): boolean => {
    const index = items.value.findIndex(item => item.id === id);
    if (index === -1) return false;
    
    const deletedItem = items.value[index];
    items.value.splice(index, 1);
    onAfterDelete?.(deletedItem);
    return true;
  };

  // Find item by id
  const findById = (id: string): T | undefined => {
    return items.value.find(item => item.id === id);
  };

  // Find items by condition
  const findWhere = (predicate: (item: T) => boolean): T[] => {
    return items.value.filter(predicate);
  };

  // UI state management
  const startCreate = () => {
    selectedItem.value = { ...createDefault(), id: generateId() } as T;
    isEditing.value = true;
  };

  const startEdit = (item: T) => {
    selectedItem.value = { ...item };
    isEditing.value = true;
  };

  const cancelEdit = () => {
    selectedItem.value = undefined;
    isEditing.value = false;
  };

  const saveItem = async (item: T): Promise<T> => {
    isLoading.value = true;
    try {
      let savedItem: T;
      
      if (findById(item.id)) {
        savedItem = update(item.id, item)!;
      } else {
        savedItem = create(item);
      }
      
      cancelEdit();
      return savedItem;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteItem = async (id: string): Promise<boolean> => {
    isLoading.value = true;
    try {
      return remove(id);
    } finally {
      isLoading.value = false;
    }
  };

  // Bulk operations
  const bulkUpdate = (updates: Array<{ id: string; data: Partial<T> }>): T[] => {
    const updatedItems: T[] = [];
    
    updates.forEach(({ id, data }) => {
      const updated = update(id, data);
      if (updated) {
        updatedItems.push(updated);
      }
    });
    
    return updatedItems;
  };

  const bulkDelete = (ids: string[]): number => {
    let deletedCount = 0;
    
    ids.forEach(id => {
      if (remove(id)) {
        deletedCount++;
      }
    });
    
    return deletedCount;
  };

  // Computed helpers
  const count = () => items.value.length;
  const isEmpty = () => items.value.length === 0;

  return {
    // Data
    items,
    selectedItem,
    isEditing,
    isLoading,
    
    // Core CRUD operations
    create,
    update,
    remove,
    findById,
    findWhere,
    
    // UI operations
    startCreate,
    startEdit,
    cancelEdit,
    saveItem,
    deleteItem,
    
    // Bulk operations
    bulkUpdate,
    bulkDelete,
    
    // Helpers
    count,
    isEmpty,
  };
};