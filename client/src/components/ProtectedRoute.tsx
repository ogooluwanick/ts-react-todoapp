import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    // We can add more props if needed, like roles for role-based access
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        // Optional: Show a loading spinner or a blank page while auth state is being determined
        return <div>Loading authentication status...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />; // Renders the child route's element if authenticated
};

export default ProtectedRoute;
