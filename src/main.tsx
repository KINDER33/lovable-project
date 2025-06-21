
import React from 'react'
import ReactDOM from 'react-dom/client'
import SimpleMainApp from './components/SimpleMainApp.tsx'
import { Toaster } from "@/components/ui/toaster"
import { DatabaseProvider } from './contexts/DatabaseContext'
import { HybridAuthProvider } from './contexts/HybridAuthContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DatabaseProvider>
      <HybridAuthProvider>
        <SimpleMainApp />
        <Toaster />
      </HybridAuthProvider>
    </DatabaseProvider>
  </React.StrictMode>,
)
