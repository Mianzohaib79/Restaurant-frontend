import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AuthContext from './context/AuthContext'
import { CartProvider } from './context/Cart'
import { FavoriteProvider } from './context/FavoriteContext'

import "./config/global"
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContext>
        <CartProvider>
          <FavoriteProvider>
            <App />
          </FavoriteProvider>
        </CartProvider>
      </AuthContext>
    </BrowserRouter>
  </StrictMode>,
)
