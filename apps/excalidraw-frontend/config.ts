export const HTTP_BACKEND = process.env.NEXT_PUBLIC_HTTP_BACKEND
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL
export const FRNT_URL = process.env.NEXT_PUBLIC_FRNT_URL

// Debug: Log the values (remove in production)
if (typeof window === 'undefined') {
  console.log('[Config] HTTP_BACKEND:', HTTP_BACKEND)
  console.log('[Config] WS_URL:', WS_URL)
  console.log('[Config] FRNT_URL:', FRNT_URL)
}