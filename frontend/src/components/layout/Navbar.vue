<!-- components/layout/Navbar.vue -->
<template>
  <nav 
    :class="store.darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'" 
    class="shadow-md transition-colors duration-200">
    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 gap-4">
        
        <!-- Left: Logo (fixed width) -->
        <div class="flex items-center space-x-2 flex-shrink-0">
          <div 
            :class="store.darkMode ? 'bg-blue-500' : 'bg-blue-600'" 
            class="w-8 h-8 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-lg">D</span>
          </div>
          <h1 class="text-xl font-bold whitespace-nowrap">My Dashboard</h1>
        </div>


        <!-- Right: Actions (fixed width) -->
        <div class="flex items-center space-x-2 flex-shrink-0">

          <!-- Dark Mode Toggle -->
          <button
            @click="store.toggleDarkMode"
            :class="[
              'p-2 rounded-lg transition-colors',
              store.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            ]"
            :title="store.darkMode ? 'Switch to light mode' : 'Switch to dark mode'">
            <span v-if="store.darkMode">☀️</span>
            <span v-else>🌙</span>
          </button>
        </div>
      </div>

      <!-- Mobile Search (expanded) -->
      <div v-if="searchOpen" class="md:hidden pb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search widgets..."
          :class="[
            'w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500',
            store.darkMode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500'
          ]"
        >
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'

const store = useDashboardStore()

const searchQuery = ref('')
const searchOpen = ref(false)
const showAddWidget = ref(false)
const showSettings = ref(false)
</script>