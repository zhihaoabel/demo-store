import axios from 'axios'

const request = axios.create({
  baseURL: 'https://demo-store-one.vercel.app/api',
  timeout: 10000
})

request.interceptors.request.use((config) => {
  config.headers['Content-Type'] = 'application/json'

  return config
}, (error) => {
  return Promise.reject(error)
})

request.interceptors.response.use((response) => {
  return response.data
}, (error) => {
  return Promise.reject(error)
})

export default request;