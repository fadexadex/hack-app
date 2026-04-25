import type { ModelViewerElement } from '@google/model-viewer'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import type React from 'react'

type ModelViewerHTMLAttributes = DetailedHTMLProps<
  HTMLAttributes<ModelViewerElement>,
  ModelViewerElement
> & {
  src?: string
  poster?: string
  alt?: string
  exposure?: string
  scale?: string
  className?: string
  ar?: boolean
  'ar-modes'?: string
  'ar-scale'?: string
  'ar-placement'?: string
  'camera-controls'?: boolean
  'camera-orbit'?: string
  'max-camera-orbit'?: string
  'min-camera-orbit'?: string
  'touch-action'?: string
  'shadow-intensity'?: string
  'interaction-prompt'?: string
  'interaction-prompt-threshold'?: string
  'xr-environment'?: boolean
  'disable-zoom'?: boolean
  'disable-tap'?: boolean
  'auto-rotate'?: boolean
  ref?: React.Ref<ModelViewerElement>
  slot?: string
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerHTMLAttributes
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerHTMLAttributes
    }
  }
}

export {}
