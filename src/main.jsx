import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './router/router.jsx'
import { RouterProvider } from 'react-router'
import AuthProvider from './contexts/AuthProvider.jsx'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>

          <RouterProvider router={router} />
<ToastContainer />
    </AuthProvider>
  </StrictMode>,
)
