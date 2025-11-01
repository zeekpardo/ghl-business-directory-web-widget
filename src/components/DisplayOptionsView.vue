<script setup lang="ts">
import { NCard, NDivider, NSwitch, NSpace, NText, NAlert } from "naive-ui";
import useStore from "../store";
import { useSettingsStore } from "../store/settings";

const store = useStore();
const { updateDisplayOptions } = useSettingsStore();

const handleToggle = (key: keyof typeof store.displayOptions.value, value: boolean) => {
  updateDisplayOptions({ [key]: value });
};
</script>

<template>
  <div class="p-8 max-w-4xl">
    <div class="text-2xl font-bold mb-6">Display Options</div>
    <p class="text-gray-600 mb-8">
      Control the visibility of various content elements on business cards. Note: Company name is always visible and cannot be disabled.
    </p>

    <NCard title="Content Visibility Settings" class="mb-6">
      <NSpace vertical size="large">
        <!-- Company Name Alert -->
        <NAlert type="info" class="mb-4">
          <template #header>Company Name</template>
          The business name/company name is always displayed and cannot be disabled as it's the primary identifier for each business listing.
        </NAlert>

        <!-- Primary Content Section -->
        <div>
          <NText strong class="text-lg">Primary Content</NText>
          <NDivider class="!my-4" />
          <NSpace vertical size="medium">
            <div class="flex justify-between items-center">
              <div>
                <NText>Display business images</NText>
                <div class="text-sm text-gray-500">Show business images on cards</div>
              </div>
              <NSwitch 
                :value="store.displayOptions.value.showImage" 
                @update:value="(value) => handleToggle('showImage', value)"
              />
            </div>

            <div class="flex justify-between items-center">
              <div>
                <NText>Display business taglines</NText>
                <div class="text-sm text-gray-500">Show business taglines below the name</div>
              </div>
              <NSwitch 
                :value="store.displayOptions.value.showTagline" 
                @update:value="(value) => handleToggle('showTagline', value)"
              />
            </div>

            <div class="flex justify-between items-center">
              <div>
                <NText>Display business descriptions</NText>
                <div class="text-sm text-gray-500">Show full business descriptions</div>
              </div>
              <NSwitch 
                :value="store.displayOptions.value.showDescription" 
                @update:value="(value) => handleToggle('showDescription', value)"
              />
            </div>

            <div class="flex justify-between items-center">
              <div>
                <NText>Display business categories</NText>
                <div class="text-sm text-gray-500">Show category tags for each business</div>
              </div>
              <NSwitch 
                :value="store.displayOptions.value.showCategories" 
                @update:value="(value) => handleToggle('showCategories', value)"
              />
            </div>

            <div class="flex justify-between items-center">
              <div>
                <NText>Display location tags</NText>
                <div class="text-sm text-gray-500">Show location badges for each business</div>
              </div>
              <NSwitch 
                :value="store.displayOptions.value.showLocation" 
                @update:value="(value) => handleToggle('showLocation', value)"
              />
            </div>

            <div class="flex justify-between items-center">
              <div>
                <NText>Display business ratings</NText>
                <div class="text-sm text-gray-500">Show star ratings for businesses</div>
              </div>
              <NSwitch 
                :value="store.displayOptions.value.showRating" 
                @update:value="(value) => handleToggle('showRating', value)"
              />
            </div>

            <div class="flex justify-between items-center">
              <div>
                <NText>Display price ranges</NText>
                <div class="text-sm text-gray-500">Show price range indicators ($, $$, $$$, $$$$)</div>
              </div>
              <NSwitch 
                :value="store.displayOptions.value.showPriceRange" 
                @update:value="(value) => handleToggle('showPriceRange', value)"
              />
            </div>

            <div class="flex justify-between items-center">
              <div>
                <NText>Display badges</NText>
                <div class="text-sm text-gray-500">Show Featured/Popular badges</div>
              </div>
              <NSwitch 
                :value="store.displayOptions.value.showBadges" 
                @update:value="(value) => handleToggle('showBadges', value)"
              />
            </div>
          </NSpace>
        </div>

        <!-- Contact Information Section -->
        <div>
          <NText strong class="text-lg">Contact Information</NText>
          <NDivider class="!my-4" />
          <NSpace vertical size="medium">
            <div class="flex justify-between items-center">
              <div>
                <NText>Display phone numbers</NText>
                <div class="text-sm text-gray-500">Show business phone numbers</div>
              </div>
              <NSwitch 
                :value="store.displayOptions.value.showPhone" 
                @update:value="(value) => handleToggle('showPhone', value)"
              />
            </div>

            <div class="flex justify-between items-center">
              <div>
                <NText>Display email addresses</NText>
                <div class="text-sm text-gray-500">Show business email addresses</div>
              </div>
              <NSwitch 
                :value="store.displayOptions.value.showEmail" 
                @update:value="(value) => handleToggle('showEmail', value)"
              />
            </div>

            <div class="flex justify-between items-center">
              <div>
                <NText>Display website links</NText>
                <div class="text-sm text-gray-500">Show business website links</div>
              </div>
              <NSwitch 
                :value="store.displayOptions.value.showWebsite" 
                @update:value="(value) => handleToggle('showWebsite', value)"
              />
            </div>

            <div class="flex justify-between items-center">
              <div>
                <NText>Display physical addresses</NText>
                <div class="text-sm text-gray-500">Show business addresses</div>
              </div>
              <NSwitch 
                :value="store.displayOptions.value.showAddress" 
                @update:value="(value) => handleToggle('showAddress', value)"
              />
            </div>
          </NSpace>
        </div>

        <!-- Agency Information Section -->
        <div>
          <NText strong class="text-lg">Agency Information</NText>
          <NDivider class="!my-4" />
          <NSpace vertical size="medium">
            <div class="flex justify-between items-center">
              <div>
                <NText>Display agency attribution</NText>
                <div class="text-sm text-gray-500">Show agency name and link at bottom of cards</div>
              </div>
              <NSwitch 
                :value="store.displayOptions.value.showAgencyAttribution" 
                @update:value="(value) => handleToggle('showAgencyAttribution', value)"
              />
            </div>
          </NSpace>
        </div>
      </NSpace>
    </NCard>
  </div>
</template>

<style scoped>
.flex {
  display: flex;
}
.justify-between {
  justify-content: space-between;
}
.items-center {
  align-items: center;
}
</style>