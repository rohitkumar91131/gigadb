import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom' // <-- 1. Ye import add karo
import { Toaster } from 'sonner'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. App ko BrowserRouter se wrap karo */}
    <BrowserRouter>
          <Toaster/>

      <App />
    </BrowserRouter>
  </React.StrictMode>,
)