<script setup lang="ts">
import {
  BrowsersOutline,
  ColorPaletteOutline,
  BusinessOutline,
  LocationOutline,
  PricetagsOutline,
  SettingsOutline,
  OptionsOutline,
  GridOutline,
} from "@vicons/ionicons5";
import { NIcon, NLayout, NLayoutSider, NMenu } from "naive-ui";
import { h, ref } from "vue";
import useStore from "../store";
import { defineAsyncComponent } from "vue";

// Lazy load heavy components for better performance
const BusinessView = defineAsyncComponent(() => import("./BusinessView.vue"));
const CategoryManager = defineAsyncComponent(() => import("./CategoryManagerNew.vue"));
const LocationManager = defineAsyncComponent(() => import("./LocationManagerSimplified.vue"));
const AgencySettingsView = defineAsyncComponent(() => import("./AgencySettingsView.vue"));
const Preview = defineAsyncComponent(() => import("./Preview.vue"));
const StyleView = defineAsyncComponent(() => import("./StyleView.vue"));
const EnvironmentSync = defineAsyncComponent(() => import("./EnvironmentSync.vue"));

const { businesses } = useStore();
const selectedMenu = ref("businesses");

const menuOptions = [
  {
    label: "Businesses",
    key: "businesses",
  },
  {
    label: "Categories",
    key: "categories",
  },
  {
    label: "Locations",
    key: "locations",
  },
  {
    label: "Layout",
    key: "layout",
  },
  {
    label: "Display Options",
    key: "display-options",
  },
  {
    label: "Card Styling",
    key: "card-styling",
  },
  {
    label: "Agency Settings",
    key: "agency-settings",
  },
  {
    label: "Preview",
    key: "preview",
  },
  {
    label: "Environment Sync",
    key: "environment-sync",
  },
];

const renderIcon = (option: any) => {
  switch (option.key) {
    case "businesses":
      return h(NIcon, null, { default: () => h(BusinessOutline) });
    case "categories":
      return h(NIcon, null, { default: () => h(PricetagsOutline) });
    case "locations":
      return h(NIcon, null, { default: () => h(LocationOutline) });
    case "layout":
      return h(NIcon, null, { default: () => h(GridOutline) });
    case "display-options":
      return h(NIcon, null, { default: () => h(OptionsOutline) });
    case "card-styling":
      return h(NIcon, null, { default: () => h(ColorPaletteOutline) });
    case "agency-settings":
      return h(NIcon, null, { default: () => h(SettingsOutline) });
    case "preview":
      return h(NIcon, null, { default: () => h(BrowsersOutline) });
    case "environment-sync":
      return h(NIcon, null, { default: () => h(OptionsOutline) });
    default:
      return h(NIcon, null, { default: () => h(ColorPaletteOutline) });
  }
};
</script>

<template>
  <div class="size-full">
    <n-layout class="h-full" has-sider>
      <n-layout-sider
        collapse-mode="width"
        :collapsed-width="64"
        show-trigger
        content-class="mt-1"
        bordered
        width="190"
      >
        <n-menu
          :options="menuOptions"
          v-model:value="selectedMenu"
          :render-icon="renderIcon"
          :collapsed-width="64"
        />
      </n-layout-sider>
      <n-layout class="overflow-hidden bg-gray-100">
        <BusinessView v-if="selectedMenu === 'businesses'" v-model:businesses="businesses" />
        <CategoryManager v-else-if="selectedMenu === 'categories'" />
        <LocationManager v-else-if="selectedMenu === 'locations'" />
        <div v-else-if="selectedMenu === 'layout'" class="p-8">
          <div class="text-2xl font-bold">Layout Settings</div>
          <p class="text-gray-500">Layout settings coming soon...</p>
        </div>
        <div v-else-if="selectedMenu === 'display-options'" class="p-8">
          <div class="text-2xl font-bold">Display Options</div>
          <p class="text-gray-500">Display options coming soon...</p>
        </div>
        <StyleView v-else-if="selectedMenu === 'card-styling'" />
        <AgencySettingsView v-else-if="selectedMenu === 'agency-settings'" />
        <div v-else-if="selectedMenu === 'preview'" class="p-8">
          <div class="text-2xl font-bold">Preview</div>
          <Preview />
        </div>
        <div v-else-if="selectedMenu === 'environment-sync'" class="p-8">
          <div class="text-2xl font-bold">Environment Sync</div>
          <EnvironmentSync />
        </div>
      </n-layout>
    </n-layout>
  </div>
</template>

<style scoped></style>
