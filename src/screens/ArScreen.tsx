import { useEffect } from 'react'
import { ArSession } from '../components/ArSession'
import { ArFallback } from '../components/ArFallback'
import { useWebXRSupport } from '../hooks/useWebXRSupport'
import type { CatalogItem } from '../types'

type Props = {
  item: CatalogItem
  onExit: () => void
}

function isMobileUA() {
  if (typeof navigator === 'undefined') return false
  return /android|iphone|ipad|ipod/i.test(navigator.userAgent)
}

export function ArScreen({ item, onExit }: Props) {
  const support = useWebXRSupport()

  useEffect(() => {
    document.body.classList.add('ar-active')
    return () => {
      document.body.classList.remove('ar-active')
    }
  }, [])

  if (support === 'checking') {
    return (
      <div className="ar-screen">
        <button type="button" className="ar-back-button" onClick={onExit} aria-label="Back to catalog">
          <span aria-hidden="true">×</span>
        </button>
        <div className="ar-banner ar-banner--info">Checking AR support…</div>
      </div>
    )
  }

  return (
    <div className="ar-screen">
      {support === 'supported' ? (
        <ArSession item={item} onExit={onExit} />
      ) : (
        <ArFallback item={item} onExit={onExit} reason={isMobileUA() ? 'unsupported' : 'desktop'} />
      )}
    </div>
  )
}
