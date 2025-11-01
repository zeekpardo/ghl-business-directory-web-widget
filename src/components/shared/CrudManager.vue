<script setup lang="ts" generic="T extends CrudItem">
import { ref } from 'vue';
import {
  NButton,
  NCard,
  NForm,
  NIcon,
  useDialog,
  useMessage,
  FormInst
} from 'naive-ui';
import { AddOutline, TrashOutline, SaveOutline, CloseOutline, ArrowBackOutline } from '@vicons/ionicons5';
import { PencilOutline } from '@vicons/ionicons5';
import { CrudItem } from '../../composables/useCrud';
import { CSS_CLASSES, generateId } from '../../utils/const';

interface CrudManagerProps<T extends CrudItem> {
  title: string;
  description: string;
  items: T[];
  createDefault: () => Omit<T, 'id'>;
  validation?: Record<string, any>;
  onAfterCreate?: (item: T) => void;
  onAfterUpdate?: (item: T) => void;
  onAfterDelete?: (item: T) => void;
  getBusinessCount?: (itemId: string) => number;
  cardFields?: string[];
  showTags?: boolean;
  showColors?: boolean;
}

const props = defineProps<CrudManagerProps<T>>();

// Dialog and message services
const dialog = useDialog();
const message = useMessage();

// Form reference
const formRef = ref<FormInst | null>(null);

// CRUD setup - we'll manage items directly since we're passing them as props
const { items } = props;

// Form data
const formData = ref<T>({} as T);
const isEditing = ref(false);
const isLoading = ref(false);

// Tag input (if tags are supported)
const newTag = ref('');


// Edit view handlers
const openCreateView = () => {
  isEditing.value = true;
  formData.value = {
    id: generateId(),
    ...props.createDefault()
  } as T;
};

const openEditView = (item: T) => {
  isEditing.value = true;
  formData.value = { ...item };
};

const closeEditView = () => {
  isEditing.value = false;
  formData.value = {} as T;
  newTag.value = '';
  formRef.value?.restoreValidation();
};

// Tag management (if enabled)
const addTag = () => {
  if (!props.showTags) return;
  
  const tag = newTag.value.trim();
  const itemData = formData.value as any;
  
  if (tag && (!itemData.tags || !itemData.tags.includes(tag))) {
    if (!itemData.tags) {
      itemData.tags = [];
    }
    itemData.tags.push(tag);
    newTag.value = '';
  }
};

const removeTag = (index: number) => {
  if (!props.showTags) return;
  
  const itemData = formData.value as any;
  if (itemData.tags) {
    itemData.tags.splice(index, 1);
  }
};

const handleTagInputKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addTag();
  }
};

// Save handler
const handleSave = async () => {
  try {
    isLoading.value = true;
    await formRef.value?.validate();
    
    // Clean up tags if they exist
    const itemData = formData.value as any;
    if (props.showTags && itemData.tags) {
      itemData.tags = itemData.tags
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0);
    }
    
    // Save the item by adding or updating
    const existingIndex = items.findIndex(item => item.id === formData.value.id);
    if (existingIndex > -1) {
      // Update existing
      items[existingIndex] = formData.value;
      props.onAfterUpdate?.(formData.value);
    } else {
      // Add new
      items.push(formData.value);
      props.onAfterCreate?.(formData.value);
    }
    
    message.success(`${props.title.slice(0, -1)} "${itemData.name}" saved successfully`);
    closeEditView();
  } catch (error) {
    if (error instanceof Array) {
      const firstError = error[0] as any;
      message.error(firstError?.message || 'Please correct the form errors');
    } else {
      message.error(`Failed to save ${props.title.toLowerCase().slice(0, -1)}`);
    }
  } finally {
    isLoading.value = false;
  }
};

// Delete handler
const handleDelete = (item: T) => {
  const itemData = item as any;
  const businessCount = props.getBusinessCount?.(item.id) || 0;
  
  const warningMessage = businessCount > 0 
    ? `This ${props.title.toLowerCase().slice(0, -1)} is used by ${businessCount} business(es). Deleting it will remove the association from all businesses. Are you sure?`
    : `Are you sure you want to delete "${itemData.name}"?`;
  
  dialog.warning({
    title: 'Confirm Delete',
    content: warningMessage,
    positiveText: 'Delete',
    negativeText: 'Cancel',
    onPositiveClick: async () => {
      const index = items.findIndex(i => i.id === item.id);
      if (index > -1) {
        items.splice(index, 1);
        props.onAfterDelete?.(item);
        message.success(`${props.title.slice(0, -1)} "${itemData.name}" deleted successfully`);
      }
    }
  });
};

// Business count helper
const getDisplayBusinessCount = (itemId: string) => {
  return props.getBusinessCount?.(itemId) || 0;
};
</script>

<template>
  <div :class="CSS_CLASSES.PADDING_SECTION">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div class="flex-1">
        <h1 :class="CSS_CLASSES.TITLE_LARGE + ' text-xl sm:text-2xl'">{{ title }}</h1>
        <p :class="CSS_CLASSES.TEXT_MUTED + ' text-sm sm:text-base'">{{ description }}</p>
      </div>
      <n-button 
        type="primary" 
        @click="openCreateView"
        class="w-full sm:w-auto"
        size="medium"
      >
        <template #icon>
          <n-icon><AddOutline /></n-icon>
        </template>
        <span class="hidden sm:inline">Add {{ title.slice(0, -1) }}</span>
        <span class="sm:hidden">Add</span>
      </n-button>
    </div>

    <!-- Items Grid -->
    <div v-if="!isEditing">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <!-- Empty State -->
        <div v-if="items.length === 0" class="col-span-full">
          <div :class="CSS_CLASSES.FLEX_CENTER + ' h-48 sm:h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300'">
            <div class="text-center px-4">
              <h3 :class="CSS_CLASSES.TITLE_MEDIUM + ' mb-2 text-lg sm:text-xl'">No {{ title.toLowerCase() }} yet</h3>
              <p :class="CSS_CLASSES.TEXT_MUTED + ' mb-4 text-sm sm:text-base'">Create your first {{ title.toLowerCase().slice(0, -1) }} to get started</p>
              <n-button 
                type="primary" 
                @click="openCreateView"
                class="w-full sm:w-auto"
                size="medium"
              >
                <template #icon>
                  <n-icon><AddOutline /></n-icon>
                </template>
                Add {{ title.slice(0, -1) }}
              </n-button>
            </div>
          </div>
        </div>

        <!-- Item Cards -->
        <div 
          v-for="item in items" 
          :key="item.id"
          class="w-full"
        >
          <n-card
            class="cursor-pointer hover:shadow-lg transition-shadow duration-200 touch-manipulation"
            :bordered="true"
          >
            <template #header>
              <div class="flex justify-between items-start gap-3">
                <div class="flex-1 min-w-0">
                  <h3 class="text-base sm:text-lg font-semibold truncate">{{ (item as any).name }}</h3>
                  <p class="text-xs sm:text-sm opacity-80 mt-1" v-if="getBusinessCount">
                    {{ getDisplayBusinessCount(item.id) }} businesses
                  </p>
                </div>
                <div class="flex gap-2 flex-shrink-0">
                  <n-button 
                    size="small" 
                    circle 
                    secondary
                    @click.stop="openEditView(item)"
                    class="touch-manipulation min-h-[36px] min-w-[36px]"
                  >
                    <template #icon>
                      <n-icon size="16"><PencilOutline /></n-icon>
                    </template>
                  </n-button>
                  <n-button 
                    size="small" 
                    circle 
                    secondary
                    @click.stop="handleDelete(item)"
                    class="touch-manipulation min-h-[36px] min-w-[36px]"
                  >
                    <template #icon>
                      <n-icon size="16"><TrashOutline /></n-icon>
                    </template>
                  </n-button>
                </div>
              </div>
            </template>

            <!-- Simple card content -->
            <div class="text-xs sm:text-sm text-gray-500">
              {{ title.slice(0, -1) }} for organizing businesses
            </div>
          </n-card>
        </div>
      </div>
    </div>

    <!-- Add/Edit Form -->
    <div v-if="isEditing">
      <n-card
        :title="formData.id && items.find(i => i.id === formData.id) ? `Edit ${title.slice(0, -1)}` : `Add ${title.slice(0, -1)}`"
        :bordered="true"
        class="mobile-form-card"
      >
        <template #header-extra>
          <n-button 
            circle 
            secondary
            @click="closeEditView"
            :disabled="isLoading"
            class="touch-manipulation min-h-[40px] min-w-[40px]"
          >
            <template #icon>
              <n-icon size="18"><ArrowBackOutline /></n-icon>
            </template>
          </n-button>
        </template>

        <n-form
          ref="formRef"
          :model="formData"
          :rules="validation || {}"
          label-placement="top"
          require-mark-placement="right-hanging"
        >
          <!-- Dynamic Form Content Slot -->
          <slot 
            name="form" 
            :form-data="formData" 
            :is-loading="isLoading"
            :new-tag="newTag"
            :add-tag="addTag"
            :remove-tag="removeTag"
            :handle-tag-input-keydown="handleTagInputKeydown"
            :show-tags="showTags"
            :show-colors="showColors"
          />
        </n-form>

        <template #action>
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-2">
            <n-button 
              @click="closeEditView" 
              :disabled="isLoading"
              class="w-full sm:w-auto order-2 sm:order-1 touch-manipulation min-h-[44px]"
              size="medium"
            >
              <template #icon>
                <n-icon><CloseOutline /></n-icon>
              </template>
              Cancel
            </n-button>
            <n-button 
              type="primary" 
              @click="handleSave" 
              :loading="isLoading"
              class="w-full sm:w-auto order-1 sm:order-2 touch-manipulation min-h-[44px]"
              size="medium"
            >
              <template #icon>
                <n-icon><SaveOutline /></n-icon>
              </template>
              {{ formData.id && items.find(i => i.id === formData.id) ? 'Update' : 'Create' }}
            </n-button>
          </div>
        </template>
      </n-card>
    </div>
  </div>
</template>

<style scoped>
.mobile-form-card {
  /* Ensure form card takes full width on mobile */
  width: 100%;
}

/* Enhanced touch targets for mobile */
.touch-manipulation {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* Improve card interaction on mobile */
.n-card {
  transition: transform 0.1s ease-in-out, box-shadow 0.2s ease-in-out;
}

.n-card:active {
  transform: scale(0.98);
}

/* Better spacing for mobile forms */
@media (max-width: 640px) {
  .mobile-form-card :deep(.n-card-header) {
    padding: 16px;
  }
  
  .mobile-form-card :deep(.n-card__content) {
    padding: 16px;
  }
  
  .mobile-form-card :deep(.n-card__action) {
    padding: 16px;
    border-top: 1px solid #f0f0f0;
  }
  
  /* Larger form inputs on mobile */
  .mobile-form-card :deep(.n-input) {
    min-height: 44px;
  }
  
  .mobile-form-card :deep(.n-input__input-el) {
    font-size: 16px; /* Prevents zoom on iOS */
  }
  
  .mobile-form-card :deep(.n-select) {
    min-height: 44px;
  }
  
  .mobile-form-card :deep(.n-base-selection) {
    min-height: 44px;
  }
}

/* Grid improvements for very small screens */
@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>