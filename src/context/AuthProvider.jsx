import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                try {
                    const parsedToken = JSON.parse(storedToken);
                    setToken(parsedToken.token);
                    setUser(parsedToken.user || null);
                } catch (error) {
                    console.error('Error parsing token:', error);
                    localStorage.removeItem("token");
                    setToken('');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const isAuthenticated = () => !!localStorage.getItem('token');

    const isAdmin = () =>
        localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token")).role === 0 ||
              JSON.parse(localStorage.getItem("token")).role === 1
            : false;

    const logout = () => {
        localStorage.removeItem("token"); // Elimina el token del almacenamiento local
        setUser(null); // Resetea el estado del usuario
        setToken(''); // Resetea el token
        navigate("/login"); // Redirige al login
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                isAuthenticated,
                isAdmin,
                token,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
