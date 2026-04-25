# AR Room Placer

AR Room Placer is a small WebXR-first React prototype for previewing furniture-like objects in a real room. Users can choose a bundled 3D object, inspect it in a browser with orbit controls, then launch AR to place it on the floor with `model-viewer`.

## Stack

- Vite + React + TypeScript
- [`@google/model-viewer`](https://modelviewer.dev/) for 3D preview plus `webxr`, `scene-viewer`, and `quick-look` AR modes
- Local bundled assets in `public/models`

## Run locally

```bash
npm install
npm run dev
```

Build the production bundle with:

```bash
npm run build
```

## Mobile testing notes

- Desktop browsers still work as a 3D preview experience, but immersive placement is usually unavailable there.
- WebXR floor placement works best in Android Chrome when the app is served from a secure context.
- iPhone and iPad users can fall back to Quick Look in Safari when supported.
- Plain HTTP over a LAN IP is not a secure context for WebXR. For real phone testing, prefer:
  - an HTTPS deployment
  - an HTTPS tunnel
  - a true `localhost` workflow on the device

## Bundled objects

- `chair.glb`
  - Source: Khronos glTF Sample Assets, `SheenChair`
  - License: CC0 1.0
- `floor-lamp.glb`
  - Source: Khronos glTF Sample Assets, `IridescenceLamp`
  - License: CC BY 4.0
- `side-table.glb`
  - Source: lightweight local model generated for this prototype

## Model attribution links

- [SheenChair](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/SheenChair)
- [IridescenceLamp](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/IridescenceLamp)
