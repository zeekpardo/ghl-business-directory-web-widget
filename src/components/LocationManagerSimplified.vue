<script setup lang="ts">
import { NFormItem, NInput } from 'naive-ui';
import CrudManager from './shared/CrudManager.vue';
import { LocationInterface } from '../types';
import { useLocationStore } from '../store/locations';
import { useBusinessStore } from '../store/businesses';

// Store setup
const { locations } = useLocationStore();
const { businesses } = useBusinessStore();

// Validation rules
const validationRules = {
  name: [
    {
      required: true,
      message: 'Please enter a location name',
      trigger: 'blur'
    },
    {
      validator: (_rule: any, value: string) => {
        if (!value) return true;
        
        const exists = locations.value.some(loc => 
          loc.name.toLowerCase() === value.toLowerCase()
        );
        
        if (exists) {
          return new Error('Location name already exists');
        }
        
        return true;
      },
      trigger: 'blur'
    }
  ]
};

// Business count helper
const getBusinessCount = (locationId: string) => {
  return businesses.value.filter(b => b.locationIds.includes(locationId)).length;
};

// Create default location - only name field
const createDefaultLocation = (): Omit<LocationInterface, 'id'> => ({
  name: ''
});

// Lifecycle hooks
const handleAfterDelete = (deletedLocation: LocationInterface) => {
  // Remove location from businesses when deleted
  businesses.value.forEach(business => {
    const index = business.locationIds.indexOf(deletedLocation.id);
    if (index > -1) {
      business.locationIds.splice(index, 1);
    }
  });
};
</script>

<template>
  <CrudManager
    title="Locations"
    description="Manage physical locations that businesses can be associated with"
    :items="locations"
    :create-default="createDefaultLocation"
    :validation="validationRules"
    :get-business-count="getBusinessCount"
    :on-after-delete="handleAfterDelete"
    :show-tags="false"
    :show-colors="false"
  >
    <template #form="{ formData, isLoading }">
      <!-- Location Name -->
      <n-form-item label="Location Name" path="name">
        <n-input
          v-model:value="formData.name"
          placeholder="Enter location name"
          :disabled="isLoading"
        />
      </n-form-item>
    </template>
  </CrudManager>
</template>