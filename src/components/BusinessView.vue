<script setup lang="ts">
import { Add, CreateOutline, Trash } from "@vicons/ionicons5";
import { NButton, NCard, NIcon } from "naive-ui";
import { ref } from "vue";
import { usePostmate } from "../composition/usePostmate";
import useStore from "../store";
import { BusinessInterface } from "../types";
import AddEditBusiness from "./AddEditBusiness.vue";

const { businesses } = useStore();
const selectedBusiness = ref<BusinessInterface>();
const { emitCode } = usePostmate();
const showAddEditBusiness = ref(false);

const addBusiness = () => {
  selectedBusiness.value = undefined;
  showAddEditBusiness.value = true;
};

const showOverview = () => {
  showAddEditBusiness.value = false;
};

const editBusiness = (business: BusinessInterface) => {
  selectedBusiness.value = business;
  showAddEditBusiness.value = true;
};

const deleteBusiness = (business: BusinessInterface) => {
  const index = businesses.value.findIndex((item) => item.id === business.id);
  businesses.value.splice(index, 1);
  emitCode();
};

const onSave = (payload: BusinessInterface) => {
  if (selectedBusiness.value) {
    const index = businesses.value.findIndex(
      (business) => business.id === selectedBusiness.value?.id
    );
    businesses.value[index] = payload;
  } else {
    businesses.value.push(payload);
  }
  showOverview();

  emitCode();
};
</script>

<template>
  <AddEditBusiness
    v-if="showAddEditBusiness"
    :business="selectedBusiness"
    @success="onSave"
    @close="showOverview"
  />
  <div v-else class="p-8">
    <div class="text-2xl font-bold">Businesses</div>
    <div class="flex justify-end my-5">
      <NButton @click="addBusiness" type="info">
        <template #icon>
          <NIcon><Add /></NIcon>
        </template>
        Add Business
      </NButton>
    </div>
    <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
      <NCard
        v-for="item in businesses"
        :key="item.id"
        :title="item.name"
        class="w-full"
      >
        <template #header-extra>
          <NButton @click="editBusiness(item)" :bordered="false">
            <template #icon>
              <NIcon><CreateOutline /></NIcon>
            </template>
          </NButton>

          <NButton
            @click="deleteBusiness(item)"
            :bordered="false"
          >
            <template #icon>
              <NIcon><Trash /></NIcon>
            </template>
          </NButton>
        </template>
        <p v-if="item.tagline" class="text-gray-600">{{ item.tagline }}</p>
        <div class="flex gap-2 mt-2">
          <span v-if="item.featured" class="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded">
            Featured
          </span>
          <span v-if="item.popular" class="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
            Popular
          </span>
        </div>
        <p v-if="item.rating" class="mt-2 text-sm">
          Rating: {{ item.rating }}/5 ⭐
        </p>
        <p v-if="item.priceRange" class="text-sm text-gray-500">
          Price: {{ item.priceRange }}
        </p>
      </NCard>
    </div>
  </div>
</template>

<style scoped></style>
