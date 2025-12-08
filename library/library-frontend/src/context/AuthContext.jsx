import React, {createContext, useContext, useEffect} from 'react';
import {authService} from "../services/authService.js";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    // stan do śledzenia, czy kontekst zakończył inicjalizację
    const [isLoading, setIsLoading] = React.useState(true);

    // przy starcie aplikacji sprawdzam, czy w localStorage jest token i user
    useEffect(() => {
        //const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (token) {
            const decodedUser = jwtDecode(token)
            setUser(decodedUser);
        }
        setIsLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedUser = jwtDecode(token)
                setUser(decodedUser);
                return {success: true, msg: 'Logowanie pomyślne'};
            }
        } catch(err) {
            console.error(err);
            return {success: false, msg: 'Błąd logowania'};
        }
        return {success: false, msg: 'Błąd logowania'};
    };

    const logout = async () => {
        authService.logout();
        setUser(null);
    }

    const register = async (userData) => {
        try {
            await authService.register(userData);
            return {success: true};
        } catch(err) {
            console.error(err);
            return {success: false, msg: 'Błąd rejestracji'};
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);