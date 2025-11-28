import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

declare global {
  interface Window {
    Pusher: typeof Pusher
  }
}

window.Pusher = Pusher

let echoInstance: Echo<'pusher'> | null = null

export function createEcho(authToken: string | null) {
  if (echoInstance) {
    return echoInstance
  }

  echoInstance = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    authEndpoint: `${import.meta.env.VITE_API_BASE}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  })
  return echoInstance
}

