// 根据当前时间随机生成uniqueId
import api from '@/utils/api'
import { CUST_ID } from '@/utils/payment-request'

export function uniqueId() {
  return new Date().getTime().toString()
}

// 获取当前用户ip
export async function getClientIp() {
  try {
    // 两秒后超时，如果超时就返回CUST_ID
    return await api.get('https://api.ipify.org', {
      timeout: 2000
    })
  } catch (err: any) {
    if (err.code === 'ECONNABORTED') {
      // 请求超时
      return CUST_ID
    }
  }
}

// 生成custId
export async function generateCustId() {
  const ip = await getClientIp()
  return 'custId_' + ip
}

// 字符串首字母大写
export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// 按照 yyyy-mm-dd 生成当前时间，如果month和day小于10则补0
export function generateCurrentDate() {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
}

// 按照 yyyy-mm-dd hh:mm:ss 生成当前时间，如果hour、minute和second小于10则补0
export function generateCurrentTime() {
  const date = new Date()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return `${generateCurrentDate()} ${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`
}