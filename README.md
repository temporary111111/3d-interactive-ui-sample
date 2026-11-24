# NOVA — Spatial Interface

An interactive exhibition built as a small solar system: five project cards orbit a
glowing nucleus, wrapped in a dark, instrument-panel HUD. Everything is rendered in
real time — no external 3D models, HDRIs, or image assets.

## Run

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://127.0.0.1:5173`).

```bash
npm run build
npm run preview
```

## Controls

| Input | Action |
| --- | --- |
| Drag | Orbit the scene |
| Scroll | Move through depth |
| Click a card | Fly to the project and open its panel |
| `1`–`5` | Focus a project |
| `←` / `→` | Step through projects while focused |
| `Esc` | Close focus |
| `R` | Reset the orbit |

The bottom dock switches between three palettes — **Aurora**, **Ember**, and
**Mono** — toggles the slow auto-orbit, and resets the view.

## How it is made

- **Vite + React 18 + React Three Fiber 8**
- **three.js** with a procedural environment made from `Lightformer` panels, so
  reflections work offline.
- **@react-three/postprocessing** bloom for the nucleus, rings, and card edges.
- Card faces are drawn to canvas textures at runtime, which keeps the type crisp and
  lets every palette regenerate the artwork.
- A custom camera rig eases between the orbital overview and a close, panel-aware
  focus shot. On narrow screens the cards switch to a vertical constellation and the
  detail panel becomes a bottom sheet.
- A boot overlay, trailing cursor, starfield shader, orbit tracks, and HUD complete
  the interface.

## Structure

```
src/
  App.jsx              app state, canvas, HUD composition, shortcuts
  data.js              five projects
  palettes.js          Aurora / Ember / Mono
  styles.css           full interface styling + responsive rules
  scene/
    Experience.jsx     scene assembly, lights, environment, bloom
    Core.jsx           nucleus, rings, dust, lens flare
    ProjectCard.jsx    billboarded card, hover lift, selection
    CameraRig.jsx      overview ↔ focus camera choreography
    Backdrop.jsx       camera-locked gradient shader
    Starfield.jsx      twinkling point shader
    OrbitTrack.jsx     parking orbits beneath the card ring
    textures.js        canvas card faces, glow and radial sprites
  ui/                  boot, dock, detail panel, index rail, cursor, top bar
```
