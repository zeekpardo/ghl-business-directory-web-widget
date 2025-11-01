<script setup lang="ts">
import {
  FormInst,
  NButton,
  NCheckbox,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NRate,
} from "naive-ui";
import { onMounted, ref, computed, watch } from "vue";
import { BusinessInterface } from "../types";
import { generateId, priceRangeOptions, createSlug } from "../utils/const";
import useStore from "../store";

const props = defineProps<{
  business?: BusinessInterface;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "success", payload: BusinessInterface): void;
}>();

const { categories, locations, agencySettings } = useStore();

const newBusiness = ref<BusinessInterface>({
  id: generateId(),
  name: "",
  tagline: "",
  image: "",
  description: "",
  contact: {
    phone: "",
    email: "",
    website: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  },
  categoryIds: [],
  locationIds: [],
  buttonAction: "",
  featured: false,
  popular: false,
  rating: 0,
  priceRange: "$$",
  createdAt: new Date().toISOString(),
});

// Business slug for URL generation
const businessSlug = ref('');
const fullDirectoryURL = computed(() => {
  if (agencySettings.value.agencyRootDomain && businessSlug.value) {
    const cleanDomain = agencySettings.value.agencyRootDomain.replace(/\/$/, '');
    return `${cleanDomain}/${businessSlug.value}`;
  }
  return '';
});

const formRef = ref<FormInst | null>(null);

// Category and location options
const categoryOptions = computed(() => categories.value.map(cat => ({
  label: cat.name,
  value: cat.id
})));

const locationOptions = computed(() => locations.value.map(loc => ({
  label: loc.name,
  value: loc.id
})));

const saveBusiness = async () => {
  try {
    await formRef.value?.validate();
    emit("success", newBusiness.value);
  } catch (e) {
    console.error(e);
    return;
  }
};

const rules = {
  name: [{ required: true, message: "Business name is required", trigger: "blur" }],
  categoryIds: [
    {
      required: true,
      type: 'array' as const,
      min: 1,
      message: "At least one category is required",
      trigger: "change"
    }
  ],
};

const resetForm = () => {
  formRef.value?.restoreValidation();
  emit("close");
};

// Watch business name changes to auto-generate slug
watch(() => newBusiness.value.name, (newName) => {
  if (newName && !props.business) { // Only auto-generate for new businesses
    businessSlug.value = createSlug(newName);
    updateButtonAction();
  }
});

// Watch slug changes to update button action
watch(businessSlug, () => {
  updateButtonAction();
});

// Watch agency root domain changes
watch(() => agencySettings.value.agencyRootDomain, () => {
  updateButtonAction();
});

const updateButtonAction = () => {
  if (fullDirectoryURL.value) {
    newBusiness.value.buttonAction = fullDirectoryURL.value;
  }
};

onMounted(() => {
  if (props.business) {
    newBusiness.value = { ...props.business };
    // Extract slug from existing buttonAction
    if (props.business.buttonAction && agencySettings.value.agencyRootDomain) {
      const urlParts = props.business.buttonAction.split('/');
      businessSlug.value = urlParts[urlParts.length - 1] || createSlug(props.business.name);
    } else {
      businessSlug.value = createSlug(props.business.name);
    }
  } else {
    // For new businesses, generate slug from name if it exists
    if (newBusiness.value.name) {
      businessSlug.value = createSlug(newBusiness.value.name);
      updateButtonAction();
    }
  }
});
</script>

<template>
  <div class="flex justify-center min-h-full py-10 overflow-auto">
    <NForm
      class="w-full max-w-xs p-8 bg-white rounded-lg shadow-md h-fit lg:max-w-2xl"
      :rules="rules"
      :model="newBusiness"
      ref="formRef"
    >
      <h2 class="mb-6 text-2xl font-semibold text-center text-gray-800">
        {{ props.business ? "Edit Business" : "Add New Business" }}
      </h2>
      
      <!-- Basic Information -->
      <div class="mb-6">
        <h3 class="mb-3 text-lg font-semibold">Basic Information</h3>
        <NFormItem label="Business Name" path="name">
          <NInput v-model:value="newBusiness.name" placeholder="e.g., Elite Fitness Center" />
        </NFormItem>
        <NFormItem label="Tagline">
          <NInput v-model:value="newBusiness.tagline" placeholder="e.g., Transform Your Body, Transform Your Life" />
        </NFormItem>
        <NFormItem label="Image URL">
          <NInput v-model:value="newBusiness.image" placeholder="e.g., https://example.com/image.jpg" />
        </NFormItem>
        <NFormItem label="Description">
          <NInput 
            v-model:value="newBusiness.description" 
            type="textarea"
            placeholder="Brief description of the business"
            :rows="3"
          />
        </NFormItem>
      </div>

      <!-- Contact Information -->
      <div class="mb-6">
        <h3 class="mb-3 text-lg font-semibold">Contact Information</h3>
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <NFormItem label="Phone">
            <NInput v-model:value="newBusiness.contact!.phone" placeholder="(555) 123-4567" />
          </NFormItem>
          <NFormItem label="Email">
            <NInput v-model:value="newBusiness.contact!.email" placeholder="info@business.com" />
          </NFormItem>
          <NFormItem label="Website">
            <NInput v-model:value="newBusiness.contact!.website" placeholder="https://website.com" />
          </NFormItem>
          <NFormItem label="Address">
            <NInput v-model:value="newBusiness.contact!.address" placeholder="123 Main St" />
          </NFormItem>
          <NFormItem label="City">
            <NInput v-model:value="newBusiness.contact!.city" placeholder="New York" />
          </NFormItem>
          <NFormItem label="State">
            <NInput v-model:value="newBusiness.contact!.state" placeholder="NY" />
          </NFormItem>
          <NFormItem label="Zip Code">
            <NInput v-model:value="newBusiness.contact!.zipCode" placeholder="10001" />
          </NFormItem>
          <NFormItem label="Country">
            <NInput v-model:value="newBusiness.contact!.country" placeholder="USA" />
          </NFormItem>
        </div>
      </div>

      <!-- Categorization -->
      <div class="mb-6">
        <h3 class="mb-3 text-lg font-semibold">Categorization</h3>
        <NFormItem label="Categories" path="categoryIds">
          <NSelect
            v-model:value="newBusiness.categoryIds"
            :options="categoryOptions"
            multiple
            placeholder="Select categories"
          />
        </NFormItem>
        <NFormItem label="Locations">
          <NSelect
            v-model:value="newBusiness.locationIds"
            :options="locationOptions"
            multiple
            placeholder="Select locations"
          />
        </NFormItem>
      </div>

      <!-- Business Details -->
      <div class="mb-6">
        <h3 class="mb-3 text-lg font-semibold">Business Details</h3>
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <NFormItem label="Price Range">
            <NSelect
              v-model:value="newBusiness.priceRange"
              :options="priceRangeOptions"
              placeholder="Select price range"
            />
          </NFormItem>
          <NFormItem label="Rating">
            <NRate v-model:value="newBusiness.rating" :allow-half="true" />
          </NFormItem>
        </div>
        <NFormItem label="Business Slug">
          <NInput v-model:value="businessSlug" placeholder="business-name" />
          <template #suffix>
            <span class="text-xs text-gray-500">.html</span>
          </template>
        </NFormItem>
        <NFormItem label="Full Directory URL">
          <NInput 
            :value="fullDirectoryURL" 
            readonly 
            placeholder="Set agency root domain in Agency Settings"
          />
          <template #feedback v-if="!agencySettings.agencyRootDomain">
            <span class="text-orange-500">⚠️ Set agency root domain in Agency Settings to generate URLs</span>
          </template>
        </NFormItem>
      </div>

      <!-- Badges -->
      <div class="mb-6">
        <h3 class="mb-3 text-lg font-semibold">Badges</h3>
        <div class="flex gap-4">
          <NCheckbox v-model:checked="newBusiness.featured">
            Featured Business
          </NCheckbox>
          <NCheckbox v-model:checked="newBusiness.popular">
            Popular Business
          </NCheckbox>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end mt-6">
        <NButton @click="resetForm" type="default" class="mr-2">
          Cancel
        </NButton>
        <NButton @click="saveBusiness" type="primary" htmlType="submit">
          {{ props.business ? "Update Business" : "Add Business" }}
        </NButton>
      </div>
    </NForm>
  </div>
</template>

<style scoped></style>