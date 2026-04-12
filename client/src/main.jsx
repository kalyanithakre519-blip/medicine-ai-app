import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'
import axios from 'axios'

// Set default API URL for all axios requests
// This allows the app to work seamlessly on both localhost (using vite proxy) and Vercel
axios.defaults.baseURL = import.meta.env.PROD ? 'https://med-ai-backend-iex0.onrender.com' : '';

// --- GLOBAL PERFORMANCE CACHE (MOBILE & WEB) ---
const CACHE_TIME_MS = 1000 * 60 * 5; // 5 minutes cache
const reqCache = new Map();

axios.interceptors.request.use(config => {
  if (config.method === 'get') {
    const cachedData = reqCache.get(config.url);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TIME_MS) {
      config.adapter = () => Promise.resolve({
        data: cachedData.data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        request: {}
      });
    }
  }
  return config;
});

axios.interceptors.response.use(response => {
  if (response.config.method === 'get') {
    reqCache.set(response.config.url, {
        timestamp: Date.now(),
        data: response.data
    });
  }
  return response;
});
// ------------------------------------------------

const updateSW = registerSW({
  onNeedRefresh() {
    // Force immediate silent update for mobile app so they get newest features instantly
    updateSW(true);
  },
  onOfflineReady() {
    console.log('App ready to work offline (High Speed Mode)')
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
