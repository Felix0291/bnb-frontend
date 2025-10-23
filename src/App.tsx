import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Properties from './pages/Properties'
import Login from './pages/Login'
import Booking from './pages/Booking'
import PropertyDetails from './pages/PropertyDetails'
import MyPage from './pages/MyPage'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/mypage" element={<MyPage />}/>
          <Route path='/properties' element={<Properties />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/booking' element={<Booking />}/>
          <Route path='/propertydetails' element={<PropertyDetails />}/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
