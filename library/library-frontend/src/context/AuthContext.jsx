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
        const initUser = async () => {
            const token = localStorage.getItem('token');
            console.log("Token z localStorage:", token);
            if (token) {
                try {
                    const userData = await authService.getCurrentUser();
                    console.log("Dane użytkownika z backendu:", userData);
                    if (userData) {
                        setUser({
                            firstName: userData.firstName,
                            lastName: userData.lastName,
                            email: userData.email,
                            role: userData.role
                        });
                        console.log("Użytkownik ustawiony w kontekście:", userData);
                    } else {
                        console.log("Brak tokenu w localStorage, ustawiam user=null");
                        setUser(null);
                    }
                } catch (err) {
                    console.error("Błąd ładowania użytkownika:", err);
                    setUser(null);
                }
            }
            setIsLoading(false);
        }

        initUser();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);
            if (response.token) {
                setUser({
                    firstName: response.firstName,
                    lastName: response.lastName,
                    email: response.email,
                    role: response.role
                });
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
            const response = await authService.register(userData);
            if (response.token) {
                setUser({
                    firstName: response.firstName,
                    lastName: response.lastName,
                    email: response.email,
                    role: response.role
                });
                return {success: true, msg: 'Rejestracja przebiegła pomyślnie'};
            }
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