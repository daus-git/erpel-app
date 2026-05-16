const BASE_URL = process.env.VUE_APP_API_BASE || '/api'
const DEBUG = process.env.NODE_ENV === 'development'

export async function requestSnapPayment({ order_id, amount, token }) {
  const payload = {
    order_id,
    amount // Deposit amount, not total
  }

  const headers = { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (DEBUG) {
    console.log(`[Midtrans] POST ${BASE_URL}/payments/snap`, { headers, payload })
  }

  const url = `${BASE_URL}/payments/snap`
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  })
  
  if (DEBUG) {
    console.log(`[Midtrans] Response ${response.status} ${response.statusText}`, {
      contentType: response.headers.get('content-type'),
      url: response.url
    })
  }
  
  const contentType = response.headers.get('content-type') || ''
  
  // Check if response is HTML (redirect/error page)
  if (contentType.includes('text/html')) {
    const htmlText = await response.text()
    if (DEBUG) {
      console.error(`[Midtrans] HTML response received:`, htmlText.substring(0, 500))
    }
    const err = new Error(`Server returned HTML instead of JSON. Check if /api/payments/snap endpoint exists on server.`)
    err.status = response.status
    err.body = htmlText
    throw err
  }
  
  const data = await response.json()
  if (!response.ok) {
    if (DEBUG) {
      console.error(`[Midtrans] Error response:`, data)
    }
    const message = data?.message || `Midtrans error ${response.status}`
    const err = new Error(message)
    err.status = response.status
    err.body = data
    throw err
  }
  if (DEBUG) {
    console.log(`[Midtrans] Success response:`, data)
  }
  return data
}
