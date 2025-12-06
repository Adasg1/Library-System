import React, {createContext, useContext, useEffect} from 'react';
import {authService} from "../services/authService.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);

    // przy starcie aplikacji sprawdzam, czy w localStorage jest token i user
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email, password) => {
        try {
            const result = await authService.login(email, password);
            if (result.token) {
                setUser(result.user);
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

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);