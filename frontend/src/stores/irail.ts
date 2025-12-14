// frontend/src/stores/irail.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { IrailService } from '@/services/irail.service'
import type { IrailDeparture } from '@/services/irail.service'
export const useIrailStore = defineStore('irail', () => {
  const station = ref('Sint-Niklaas')
  const departures = ref<IrailDeparture[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastFetched = ref<number | null>(null)

  async function fetchDepartures(force = false) {
    if (!station.value) return
    // cache 30s
    const now = Date.now()
    if (!force && lastFetched.value && now - lastFetched.value < 30_000) return
    loading.value = true
    error.value = null
    try {
      const res = await IrailService.getLiveBoard(station.value)
      departures.value = res
      lastFetched.value = Date.now()
    } catch (err: any) {
      error.value = err?.message ?? 'Fout bij ophalen'
    } finally {
      loading.value = false
    }
  }

  // Polling helper
  let pollHandle: number | null = null
  function startPolling(intervalMs = 60000) {
    stopPolling()
    pollHandle = window.setInterval(() => fetchDepartures(true), intervalMs)
  }
  function stopPolling() {
    if (pollHandle !== null) {
      clearInterval(pollHandle)
      pollHandle = null
    }
  }

  return {
    station,
    departures,
    loading,
    error,
    fetchDepartures,
    startPolling,
    stopPolling,
  }
})