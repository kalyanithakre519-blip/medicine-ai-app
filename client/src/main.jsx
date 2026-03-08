import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'
import axios from 'axios'

// Set default API URL for all axios requests
// This allows the app to work seamlessly on both localhost (using vite proxy) and Vercel
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://med-ai-backend-iex0.onrender.com';

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
