const BASE_URL = process.env.VUE_APP_API_BASE || 'https://salon-api-production.up.railway.app/api'

export async function requestSnapPayment({ amount, email, description, order_id }) {
  const payload = {
    amount,
    email,
    description,
    order_id
  }

  const response = await fetch(`${BASE_URL}/payments/snap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  const data = await response.json()
  if (!response.ok) {
    const message = data?.message || `Midtrans error ${response.status}`
    const err = new Error(message)
    err.body = data
    throw err
  }
  return data
}
