<script setup lang="ts">
import { computed } from 'vue';
import { BusinessInterface } from '../../types';
import useStore from '../../store';

interface Props {
  business: BusinessInterface;
  onEdit?: (business: BusinessInterface) => void;
  onDelete?: (business: BusinessInterface) => void;
  showActions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showActions: false,
});

const { categories, locations } = useStore();

const businessCategories = computed(() => {
  return props.business.categoryIds
    .map(id => categories.value.find(cat => cat.id === id))
    .filter(Boolean);
});

const businessLocations = computed(() => {
  return props.business.locationIds
    .map(id => locations.value.find(loc => loc.id === id))
    .filter(Boolean);
});

const handleEdit = () => {
  if (props.onEdit) {
    props.onEdit(props.business);
  }
};

const handleDelete = () => {
  if (props.onDelete) {
    props.onDelete(props.business);
  }
};
</script>

<template>
  <div class="business-card-preview bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
    <!-- Header with image and badges -->
    <div class="relative mb-3">
      <div v-if="business.image" class="w-full aspect-video bg-gray-200 rounded-lg overflow-hidden mb-2">
        <img
          :src="business.image"
          :alt="business.name"
          class="w-full h-full object-cover"
          @error="($event.target as HTMLImageElement).style.display = 'none'"
        />
      </div>
      
      <!-- Badges -->
      <div v-if="business.featured || business.popular" class="flex gap-2 mb-2">
        <span
          v-if="business.featured"
          class="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-800 rounded"
        >
          Featured
        </span>
        <span
          v-if="business.popular"
          class="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded"
        >
          Popular
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="space-y-2">
      <!-- Title and Actions -->
      <div class="flex justify-between items-start">
        <h3 class="text-lg font-semibold text-gray-900 line-clamp-1">
          {{ business.name }}
        </h3>
        
        <div v-if="showActions" class="flex gap-1 ml-2">
          <button
            @click="handleEdit"
            class="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
            </svg>
          </button>
          <button
            @click="handleDelete"
            class="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Tagline -->
      <p v-if="business.tagline" class="text-sm text-gray-600 line-clamp-2">
        {{ business.tagline }}
      </p>

      <!-- Rating and Price -->
      <div class="flex items-center justify-between">
        <div v-if="business.rating" class="flex items-center gap-1">
          <span class="text-sm font-medium">{{ business.rating }}</span>
          <div class="flex">
            <span
              v-for="i in 5"
              :key="i"
              class="text-xs"
              :class="i <= business.rating ? 'text-yellow-400' : 'text-gray-300'"
            >
              ★
            </span>
          </div>
        </div>
        
        <span v-if="business.priceRange" class="text-sm font-medium text-gray-600">
          {{ business.priceRange }}
        </span>
      </div>

      <!-- Categories -->
      <div v-if="businessCategories.length" class="flex flex-wrap gap-1">
        <span
          v-for="category in businessCategories"
          :key="category?.id"
          class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
        >
          {{ category?.name }}
        </span>
      </div>

      <!-- Locations -->
      <div v-if="businessLocations.length" class="flex flex-wrap gap-1">
        <span
          v-for="location in businessLocations"
          :key="location?.id"
          class="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded"
        >
          {{ location?.name }}
        </span>
      </div>

      <!-- Contact Info -->
      <div v-if="business.contact" class="space-y-1 text-xs text-gray-500">
        <div v-if="business.contact.phone" class="flex items-center gap-1">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
          </svg>
          {{ business.contact.phone }}
        </div>
        
        <div v-if="business.contact.address" class="flex items-start gap-1">
          <svg class="w-3 h-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
          </svg>
          <span class="flex-1">
            {{ business.contact.address }}
            <span v-if="business.contact.city">, {{ business.contact.city }}</span>
            <span v-if="business.contact.state">, {{ business.contact.state }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>