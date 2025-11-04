import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Header from './components/Header'
import Login from './pages/Login'
import PropertyDetails from './pages/PropertyDetails'
import MyPage from './pages/MyPage'
import Register from './pages/Register'
import { AuthProvider } from './context/AuthContext'
import Footer from './components/Footer'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        
        <Header />
       
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mypage" element={<MyPage />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/propertydetails/:id' element={<PropertyDetails />}/>
        </Routes>
        
        <Footer />

      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
