export type ArSupportState = 'checking' | 'supported' | 'fallback' | 'unsupported'

export type CatalogItem = {
  id: string
  name: string
  category: string
  description: string
  longDescription: string
  glbSrc: string
  posterSrc?: string
  scale: string
  realScale: number
  cameraOrbit: string
  dimensionsLabel: string
  alt: string
  accent: string
}
