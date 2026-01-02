import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './hooks/useTheme.tsx'
import { ToastProvider } from './hooks/useToast.tsx'
import { DatabaseProvider } from './hooks/useDatabase.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DatabaseProvider>
      <ThemeProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ThemeProvider>
    </DatabaseProvider>
  </StrictMode>,
)
