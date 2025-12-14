// src/stores/dashboard.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDashboardStore = defineStore('dashboard', () => {
  const darkMode = ref(false)
  const widgets = ref([])
  
  function toggleDarkMode() {
    darkMode.value = !darkMode.value
    // Optioneel: save to localStorage
    localStorage.setItem('darkMode', darkMode.value.toString())
  }
  
  function addWidget(widget: any) {
    widgets.value.push(widget)
  }
  
  function removeWidget(id: string) {
    widgets.value = widgets.value.filter((w: any) => w.id !== id)
  }
  
  // Load from localStorage on init
  const savedMode = localStorage.getItem('darkMode')
  if (savedMode) {
    darkMode.value = savedMode === 'true'
  }
  
  return {
    darkMode,
    widgets,
    toggleDarkMode,
    addWidget,
    removeWidget
  }
})