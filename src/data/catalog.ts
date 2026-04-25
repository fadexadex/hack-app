import type { CatalogItem } from '../types'

export const catalog: CatalogItem[] = [
  {
    id: 'chair',
    name: 'Sheen Chair',
    category: 'Seating',
    description: 'A plush accent chair for checking footprint near a wall or reading corner.',
    longDescription:
      'Judge how a single-seater softens a corner and whether the seat height feels balanced.',
    glbSrc: '/models/chair.glb',
    posterSrc: undefined,
    scale: '1 1 1',
    realScale: 1,
    cameraOrbit: '32deg 76deg auto',
    dimensionsLabel: 'Approx. 0.9m x 0.9m footprint',
    alt: 'A cushioned accent chair previewed for room placement.',
    accent:
      'radial-gradient(circle at 30% 20%, color-mix(in oklab, var(--accent-peach) 55%, white), transparent 65%)',
  },
  {
    id: 'side-table',
    name: 'Side Table',
    category: 'Surfaces',
    description: 'A compact table for bedside placement or spacing tests between larger furniture.',
    longDescription:
      'Lightweight enough for quick layout checks when you mainly care about footprint.',
    glbSrc: '/models/side-table.glb',
    posterSrc: undefined,
    scale: '1 1 1',
    realScale: 1,
    cameraOrbit: '-18deg 70deg auto',
    dimensionsLabel: 'Approx. 0.66m wide x 0.63m tall',
    alt: 'A small wooden side table for AR placement previews.',
    accent:
      'linear-gradient(160deg, color-mix(in oklab, var(--accent-sage) 70%, white), color-mix(in oklab, var(--accent-peach) 50%, white))',
  },
  {
    id: 'floor-lamp',
    name: 'Iridescence Lamp',
    category: 'Lighting',
    description: 'A tall lamp for testing vertical balance and corner fill beside seating.',
    longDescription:
      'Gauge height, spread, and whether the lamp competes with art, shelving, or window lines.',
    glbSrc: '/models/floor-lamp.glb',
    posterSrc: undefined,
    scale: '1 1 1',
    realScale: 1,
    cameraOrbit: '12deg 74deg auto',
    dimensionsLabel: 'Approx. 1.4m visual height',
    alt: 'A tall decorative lamp shown in an augmented reality room preview.',
    accent:
      'linear-gradient(160deg, color-mix(in oklab, var(--accent-peach) 78%, white), color-mix(in oklab, var(--accent-clay) 55%, white))',
  },
]
