import axios from 'axios'

const api = axios.create({
  timeout: 10000
})

api.interceptors.request.use((config) => {
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded'

  return config
}, (error) => {
  return Promise.reject(error)
})

api.interceptors.response.use((response) => {
  return response.data
}, (error) => {
  return Promise.reject(error)
})

export default api