const APP_SECRET = '59c5b49a58c74340b28ecc68004e815a'

/**
 * Generates a sign for the given `requestBody`.
 *
 * @param {Object} requestBody - The request body object.
 * @param filter 需要过滤的非必签名字段
 * @returns {Promise<string>} A Promise that resolves with the generated sign.
 */
export const generateSign = async (requestBody: {
  [key: string]: string | object
}, filter: string[]): Promise<string | null> => {
  // 将requestBody字段升序排序
  const sortedRequestBody = sortFields(requestBody)

  // 每次提交前清空sign
  sortedRequestBody.sign = ''

  // 拼接参数值
  const tmp = concatObjectValues(sortedRequestBody, filter)

  // 获取签名
  return hash(tmp, APP_SECRET).then((sign) => {
    return sign
  })
}

export const sortFields = (obj: any) => {
  const result: { [key: string]: string | object } = {}
  const keys = Object.keys(obj).sort()
  for (const key of keys) {
    result[key] = obj[key]
  }
  return result
}

/**
 * Concatenates values of an object into a single string.
 *
 * @param {Object} obj - The object whose values to concatenate.
 * @param filter
 * @return {string} - The concatenated string of object values.
 */
export function concatObjectValues(obj: { [key: string]: any }, filter: string[]): string {
  let result = ''
  for (const key in obj) {
    // skip this key and move to next iteration
    if (filter.includes(key)) {
      continue
    }
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // If the value is an object, concatenate its stringified values
      result += JSON.stringify(obj[key])
    } else if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== null) {
      // If the value is not an object, directly concatenate it
      result += obj[key]
    }
  }
  return result
}

/**
 * Hashes the provided message using the SHA-256 algorithm.
 *
 * @param {string} message - The message to be hashed.
 * @param {string} [secret] - An optional string used for additional confusion. If not provided,
 * Abel's private key will be used as the default value.
 * @returns {Promise<string>} The hashed message as a hexadecimal string.
 */
export const hash = async (message: any, secret: string): Promise<string | null> => {
  const byte2Hex = (bytes: any) => {
    let hexString = ''

    for (const value of bytes) {
      let hexValue = (value & 0xFF).toString(16)

      if (hexValue.length === 1) {
        hexValue = '0' + hexValue
      }

      hexString += hexValue
    }

    return hexString
  }

  let encryptedMessage = null
  const algorithm = 'SHA-256'

  // Default value is Abel's private key
  secret = secret.trim() !== ''
    ? secret
    : APP_SECRET

  try {
    // Convert the message and confusion to ArrayBuffer
    const encoder = new TextEncoder()
    const messageBuffer = encoder.encode(message + secret)

    // Hash the concatenated buffer
    const hashBuffer = await crypto.subtle.digest(algorithm, messageBuffer)

    // Convert the hash to a hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    encryptedMessage = byte2Hex(hashArray)

  } catch (error: any) {
    console.error(`Error while hashing message: ${error.message}`)
  }

  return encryptedMessage
}
