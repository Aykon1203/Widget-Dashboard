<!-- frontend/src/components/widgets/IrailWidget.vue -->
<template>
  <div class="widget rounded-lg shadow bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white overflow-hidden">
    <div class="text-center mt-5 text-10 text-gray-400 ">{{ fromStation }} → {{ toStation }}</div>
    <div class="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
      <div>
      </div>
      <div class="flex items-center gap-2">
        <button @click="fetchConnections(true)" class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-sm rounded">Refresh</button>
        <button @click="togglePolling" class="px-3 py-1 border border-gray-700 text-sm rounded">{{ polling ? 'Stop' : 'Auto' }}</button>
        <button @click="swapDirection" class="px-3 py-1 border border-gray-700 text-sm rounded">Wissel</button>
      </div>
    </div>

    <div v-if="loading" class="p-4 text-sm text-gray-300">Laden…</div>
    <div v-else-if="error" class="p-4 text-sm text-red-400">Fout: {{ error }}</div>

    <ul v-else class="divide-y divide-gray-700">
      <li v-for="(d, i) in connections.slice(0,6)" :key="i" class="flex items-center px-4 py-4">
        <!-- Left: large time -->
        <div class="w-28 text-left">
          <div class="text-4xl font-extrabold leading-none">{{ formatTime(d.time) }}</div>
          <div class="text-xs text-gray-400 mt-1">{{ formatDateShort(d.time) }}</div>
        </div>

        <!-- Middle: direction + vehicle -->
        <div class="flex-1 px-4">
          <div class="text-sm text-gray-300">{{ d.vehicle ?? '' }}</div>
          <div class="text-lg font-semibold">{{ d.direction }}</div>
          <div class="text-sm text-gray-400 mt-1">Spoor: <span class="font-medium text-white">{{ d.platform ?? '-' }}</span></div>
        </div>

        <!-- Right: delay badge -->
        <div class="w-28 text-right">
          <span v-if="hasDelay(d)" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-600 text-white">
            +{{ Math.max(0, Math.round((d.delay ?? 0) / 60)) }}m
          </span>
          <span v-else class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-600 text-white">On time</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue'
import { IrailService } from '@/services/irail.service'

const fromA = 'Sint-Niklaas'
const toA = 'Gent-Sint-Pieters'

const directionForward = ref(true)
const fromStation = ref(fromA)
const toStation = ref(toA)

const connections = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const polling = ref(false)

async function fetchConnections(force = false) {
  loading.value = true
  error.value = null
  try {
    const res = await IrailService.getConnections(fromStation.value, toStation.value)
    // res.connection may be array or single; normalize
    const raw = res?.connection ? (Array.isArray(res.connection) ? res.connection : [res.connection]) : []
    // Map to our display model using departure time and departure/platform/delay
    connections.value = raw.map((conn: any) => {
      const departure = conn?.departure ?? conn?.departure[0] ?? {}
      return {
        time: Number(departure?.time ?? departure?.date ?? Date.now()),
        vehicle: departure?.vehicle ?? conn?.vehicle ?? '',
        direction: conn?.arrival?.station || toStation.value,
        delay: Number(departure?.delay ?? 0),
        platform: departure?.platform ?? departure?.station ?? '-',
      }
    })
  } catch (err: any) {
    error.value = err?.message ?? 'Fout bij ophalen'
  } finally {
    loading.value = false
  }
}

function swapDirection() {
  directionForward.value = !directionForward.value
  if (directionForward.value) {
    fromStation.value = fromA
    toStation.value = toA
  } else {
    fromStation.value = toA
    toStation.value = fromA
  }
  fetchConnections(true)
}

function togglePolling() {
  if (polling.value) {
    stopPolling()
  } else {
    startPolling()
  }
}

let pollHandle: number | null = null
function startPolling(intervalMs = 60_000) {
  stopPolling()
  pollHandle = window.setInterval(() => fetchConnections(true), intervalMs)
  polling.value = true
}
function stopPolling() {
  if (pollHandle !== null) {
    clearInterval(pollHandle)
    pollHandle = null
  }
  polling.value = false
}

onMounted(() => {
  fetchConnections()
})

onBeforeUnmount(() => {
  stopPolling()
})

function formatTime(t: number) {
  const ts = t > 1_000_000_000_000 ? Math.floor(t/1000) : t
  return new Date(ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDateShort(t: number) {
  const ts = t > 1_000_000_000_000 ? Math.floor(t/1000) : t
  const d = new Date(ts * 1000)
  return d.toLocaleDateString([], { day: '2-digit', month: 'short' })
}

function hasDelay(d: any) {
  const delay = Number(d?.delay ?? 0)
  return delay > 60
}
</script>

<style scoped>
.widget { min-width: 220px; }
</style>