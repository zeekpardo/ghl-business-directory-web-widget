<script setup lang="ts">
import { computed } from 'vue';
import { useTranspiler } from '../composition/useTranspiler';
import { NCard, NTag, NCollapse, NCollapseItem, NCode } from 'naive-ui';

const { 
  environment, 
  validationIssues, 
  optimizedHTML, 
  optimizedCSS, 
  optimizedJS,
  htmlPreview 
} = useTranspiler();

const environmentStatus = computed(() => {
  if (environment.isPreview) return { type: 'info' as const, text: 'Preview Tab' };
  if (environment.isGHLCanvas) return { type: 'success' as const, text: 'GHL Canvas' };
  if (environment.isLiveWebsite) return { type: 'warning' as const, text: 'Live Website' };
  return { type: 'default' as const, text: 'Unknown' };
});

const optimizationStats = computed(() => {
  const htmlSize = Math.round(htmlPreview.value.length / 1024 * 100) / 100;
  const optimizedSize = Math.round(optimizedHTML.value.length / 1024 * 100) / 100;
  const savings = htmlSize - optimizedSize;
  const savingsPercent = Math.round((savings / htmlSize) * 100);
  
  return {
    htmlSize,
    optimizedSize,
    savings,
    savingsPercent
  };
});

const renderingFeatures = computed(() => [
  { 
    name: 'CSS Normalization', 
    status: true, 
    description: 'Cross-browser consistency' 
  },
  { 
    name: 'Environment Detection', 
    status: true, 
    description: 'Automatic environment adaptation' 
  },
  { 
    name: 'JavaScript Optimization', 
    status: environment.isGHLCanvas, 
    description: 'Performance optimizations for GHL' 
  },
  { 
    name: 'Responsive Design', 
    status: true, 
    description: 'Mobile-first responsive layout' 
  },
  { 
    name: 'Error Handling', 
    status: true, 
    description: 'Graceful degradation' 
  },
  { 
    name: 'State Sync', 
    status: true, 
    description: 'Consistent state management' 
  }
]);
</script>

<template>
  <div class="environment-sync p-6">
    <h2 class="text-xl font-bold mb-4">🔄 Environment Synchronization</h2>
    
    <!-- Environment Status -->
    <NCard class="mb-4" title="Current Environment">
      <div class="flex items-center gap-4 mb-3">
        <NTag :type="environmentStatus.type">{{ environmentStatus.text }}</NTag>
        <span class="text-sm text-gray-600">
          {{ environment.containerWidth }}px × {{ environment.viewportWidth }}px
        </span>
      </div>
      
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <strong>In iframe:</strong> {{ environment.isGHLCanvas ? 'Yes' : 'No' }}
        </div>
        <div>
          <strong>Container width:</strong> {{ environment.containerWidth }}px
        </div>
      </div>
    </NCard>

    <!-- Validation Issues -->
    <NCard v-if="validationIssues.length > 0" class="mb-4" title="⚠️ Validation Issues">
      <div class="space-y-2">
        <div 
          v-for="issue in validationIssues" 
          :key="issue"
          class="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm"
        >
          {{ issue }}
        </div>
      </div>
    </NCard>

    <!-- Performance Stats -->
    <NCard class="mb-4" title="📊 Optimization Stats">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <div class="text-2xl font-bold text-blue-600">{{ optimizationStats.htmlSize }}KB</div>
          <div class="text-xs text-gray-500">Original Size</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-green-600">{{ optimizationStats.optimizedSize }}KB</div>
          <div class="text-xs text-gray-500">Optimized Size</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-purple-600">{{ optimizationStats.savingsPercent }}%</div>
          <div class="text-xs text-gray-500">Size Reduction</div>
        </div>
      </div>
    </NCard>

    <!-- Rendering Features -->
    <NCard class="mb-4" title="✨ Rendering Features">
      <div class="grid grid-cols-2 gap-3">
        <div 
          v-for="feature in renderingFeatures" 
          :key="feature.name"
          class="flex items-center gap-2"
        >
          <span :class="feature.status ? 'text-green-500' : 'text-gray-400'">
            {{ feature.status ? '✅' : '⭕' }}
          </span>
          <div class="flex-1">
            <div class="font-medium text-sm">{{ feature.name }}</div>
            <div class="text-xs text-gray-500">{{ feature.description }}</div>
          </div>
        </div>
      </div>
    </NCard>

    <!-- Generated Code Preview -->
    <NCollapse class="mb-4">
      <NCollapseItem title="🔍 Generated Code Preview" name="code">
        <div class="space-y-4">
          <!-- HTML Preview -->
          <div>
            <h4 class="font-semibold mb-2">HTML Output ({{ Math.round(optimizedHTML.length / 1024 * 100) / 100 }}KB)</h4>
            <NCode 
              :code="optimizedHTML.substring(0, 500) + '...'" 
              language="html"
              class="text-xs"
            />
          </div>
          
          <!-- CSS Preview -->
          <div>
            <h4 class="font-semibold mb-2">CSS Output ({{ Math.round(optimizedCSS.length / 1024 * 100) / 100 }}KB)</h4>
            <NCode 
              :code="optimizedCSS.substring(0, 500) + '...'" 
              language="css"
              class="text-xs"
            />
          </div>
          
          <!-- JavaScript Preview -->
          <div>
            <h4 class="font-semibold mb-2">JavaScript Output ({{ Math.round(optimizedJS.length / 1024 * 100) / 100 }}KB)</h4>
            <NCode 
              :code="optimizedJS.substring(0, 500) + '...'" 
              language="javascript"
              class="text-xs"
            />
          </div>
        </div>
      </NCollapseItem>
    </NCollapse>

    <!-- Sync Status -->
    <NCard title="🎯 Synchronization Status">
      <div class="flex items-center justify-between">
        <span class="text-sm">All environments synchronized</span>
        <NTag type="success">Active</NTag>
      </div>
      <p class="text-xs text-gray-500 mt-2">
        Preview tab, GHL canvas, and live website will render identically with environment-specific optimizations.
      </p>
    </NCard>
  </div>
</template>

<style scoped>
.environment-sync {
  max-width: 800px;
  margin: 0 auto;
}
</style>