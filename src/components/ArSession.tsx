import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { CatalogItem } from '../types'

type Props = {
  item: CatalogItem
  onExit: () => void
}

type Phase = 'starting' | 'scanning' | 'locked' | 'placed' | 'error'

export function ArSession({ item, onExit }: Props) {
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const [phase, setPhase] = useState<Phase>('starting')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const phaseRef = useRef<Phase>('starting')
  const placeIntentRef = useRef<'idle' | 'placing'>('idle')

  function setPhaseSafe(next: Phase) {
    phaseRef.current = next
    setPhase(next)
  }

  useEffect(() => {
    let disposed = false
    let session: XRSession | null = null
    let renderer: THREE.WebGLRenderer | null = null
    let hitTestSource: XRHitTestSource | null = null
    let canvas: HTMLCanvasElement | null = null

    const overlay = overlayRef.current
    if (!overlay) {
      return
    }

    const xr = navigator.xr

    async function start() {
      try {
        if (!xr) {
          throw new Error('WebXR is not available in this browser.')
        }
        canvas = document.createElement('canvas')
        canvas.style.position = 'fixed'
        canvas.style.inset = '0'
        canvas.style.width = '100%'
        canvas.style.height = '100%'
        canvas.style.zIndex = '0'
        document.body.appendChild(canvas)

        const gl = canvas.getContext('webgl2', { xrCompatible: true, alpha: true, antialias: true })
        if (!gl) {
          throw new Error('Could not initialize WebGL.')
        }

        renderer = new THREE.WebGLRenderer({
          canvas,
          context: gl,
          alpha: true,
          antialias: true,
        })
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.xr.enabled = true

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 30)

        const hemi = new THREE.HemisphereLight(0xffffff, 0xbcb6a8, 1.0)
        scene.add(hemi)
        const dir = new THREE.DirectionalLight(0xffffff, 0.9)
        dir.position.set(0.5, 1.5, 0.5)
        scene.add(dir)

        const reticleRing = new THREE.Mesh(
          new THREE.RingGeometry(0.08, 0.1, 48).rotateX(-Math.PI / 2),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 }),
        )
        const reticleDot = new THREE.Mesh(
          new THREE.CircleGeometry(0.012, 24).rotateX(-Math.PI / 2),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 }),
        )
        const reticle = new THREE.Group()
        reticle.add(reticleRing)
        reticle.add(reticleDot)
        reticle.matrixAutoUpdate = false
        reticle.visible = false
        scene.add(reticle)

        const placedGroup = new THREE.Group()
        placedGroup.matrixAutoUpdate = false
        placedGroup.visible = false
        scene.add(placedGroup)

        const loader = new GLTFLoader()
        const gltf = await loader.loadAsync(item.glbSrc)
        const model = gltf.scene
        const scale = item.realScale ?? 1
        model.scale.setScalar(scale)
        placedGroup.add(model)

        try {
          session = await xr!.requestSession('immersive-ar', {
            requiredFeatures: ['hit-test', 'local-floor'],
            optionalFeatures: ['dom-overlay'],
            domOverlay: { root: overlay! },
          })
        } catch (err) {
          throw new Error(
            err instanceof Error
              ? `Could not start AR session: ${err.message}`
              : 'Could not start AR session.',
            { cause: err },
          )
        }

        if (disposed) {
          await session.end()
          return
        }

        renderer.xr.setReferenceSpaceType('local-floor')
        // three.js's XRSession type matches our global declaration at runtime.
        await (renderer.xr as unknown as { setSession(s: XRSession): Promise<void> }).setSession(session)

        const viewerSpace = await session.requestReferenceSpace('viewer')
        if (!session.requestHitTestSource) {
          throw new Error('Hit test is not supported on this device.')
        }
        const requested = await session.requestHitTestSource({ space: viewerSpace })
        if (!requested) {
          throw new Error('Hit test source could not be created on this device.')
        }
        hitTestSource = requested

        const lastHitMatrix = new THREE.Matrix4()
        let hasHit = false

        function handleSelect() {
          placeIntentRef.current = 'placing'
        }
        session.addEventListener('select', handleSelect)

        function handleEnd() {
          if (!disposed) {
            onExit()
          }
        }
        session.addEventListener('end', handleEnd)

        setPhaseSafe('scanning')

        renderer.setAnimationLoop((_time, frame) => {
          if (!frame || !renderer || !hitTestSource) return
          const refSpace = renderer.xr.getReferenceSpace()
          if (!refSpace) {
            renderer.render(scene, camera)
            return
          }

          const results = (frame as XRFrame).getHitTestResults(hitTestSource)
          if (results.length > 0) {
            const pose = results[0].getPose(refSpace)
            if (pose) {
              hasHit = true
              reticle.visible = phaseRef.current !== 'placed'
              reticle.matrix.fromArray(pose.transform.matrix)
              lastHitMatrix.fromArray(pose.transform.matrix)
              if (phaseRef.current === 'scanning') {
                setPhaseSafe('locked')
              }
            }
          } else {
            reticle.visible = false
            if (phaseRef.current === 'locked') {
              setPhaseSafe('scanning')
            }
          }

          if (placeIntentRef.current === 'placing') {
            placeIntentRef.current = 'idle'
            if (hasHit) {
              placedGroup.matrix.copy(lastHitMatrix)
              placedGroup.visible = true
              setPhaseSafe('placed')
            }
          }

          renderer.render(scene, camera)
        })
      } catch (err) {
        if (disposed) return
        setErrorMessage(err instanceof Error ? err.message : 'Could not start AR session.')
        setPhaseSafe('error')
      }
    }

    start()

    return () => {
      disposed = true
      if (renderer) {
        renderer.setAnimationLoop(null)
      }
      if (hitTestSource && hitTestSource.cancel) {
        try {
          hitTestSource.cancel()
        } catch {
          /* noop */
        }
      }
      if (session) {
        session.end().catch(() => {
          /* noop */
        })
      }
      if (renderer) {
        renderer.dispose()
      }
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas)
      }
    }
  }, [item.glbSrc, item.realScale, onExit])

  function handlePlaceClick() {
    if (phase === 'locked' || phase === 'placed') {
      placeIntentRef.current = 'placing'
    }
  }

  function handleMoveClick() {
    setPhaseSafe(phaseRef.current === 'locked' ? 'locked' : 'scanning')
  }

  return (
    <div ref={overlayRef} className="ar-overlay">
      <button type="button" className="ar-back-button" onClick={onExit} aria-label="Exit AR">
        <span aria-hidden="true">×</span>
      </button>

      <div className="ar-name-pill">
        <span className="ar-name-pill__eyebrow">Placing</span>
        <span className="ar-name-pill__name">{item.name}</span>
      </div>

      {phase === 'starting' && (
        <div className="ar-banner ar-banner--info">Starting AR session…</div>
      )}

      {phase === 'scanning' && (
        <div className="ar-hint">Slowly scan the floor to find a surface.</div>
      )}

      {phase === 'error' && (
        <div className="ar-banner ar-banner--error">
          {errorMessage ?? 'AR could not start.'}
        </div>
      )}

      <div className="ar-actions">
        {phase !== 'placed' ? (
          <button
            type="button"
            className="ar-place-button"
            onClick={handlePlaceClick}
            disabled={phase !== 'locked'}
          >
            {phase === 'locked' ? 'Place here' : 'Looking for floor…'}
          </button>
        ) : (
          <div className="ar-actions-row">
            <button type="button" className="ar-secondary-button" onClick={handleMoveClick}>
              Move
            </button>
            <button type="button" className="ar-place-button" onClick={onExit}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
