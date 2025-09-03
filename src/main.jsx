import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './page-App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// NOTE: runtime CSS overrides were intentionally removed so that
// `src/Responsive.css` (the project's global stylesheet) is the
// single source of truth for `--site-header-height` and related spacing.
