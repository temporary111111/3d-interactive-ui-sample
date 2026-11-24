import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

// Render after webfonts resolve so the canvas card textures are drawn with
// the real typefaces instead of a fallback.
const boot = () => {
  createRoot(document.getElementById('root')).render(<App />)
}

if (document.fonts?.ready) {
  document.fonts.ready.then(boot, boot)
} else {
  boot()
}
