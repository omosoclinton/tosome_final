import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/styles.css'
//import './index.css' This must go so that tailwind is seen
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
