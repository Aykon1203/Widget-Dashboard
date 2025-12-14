<template>
  <div 
    :class="{ 'bg-gray-900': store.darkMode, 'bg-gray-100': !store.darkMode }"
    class="min-h-screen pt-6 transition-colors duration-200">
      <div>
      <div class="grid items-start grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ClockWidget />
        <WeatherWidget />
        <IrailWidget />
        <MotivationWidget/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ClockWidget from '../components/widgets/ClockWidget.vue';
import WeatherWidget from '../components/widgets/WeatherWidget.vue';
import IrailWidget from '@/components/widgets/IrailWidget.vue';
import MotivationWidget from '@/components/widgets/MotivationWidget.vue';
import { useDashboardStore } from '../stores/dashboard';

const store = useDashboardStore()
</script>