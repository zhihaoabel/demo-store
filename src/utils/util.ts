// 根据当前时间随机生成uniqueId
import api from '@/utils/api'

export function uniqueId() {
  return new Date().getTime().toString()
}

// 获取当前用户ip
export async function getClientIp() {
  try {
    return await api.get('https://api.ipify.org')
  } catch (err) {
    console.log('Error fetching IP: ', err)
  }
}

// 生成custId
export async function generateCustId() {
  const ip = await getClientIp()
  return 'custId_' + ip
}