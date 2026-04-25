import '@google/model-viewer'
import { useEffect, useRef, useState } from 'react'
import type { ModelViewerElement } from '@google/model-viewer'
import type { CatalogItem } from '../types'

type Props = {
  item: CatalogItem
  onExit: () => void
  reason: 'unsupported' | 'desktop'
}

export function ArFallback({ item, onExit, reason }: Props) {
  const viewerRef = useRef<ModelViewerElement | null>(null)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    const el = viewerRef.current
    if (!el) return

    const handleLoad = () => setLoadState('ready')
    const handleError = () => setLoadState('error')

    el.addEventListener('load', handleLoad)
    el.addEventListener('error', handleError)

    return () => {
      el.removeEventListener('load', handleLoad)
      el.removeEventListener('error', handleError)
      try {
        ;(el as ModelViewerElement & { exitAR?: () => void }).exitAR?.()
      } catch {
        /* noop */
      }
    }
  }, [item.glbSrc])

  function handleOpenAR() {
    const el = viewerRef.current
    if (!el) return
    try {
      void el.activateAR()
    } catch {
      /* noop */
    }
  }

  const isDesktop = reason === 'desktop'

  return (
    <div className="ar-fallback">
      <button type="button" className="ar-back-button" onClick={onExit} aria-label="Back to catalog">
        <span aria-hidden="true">×</span>
      </button>

      <div className="ar-name-pill">
        <span className="ar-name-pill__eyebrow">Previewing</span>
        <span className="ar-name-pill__name">{item.name}</span>
      </div>

      <div className="ar-fallback__stage">
        <model-viewer
          ref={viewerRef}
          src={item.glbSrc}
          alt={item.alt}
          ar={!isDesktop}
          ar-modes="webxr scene-viewer quick-look"
          ar-placement="floor"
          ar-scale="fixed"
          camera-controls
          auto-rotate
          touch-action="pan-y"
          shadow-intensity="1"
          exposure="1.05"
          scale={item.scale}
          camera-orbit={item.cameraOrbit}
          interaction-prompt="none"
          className="ar-fallback__viewer"
        />
        {loadState === 'loading' && (
          <div className="ar-fallback__loading" aria-live="polite">
            <span />
          </div>
        )}
        {loadState === 'error' && (
          <div className="ar-fallback__error">Couldn’t load this model.</div>
        )}
      </div>

      <div className="ar-fallback__panel">
        <p className="ar-fallback__eyebrow">
          {isDesktop ? 'Desktop preview' : 'In-browser AR unavailable'}
        </p>
        <p className="ar-fallback__copy">
          {isDesktop
            ? 'Drag to orbit the model. To place it in your room, open this URL on Android Chrome or iPhone Safari.'
            : 'This browser can hand off to your device’s AR viewer.'}
        </p>
        <div className="ar-fallback__actions">
          {!isDesktop && (
            <button type="button" className="ar-place-button" onClick={handleOpenAR}>
              Open in AR
            </button>
          )}
          <button
            type="button"
            className={isDesktop ? 'ar-place-button' : 'ar-secondary-button ar-secondary-button--wide'}
            onClick={onExit}
          >
            Back to catalog
          </button>
        </div>
      </div>
    </div>
  )
}
