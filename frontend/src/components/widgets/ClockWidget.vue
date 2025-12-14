<template>
      <div :class="store.darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'"
        class="widget p-6 rounded-xl shadow-lg transition-colors duration-200 flex flex-col justify-center items-center">

    <h3 class="text-xs uppercase tracking-widest text-gray-500 mb-2">
      {{ store.darkMode ? 'Huidige Tijd' : 'Huidige Tijd' }}
    </h3>

    <div class="text-6xl font-extrabold mb-1">
      {{ formattedTime }}
    </div>

    <p class="text-sm text-gray-400">
      {{ formattedDate }}
    </p>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'

const store = useDashboardStore()

// 1. Reactive state voor de tijd
const currentTime = ref(new Date())
let timer: number | null = null

// 2. Computed properties voor weergave
// Formaat: HH:mm:ss
const formattedTime = computed(() => {
  return currentTime.value.toLocaleTimeString('nl-BE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
})

// Formaat: Vrijdag, 5 december 2025
const formattedDate = computed(() => {
  return currentTime.value.toLocaleDateString('nl-BE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

// Functie om de tijd bij te werken
const updateTime = () => {
  currentTime.value = new Date()
}

// 3. Lifecycle Hook: onMounted (start de timer)
onMounted(() => {
  // Werk de tijd elke seconde bij
  timer = setInterval(updateTime, 1000)
})

// 4. Lifecycle Hook: onUnmounted (stop de timer)
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>