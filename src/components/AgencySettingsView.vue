<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { 
  NCard, 
  NForm, 
  NFormItem, 
  NInput, 
  NRadioGroup, 
  NRadio, 
  NSpace,
  NAlert,
  FormInst 
} from 'naive-ui';
import { useSettingsStore } from '../store/settings';
import { commonRules } from '../utils/validation';
import { CSS_CLASSES } from '../utils/const';

// Store setup
const { 
  agencySettings, 
  updateAgencySettings, 
  generateBusinessDirectoryUrl
} = useSettingsStore();

// Form reference
const formRef = ref<FormInst | null>(null);

// Local state for logo preview
const logoPreviewError = ref(false);
const showLogoPreview = computed(() => 
  agencySettings.value.agencyLogo && 
  !logoPreviewError.value && 
  agencySettings.value.agencyLogo.trim() !== ''
);

// Validation rules
const validationRules = {
  agencyName: [{ required: false, trigger: 'blur' }],
  agencyWebsite: commonRules.agencyWebsite,
  agencyRootDomain: commonRules.agencyRootDomain,
  agencyLogo: commonRules.agencyLogo
};

// Example URL preview
const exampleSlug = 'elite-fitness-center';
const exampleUrl = computed(() => {
  if (agencySettings.value.agencyRootDomain) {
    return generateBusinessDirectoryUrl(exampleSlug);
  }
  return '';
});

// Auto-save watchers
watch(() => agencySettings.value.agencyName, (newValue) => {
  updateAgencySettings({ agencyName: newValue });
}, { immediate: false });

watch(() => agencySettings.value.agencyWebsite, (newValue) => {
  updateAgencySettings({ agencyWebsite: newValue });
}, { immediate: false });

watch(() => agencySettings.value.agencyRootDomain, (newValue) => {
  updateAgencySettings({ agencyRootDomain: newValue });
}, { immediate: false });

watch(() => agencySettings.value.agencyLogo, (newValue) => {
  logoPreviewError.value = false; // Reset error state when URL changes
  updateAgencySettings({ agencyLogo: newValue });
}, { immediate: false });

watch(() => agencySettings.value.titleLinkDestination, (newValue) => {
  updateAgencySettings({ titleLinkDestination: newValue });
}, { immediate: false });

// Logo error handler
const handleLogoError = () => {
  logoPreviewError.value = true;
};
</script>

<template>
  <div :class="CSS_CLASSES.PADDING_SECTION">
    <!-- Header -->
    <div class="mb-6">
      <h1 :class="CSS_CLASSES.TITLE_LARGE">Agency Settings</h1>
      <p :class="CSS_CLASSES.TEXT_MUTED">
        Configure agency branding, directory URLs, and navigation settings
      </p>
    </div>

    <n-form
      ref="formRef"
      :model="agencySettings"
      :rules="validationRules"
      label-placement="top"
      require-mark-placement="right-hanging"
      class="space-y-6"
    >
      <!-- Agency Information Section -->
      <n-card title="Agency Information" :bordered="true" class="mb-6">
        <n-space vertical size="large">
          <!-- Agency Name -->
          <n-form-item label="Agency Name" path="agencyName">
            <n-input
              v-model:value="agencySettings.agencyName"
              placeholder="e.g., Mira Marketing"
              clearable
            />
            <template #feedback>
              Used for attribution display on business cards
            </template>
          </n-form-item>

          <!-- Agency Website -->
          <n-form-item label="Agency Website" path="agencyWebsite">
            <n-input
              v-model:value="agencySettings.agencyWebsite"
              placeholder="e.g., https://miramarketing.com"
              clearable
            />
            <template #feedback>
              Used as link target for agency attribution
            </template>
          </n-form-item>

          <!-- Agency Logo URL -->
          <n-form-item label="Agency Logo URL" path="agencyLogo">
            <n-input
              v-model:value="agencySettings.agencyLogo"
              placeholder="e.g., https://miramarketing.com/logo.png"
              clearable
            />
            <template #feedback>
              Supported formats: PNG, JPG, JPEG, GIF, SVG, WebP
            </template>
          </n-form-item>

          <!-- Logo Preview -->
          <div v-if="showLogoPreview" class="mt-4">
            <p class="text-sm font-medium mb-2">Logo Preview:</p>
            <img 
              :src="agencySettings.agencyLogo" 
              alt="Agency Logo Preview" 
              class="w-20 h-20 object-contain border border-gray-200 rounded"
              @error="handleLogoError"
            />
          </div>
        </n-space>
      </n-card>

      <!-- Directory Settings Section -->
      <n-card title="Directory Settings" :bordered="true" class="mb-6">
        <n-space vertical size="large">
          <!-- Directory Root Domain -->
          <n-form-item label="Directory Root Domain" path="agencyRootDomain">
            <n-input
              v-model:value="agencySettings.agencyRootDomain"
              placeholder="e.g., https://directory.miramarketing.com"
              clearable
            />
            <template #feedback>
              Used to generate business directory page URLs
            </template>
          </n-form-item>

          <!-- Example URL Preview -->
          <div v-if="exampleUrl" class="mt-4">
            <p class="text-sm font-medium mb-2">Example Generated URL:</p>
            <div class="p-3 bg-gray-50 rounded border text-sm font-mono break-all">
              {{ exampleUrl }}
            </div>
            <p class="text-xs text-gray-500 mt-2">
              Business slugs are auto-generated from business names (e.g., "Elite Fitness Center" → "elite-fitness-center")
            </p>
          </div>

          <!-- Helper Information -->
          <n-alert type="info" class="mt-4">
            <template #header>How Directory URLs Work</template>
            <ol class="list-decimal list-inside space-y-1 text-sm">
              <li>Business names are converted to URL-friendly slugs</li>
              <li>Slugs are combined with your root domain</li>
              <li>Full URLs are saved to each business's buttonAction field</li>
              <li>Users can edit slugs manually in the business form</li>
            </ol>
          </n-alert>
        </n-space>
      </n-card>

      <!-- Navigation Settings Section -->
      <n-card title="Navigation Settings" :bordered="true">
        <n-space vertical size="large">
          <!-- Title Link Destination -->
          <n-form-item label="Business Title Link Destination">
            <n-radio-group 
              v-model:value="agencySettings.titleLinkDestination"
              name="titleLinkDestination"
            >
              <n-space vertical>
                <n-radio value="directory">
                  <span class="font-medium">Link to directory listing page</span>
                  <div class="text-sm text-gray-500 mt-1">
                    Uses buttonAction field (agencyRootDomain + business slug). Opens in same tab.
                  </div>
                </n-radio>
                <n-radio value="website">
                  <span class="font-medium">Link to business website</span>
                  <div class="text-sm text-gray-500 mt-1">
                    Uses business.contact.website. Opens in new tab with noopener noreferrer.
                  </div>
                </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
        </n-space>
      </n-card>
    </n-form>
  </div>
</template>

<style scoped>
.space-y-6 > * + * {
  margin-top: 1.5rem;
}
</style>