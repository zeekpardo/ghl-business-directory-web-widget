<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from "vue";
import { useTranspiler } from "../composition/useTranspiler";

const { htmlPreview, optimizedJS, environment, validationIssues } = useTranspiler();
const previewRef = ref<HTMLElement | null>(null);
const isDev = import.meta.env.DEV;

// Function to safely execute JavaScript in preview
const executeJS = () => {
  if (!previewRef.value) return;
  
  // Remove any existing scripts to avoid conflicts
  const existingScripts = previewRef.value.querySelectorAll('script');
  existingScripts.forEach(script => script.remove());
  
  // Create and append new script
  const script = document.createElement("script");
  script.text = optimizedJS.value;
  script.type = "text/javascript";
  previewRef.value.appendChild(script);
};

// Re-run JavaScript when content changes
watch([htmlPreview, optimizedJS], async () => {
  await nextTick();
  executeJS();
}, { flush: 'post' });

onMounted(() => {
  executeJS();
  
  // Log environment info in development
  if (isDev) {
    console.log('🔍 Preview Environment:', environment);
    if (validationIssues.value.length > 0) {
      console.warn('⚠️ Validation Issues:', validationIssues.value);
    }
  }
});
</script>

<template>
  <div class="preview-container">
    <!-- Development info panel -->
    <div v-if="isDev && validationIssues.length > 0" class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
      <h4 class="text-sm font-semibold text-yellow-800 mb-2">⚠️ Consistency Issues:</h4>
      <ul class="text-xs text-yellow-700 space-y-1">
        <li v-for="issue in validationIssues" :key="issue">• {{ issue }}</li>
      </ul>
    </div>
    
    <!-- Preview content - matches exactly what's generated -->
    <div 
      ref="previewRef" 
      v-html="htmlPreview" 
      class="preview-content"
      :data-environment="environment.isPreview ? 'preview' : environment.isGHLCanvas ? 'ghl-canvas' : 'live'"
    />
  </div>
</template>

<style scoped>
.preview-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.preview-content {
  /* Ensure preview matches output exactly */
  margin: 0;
  padding: 0;
  width: 100%;
  background: transparent;
}

/* Isolate preview styles from parent */
.preview-content >>> * {
  box-sizing: border-box;
}
</style>
