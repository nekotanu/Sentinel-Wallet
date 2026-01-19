import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./test/heuristicsTest.ts";  // run hruristicsts test

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
