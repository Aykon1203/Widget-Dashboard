<template>
  <div :class="rootClasses" class="min-h-screen">
    <Navbar />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import { useDashboardStore } from '@/stores/dashboard'

const store = useDashboardStore()

const rootClasses = computed(() => {
  return store.darkMode
    ? 'bg-gray-900 text-white'
    : 'bg-gray-100 text-gray-900'
})
</script>