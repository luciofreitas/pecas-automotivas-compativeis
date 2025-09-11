import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './reset.css' // Reset CSS primeiro para garantir que não haja margens/paddings
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// NOTE: runtime CSS overrides were intentionally removed so that
// `src/app.css` (the project's global stylesheet) is the
// single source of truth for `--site-header-height` and related spacing.
