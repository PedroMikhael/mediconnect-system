import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const STORAGE_TOKEN = {
  ACCESS_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refresh_token',
}

export const client = (() => {
  return axios.create({
    baseURL: `http://localhost:8080/`,
    headers: {
      Accept: 'application/json, text/plain, */*',
    },
  })
})()

client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem(STORAGE_TOKEN.ACCESS_TOKEN)
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)
