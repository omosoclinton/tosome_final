import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../api";

function Logout() {
    const { setIsAuthorized } = useAuth()
    const navigate = useNavigate()

    const refreshToken = localStorage.getItem('REFRESH_TOKEN');

    try {
        api.post('/api/users/logout/', { refresh_token: refreshToken });
        localStorage.removeItem('ACCESS_TOKEN')
        localStorage.removeItem('REFRESH_TOKEN')
        localStorage.clear()
        setIsAuthorized(false)
        //setUser(null)

        navigate('/')

    } catch (error) {
        console.error('Error logging out', error)
    }

}

export default Logout