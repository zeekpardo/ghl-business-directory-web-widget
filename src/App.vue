<script setup lang="ts">
import { NConfigProvider, NDialogProvider, NMessageProvider } from "naive-ui";
import { onMounted } from "vue";
import Setting from "./components/Setting.vue";
import { usePostmate } from "./composition/usePostmate";
import useStore from "./store";
import { theme } from "./utils/theme";

const { handshake, emitCode } = usePostmate();
const store = useStore();

onMounted(() => {
  handshake?.then(async (parent: any) => {
    console.log("model", parent.model?.elementStore);
    if (parent.model.elementStore) {
      const elementStore = parent.model.elementStore;
      
      // Load business directory data
      if (elementStore.businesses) {
        store.businesses.value = elementStore.businesses;
      }
      if (elementStore.categories) {
        store.categories.value = elementStore.categories;
      }
      if (elementStore.locations) {
        store.locations.value = elementStore.locations;
      }
      if (elementStore.displayOptions) {
        store.displayOptions.value = elementStore.displayOptions;
      }
      if (elementStore.layoutSettings) {
        store.layoutSettings.value = elementStore.layoutSettings;
      }
      if (elementStore.cardStyles) {
        store.cardStyles.value = elementStore.cardStyles;
      }
      if (elementStore.agencySettings) {
        store.agencySettings.value = elementStore.agencySettings;
      }
      
      // Legacy support for old data
      if (elementStore.defaultStyles && !elementStore.cardStyles) {
        store.cardStyles.value = elementStore.defaultStyles;
      }
    } else {
      emitCode();
    }
  });
});
</script>

<template>
  <NConfigProvider :theme="theme" class="h-screen">
    <NDialogProvider>
      <NMessageProvider>
        <Setting />
      </NMessageProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>

<style scoped></style>
