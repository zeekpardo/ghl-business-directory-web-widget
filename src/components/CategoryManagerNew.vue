<script setup lang="ts">
import { ref } from 'vue';
import { NFormItem, NInput, NSpace, NButton, NTag } from 'naive-ui';
import CrudManager from './shared/CrudManager.vue';
import { CategoryInterface } from '../types';
import { useCategoryStore } from '../store/categories';
import { useBusinessStore } from '../store/businesses';

// Local refs for the form
const localNewTag = ref('');

// Store setup
const { categories } = useCategoryStore();
const { businesses } = useBusinessStore();

// Validation rules
const validationRules = {
  name: [
    {
      required: true,
      message: 'Please enter a category name',
      trigger: 'blur'
    },
    {
      validator: (_rule: any, value: string) => {
        if (!value) return true;
        
        const exists = categories.value.some(cat => 
          cat.name.toLowerCase() === value.toLowerCase()
        );
        
        if (exists) {
          return new Error('Category name already exists');
        }
        
        return true;
      },
      trigger: 'blur'
    }
  ]
};

// Business count helper
const getBusinessCount = (categoryId: string) => {
  return businesses.value.filter(b => b.categoryIds.includes(categoryId)).length;
};

// Create default category
const createDefaultCategory = (): Omit<CategoryInterface, 'id'> => ({
  name: '',
  tags: []
});

// Tag management helpers
const handleAddTag = (formData: any) => {
  const tag = localNewTag.value.trim();
  if (tag && (!formData.tags || !formData.tags.includes(tag))) {
    if (!formData.tags) {
      formData.tags = [];
    }
    formData.tags.push(tag);
    localNewTag.value = '';
  }
};

// Lifecycle hooks
const handleAfterDelete = (deletedCategory: CategoryInterface) => {
  // Remove category from businesses when deleted
  businesses.value.forEach(business => {
    const index = business.categoryIds.indexOf(deletedCategory.id);
    if (index > -1) {
      business.categoryIds.splice(index, 1);
    }
  });
};
</script>

<template>
  <CrudManager
    title="Categories"
    description="Manage business categories with tags for better organization"
    :items="categories"
    :create-default="createDefaultCategory"
    :validation="validationRules"
    :get-business-count="getBusinessCount"
    :on-after-delete="handleAfterDelete"
    :show-tags="false"
    :show-colors="false"
  >
    <template #form="{ formData, isLoading, removeTag }">
      <!-- Category Name -->
      <n-form-item label="Category Name" path="name">
        <n-input
          v-model:value="formData.name"
          placeholder="Enter category name"
          :disabled="isLoading"
        />
      </n-form-item>

      <!-- Tags Section -->
      <n-form-item label="Tags">
        <div class="w-full space-y-3">
          <!-- Add Tag Input -->
          <n-space>
            <n-input
              v-model:value="localNewTag"
              placeholder="Enter a tag and press Enter"
              :disabled="isLoading"
              @keydown="(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(formData); } }"
              style="flex: 1"
            />
            <n-button
              @click="() => handleAddTag(formData)"
              :disabled="!localNewTag.trim() || isLoading"
              type="primary"
            >
              Add Tag
            </n-button>
          </n-space>

          <!-- Existing Tags -->
          <div v-if="formData.tags && formData.tags.length > 0" class="space-y-2">
            <h4 class="text-sm font-medium">Current Tags:</h4>
            <div class="flex flex-wrap gap-2">
              <n-tag
                v-for="(tag, index) in formData.tags"
                :key="index"
                closable
                @close="removeTag(index)"
                :disabled="isLoading"
              >
                {{ tag }}
              </n-tag>
            </div>
          </div>
          <div v-else class="text-sm text-gray-500">
            No tags added yet. Tags help categorize businesses more specifically.
          </div>
        </div>
      </n-form-item>

    </template>
  </CrudManager>
</template>