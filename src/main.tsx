import React from 'react'
import ReactDOM from 'react-dom/client'
// import TestApp from './TestApp.tsx'
import App from './App.tsx'
import './styles/index.css'
import { initializeSecurity } from '@utils/securityUtils'

// 初始化安全措施
initializeSecurity({
  enableCSP: true,
  enableXSSProtection: true,
  enableExtensionDetection: true,
  strictMode: process.env.NODE_ENV === 'production'
}).then(() => {
  console.log('🔒 Security initialized, starting application...')
}).catch(error => {
  console.error('❌ Security initialization failed:', error)
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)