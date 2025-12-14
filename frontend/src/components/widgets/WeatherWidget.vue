<template>
  <div :class="['widget p-4 rounded-lg shadow', themeClasses]">
    <div v-if="loading" class="text-sm text-gray-500">Laden...</div>
    <div v-else-if="error" class="text-sm text-red-500">Fout: {{ error }}</div>
    <div v-else-if="data" class="flex items-center gap-4">
      <img :src="iconUrl" alt="weather icon" class="w-16 h-16" />
      <div>
        <div class="text-lg font-semibold">{{ data?.city }}, {{ data?.country }}</div>
        <div class="text-3xl font-bold">{{ data?.temp }}°C</div>
        <div class="text-sm text-gray-600 dark:text-gray-300">{{ data?.description }}</div>
        <div class="text-sm text-gray-500 dark:text-gray-400">Luchtvochtigheid: {{ data?.humidity }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { WeatherService } from '../../services/weather.service'
import type { WeatherData } from '../../services/weather.service'

const city = ref('Sint-Niklaas')

const data = ref<WeatherData | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const iconUrl = computed(() => {
  return data.value ? `https://openweathermap.org/img/wn/${data.value.icon}@2x.png` : ''
})

// Theme classes depend on weather description and day/night (icon ends with 'd' or 'n')
const themeClasses = computed(() => {
  const icon = data.value?.icon ?? ''
  const desc = (data.value?.description ?? '').toLowerCase()
  const isNight = icon.endsWith('n')

  if (isNight) {
    return 'bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white'
  }

  if (desc.includes('clear')) {
    return 'bg-gradient-to-r from-sky-200 to-blue-100 text-gray-800'
  }

  if (desc.includes('cloud') || desc.includes('overcast')) {
    return 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800'
  }

  if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('shower')) {
    return 'bg-gradient-to-r from-blue-200 to-slate-300 text-gray-800'
  }

  if (desc.includes('snow')) {
    return 'bg-gradient-to-r from-blue-100 to-white text-gray-800'
  }

  if (desc.includes('mist') || desc.includes('fog') || desc.includes('haze')) {
    return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800'
  }

  return 'bg-white/80 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200'
})

async function load() {
  loading.value = true
  error.value = null
  try {
    const res = await WeatherService.getWeather(city.value)
    data.value = res
  } catch (err: any) {
    error.value = err?.response?.data?.message ?? err?.message ?? 'Onbekende fout'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  load()
})
</script>

<style scoped>
.widget img { image-rendering: crisp-edges; }
</style>
