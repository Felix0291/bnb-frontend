import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Properties from './pages/Properties'
import Login from './pages/Login'
import Booking from './pages/Booking'
import PropertyDetails from './pages/PropertyDetails'

function App() {


  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/properies' element={<Properties />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/booking' element = {<Booking />}/>
        <Route path='/propertydetails' element= {<PropertyDetails />}/>
      </Routes>
    </div>
  )
}

export default App
