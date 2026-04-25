import '@google/model-viewer'
import type { CSSProperties } from 'react'
import { catalog } from '../data/catalog'
import { useWebXRSupport } from '../hooks/useWebXRSupport'
import type { CatalogItem } from '../types'

type Props = {
  onSelect: (item: CatalogItem) => void
}

export function CatalogScreen({ onSelect }: Props) {
  const support = useWebXRSupport()
  const isSecure = typeof window === 'undefined' ? true : window.isSecureContext

  const supportLabel =
    support === 'checking'
      ? 'Checking your device…'
      : support === 'supported'
      ? 'In-browser AR ready on this device.'
      : isSecure
      ? 'On phones, this hands off to your AR viewer.'
      : 'Serve over HTTPS or localhost for AR placement.'

  return (
    <main className="catalog-screen">
      <header className="catalog-header">
        <div className="catalog-brand">
          <span className="catalog-brand__mark" aria-hidden="true" />
          <span className="catalog-brand__name">Atelier AR</span>
        </div>
        <p className="catalog-eyebrow">Showroom · 2026</p>
      </header>

      <section className="catalog-hero">
        <h1 className="catalog-title">
          <span>Place it</span>
          <span className="catalog-title__accent">before you place it.</span>
        </h1>
        <p className="catalog-lede">
          Choose a piece, then point your camera where it should sit. A reticle will lock to the floor,
          and one tap drops it into your room at true scale.
        </p>
      </section>

      <section className="catalog-grid" aria-label="Catalog">
        {catalog.map((item) => (
          <article
            key={item.id}
            className="catalog-card"
            style={{ ['--card-accent' as string]: item.accent } as CSSProperties}
          >
            <div className="catalog-card__media">
              <model-viewer
                src={item.glbSrc}
                alt={item.alt}
                camera-controls
                touch-action="pan-y"
                interaction-prompt="none"
                shadow-intensity="0.85"
                exposure="1.1"
                camera-orbit={item.cameraOrbit}
                disable-zoom
                className="catalog-card__viewer"
              />
            </div>

            <div className="catalog-card__body">
              <p className="catalog-card__category">{item.category}</p>
              <h2 className="catalog-card__name">{item.name}</h2>
              <p className="catalog-card__description">{item.description}</p>
              <p className="catalog-card__dimensions">{item.dimensionsLabel}</p>

              <button
                type="button"
                className="catalog-card__cta"
                onClick={() => onSelect(item)}
              >
                Place in your space
                <span className="catalog-card__cta-arrow" aria-hidden="true">→</span>
              </button>
            </div>
          </article>
        ))}
      </section>

      <footer className="catalog-footer">
        <span className={`catalog-status catalog-status--${support}`}>
          <span className="catalog-status__dot" aria-hidden="true" />
          {supportLabel}
        </span>
      </footer>
    </main>
  )
}
