import { useLayoutEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import HomePage from './pages/homePage.jsx'
import RegisterPage from './pages/registerPage.jsx'
import LoginPage from './pages/loginPage.jsx'
import AdminPage from './pages/adminPage.jsx'
import toast, { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';


function App() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return (
    
    <GoogleOAuthProvider clientId="849594857218-6vqe05dqqtaqe1h0opfqjj87iekdgqr1.apps.googleusercontent.com">
    <div className="w-full h-screen ">
      <Toaster position='top-right'/>
      <Routes>
        <Route path="/*" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />  
        <Route path="/admin/*" element={<AdminPage />} />
        
      </Routes >
    </div> 

    </GoogleOAuthProvider>
   
    // <>
    //   <h1 className="text-[4rem ] font-bold text-cen   ter text-red-500">Welcome to React</h1>
    //   <ProductCard name="Macbook Air" price="$999" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTj9_qrmeUsR9AneXH0CIPl0DgfapNWg5yYttQDrwYDA&s=10"/>
    //   <ProductCard name="Dell XPS" price="$1299" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTj9_qrmeUsR9AneXH0CIPl0DgfapNWg5yYttQDrwYDA&s=10"/>
    //   <ProductCard name="HP Spectre" price="$1499" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTj9_qrmeUsR9AneXH0CIPl0DgfapNWg5yYttQDrwYDA&s=10"/>
    // </>
  )
}

export default App
