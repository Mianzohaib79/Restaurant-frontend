import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import Frontend from './Frontend';
import Auth from './Auth';
import Dashboard from './Dashboard';
import ProtectedRoute from '../components/Misc/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

const Index = () => {
    const { isAuth } = useAuth()
    return (
        <div>
            <Routes>
                <Route path="/*" element={<Frontend />} />
                <Route path="/auth/*" element={!isAuth ? <Auth /> : <Navigate to="/" />} />
                <Route path="/dashboard/*" element={<ProtectedRoute allowedRoles={['superAdmin']}><Dashboard /></ProtectedRoute>} />
            </Routes>
        </div>
    )
}

export default Index