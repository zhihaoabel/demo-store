import axios from 'axios'

const request = axios.create({
  // baseURL: '/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

request.interceptors.request.use((config) => {

  return config
}, (error) => {
  return Promise.reject(error)
})

request.interceptors.response.use((response) => {
  return response.data
}, (error) => {
  return Promise.reject(error)
})

export default request