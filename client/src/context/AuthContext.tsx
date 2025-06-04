import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser as apiLogin, registerUser as apiRegister } from '../api'; // Assuming api.ts is in src/

interface User {
    id: string;
    username: string;
    email: string;
}

interface AuthContextType {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: any) => Promise<void>;
    register: (credentials: any) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [user, setUser] = useState<User | null>(null); // We might fetch user details separately or get from login/register
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
    const [isLoading, setIsLoading] = useState<boolean>(true); // To handle initial auth check

    useEffect(() => {
        // This effect runs once on mount to check initial auth state
        // A more robust solution might involve a /me endpoint to verify token and get user data
        const storedToken = localStorage.getItem('token');
        // For simplicity, we'll assume if a token exists, it's valid.
        // In a real app, you'd verify this token with the backend.
        if (storedToken) {
            setToken(storedToken);
            setIsAuthenticated(true);
            // Potentially decode token to get user info or fetch from a /me endpoint
            // For now, we'll set a placeholder or wait for login/register to populate user
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Failed to parse stored user", e);
                    localStorage.removeItem('user'); // Clear corrupted data
                }
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: any) => {
        setIsLoading(true);
        try {
            const response = await apiLogin(credentials);
            const { token: newToken, user: loggedInUser } = response.data;
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(loggedInUser));
            setToken(newToken);
            setUser(loggedInUser);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login failed:', error);
            logout(); // Clear any partial state
            throw error; // Re-throw to be caught by the component
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (credentials: any) => {
        setIsLoading(true);
        try {
            const response = await apiRegister(credentials);
            const { token: newToken, user: registeredUser } = response.data;
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(registeredUser));
            setToken(newToken);
            setUser(registeredUser);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Registration failed:', error);
            logout(); // Clear any partial state
            throw error; // Re-throw
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ token, user, isAuthenticated, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
