import axios from 'axios';

// Basis URL van je backend
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
})

// Weather API
export interface WeatherData{
  city:string;
  country:string;
  temp:number;
  description:string;
  icon:string;
  humidity:number;
}

export const WeatherService={
  async getWeather(city:string = 'Sint-Niklaas'):Promise<WeatherData>{
    const response = await api.get<WeatherData>(`/weather?city=${city}`);
    return response.data;
  }
}
