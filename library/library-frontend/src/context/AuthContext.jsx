import React, {createContext, useContext, useEffect} from 'react';
import {authService} from "../services/authService.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    // stan do śledzenia, czy kontekst zakończył inicjalizację
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchAndSetUser = async () => {
        try{
            const userData = await authService.getCurrentUser();
            if (userData) {
                setUser({
                    id: userData.id,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    role: userData.role
                });
                return true;
            }
        } catch(error) {
            console.log(error);
        }
        return false;
    };

    // przy starcie aplikacji sprawdzam, czy w localStorage jest token i user
    useEffect(() => {
        const initUser = async () => {
            const token = localStorage.getItem('token');
            console.log("Token z localStorage:", token);
            if (token) {
               await fetchAndSetUser();
            }
            setIsLoading(false);
        }

        initUser();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);
            if (response.token) {
                const success = await fetchAndSetUser();

                if (success) {
                    return {success: true, msg: 'Logowanie pomyślne'};
                }
            }
        } catch(err) {
            console.error(err);
            return {success: false, msg: 'Błąd logowania'};
        }
        return {success: false, msg: 'Nie udało się pobrać danych użytkownika'};
    };

    const logout = async () => {
        authService.logout();
        setUser(null);
    }

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            if (response.token) {
                const success = await fetchAndSetUser();

                if (success) {
                    return {success: true, msg: 'Rejestracja pomyślna'};
                }
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