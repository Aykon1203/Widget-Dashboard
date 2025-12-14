<template>
  <div class="widget p-6 rounded-xl shadow-lg transition-colors duration-200 bg-white/80 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 flex flex-col gap-4">
    <div class="flex items-start justify-between">
      <h3 class="text-xs uppercase tracking-widest text-gray-500">Motivatie</h3>
      <div class="flex items-center gap-2">
        <button @click="prev" class="text-sm px-2 py-1 rounded border">‹</button>
        <button @click="next" class="text-sm px-2 py-1 rounded border">›</button>
        <button @click="toggle" class="text-sm px-2 py-1 rounded border">{{ paused ? 'Play' : 'Pause' }}</button>
      </div>
    </div>

    <div v-if="loading" class="text-sm text-gray-500">Laden…</div>
    <div v-else-if="!currentQuote" class="text-sm text-gray-500">Geen quotes gevonden.</div>

    <div v-else class="flex-1 flex flex-col justify-center">
      <p class="text-lg leading-relaxed">“{{ currentQuote.text }}”</p>
      <p v-if="currentQuote.author" class="mt-3 text-sm text-gray-600 dark:text-gray-300">— {{ currentQuote.author }}</p>
    </div>

    <div class="text-xs text-gray-400">Vernieuw elke {{ Math.round(intervalMs/1000) }}s</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import quotesDefault from '@/services/motivation-quotes';

// Props (optional): intervalMs
const props = defineProps<{ intervalMs?: number }>()
const intervalMs = props.intervalMs ?? 60_000

const quotes = ref<Array<{ text: string; author?: string }>>([])
const index = ref(0)
const loading = ref(true)
const paused = ref(false)
let timer: number | null = null

const currentQuote = computed(() => quotes.value[index.value] ?? null)

function loadQuotes() {
  loading.value = true
  try {
    quotes.value = Array.isArray(quotesDefault) ? quotesDefault : []
    if (quotes.value.length === 0) {
      // keep a minimal fallback
      quotes.value = [
        { text: 'Begin waar je bent. Gebruik wat je hebt. Doe wat je kunt.', author: 'Arthur Ashe' },
        { text: 'Grote dingen worden nooit gedaan door één persoon. Ze worden gedaan door een team.', author: 'Steve Jobs' },
        { text: 'Blijf niet hangen bij fouten — leer ervan en ga door.' }
      ]
    }
  } catch (err) {
    console.error('[MotivationWidget] loadQuotes sync error:', err)
    quotes.value = [
      { text: 'Begin waar je bent. Gebruik wat je hebt. Doe wat je kunt.', author: 'Arthur Ashe' }
    ]
  } finally {
    loading.value = false
  }
}

function startTimer() {
  stopTimer()
  if (intervalMs > 0) {
    timer = window.setInterval(() => {
      if (!paused.value && quotes.value.length > 0) {
        index.value = (index.value + 1) % quotes.value.length
      }
    }, intervalMs)
  }
}

function stopTimer() {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
}

function next() {
  if (quotes.value.length === 0) return
  index.value = (index.value + 1) % quotes.value.length
}

function prev() {
  if (quotes.value.length === 0) return
  index.value = (index.value - 1 + quotes.value.length) % quotes.value.length
}

function toggle() {
  paused.value = !paused.value
}

onMounted(() => {
  loadQuotes()
  startTimer()
})

onBeforeUnmount(() => {
  stopTimer()
})
</script>

<style scoped>
/* ensure we have a minimum visual width like other widgets */
.widget { min-width: 220px; }
</style>
