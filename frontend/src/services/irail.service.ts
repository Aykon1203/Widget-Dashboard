// frontend/src/services/irail.service.ts
import axios from 'axios'

const BASE = (import.meta.env.VITE_IRAIL_BASE_URL as string) || 'https://api.irail.be'

const api = axios.create({
  baseURL: BASE,
  timeout: 8000,
})

// Minimale types — breid uit naar wens
export type IrailDeparture = {
  time: number // unix timestamp (s) of ISO depending on endpoint — check response
  vehicle?: string
  direction?: string
  delay?: number
  platform?: string
}

export const IrailService = {
  // Liveboard / departures for a station
  async getLiveBoard(station: string): Promise<IrailDeparture[]> {
    const url = `/liveboard/?station=${encodeURIComponent(station)}&format=json&lang=nl`
    const { data } = await api.get(url)
    // Structuur hangt af van iRail response; hier voorbeeldverwerking:
    // data.departures.depth?? adjust according to actual response
    const departuresRaw = data?.departures?.departure ?? []
    return departuresRaw.map((d: any) => ({
      time: Number(d.time) || 0,
      vehicle: d.vehicle,
      direction: d.direction,
      delay: d.delay ? Number(d.delay) : 0,
      platform: d.platform,
    }))
  },

  // Connections (from -> to)
  async getConnections(from: string, to: string) {
    const url = `/connections/?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&format=json&lang=nl`
    const { data } = await api.get(url)
    return data
  }
}

export default IrailService