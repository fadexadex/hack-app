import { useEffect, useState } from 'react'

export type WebXRSupportState = 'checking' | 'supported' | 'unsupported'

function getInitialState(): WebXRSupportState {
  if (typeof navigator === 'undefined') return 'unsupported'
  const xr = navigator.xr
  if (!xr || typeof xr.isSessionSupported !== 'function') {
    return 'unsupported'
  }
  return 'checking'
}

export function useWebXRSupport(): WebXRSupportState {
  const [state, setState] = useState<WebXRSupportState>(getInitialState)

  useEffect(() => {
    if (state !== 'checking') return
    let cancelled = false
    const xr = navigator.xr
    if (!xr) return

    xr.isSessionSupported('immersive-ar')
      .then((supported) => {
        if (!cancelled) {
          setState(supported ? 'supported' : 'unsupported')
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState('unsupported')
        }
      })

    return () => {
      cancelled = true
    }
  }, [state])

  return state
}
