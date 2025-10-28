import React from 'react';
import { useAuth } from '../context/AuthContext';

const Booking = () => {
    const {user, isAuthenticated, login} = useAuth();

    
    return(
        <h1 className="fixed top-20 left-0 w-full text-3xl font-bold text-center" >Booking page</h1>
    )
}

export default Booking;