import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ScreenLoader from './ScreenLoader';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, isAuth, isAppLoading } = useAuth();
    const location = useLocation();

    if (isAppLoading) {
        return <ScreenLoader />;
    }

    if (!isAuth) {
        return <Navigate to="/auth/login" replace state={{ from: location }} />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return children;
};

export default ProtectedRoute;