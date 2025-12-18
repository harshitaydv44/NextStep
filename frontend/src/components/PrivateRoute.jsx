import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    
    if (token && user && allowedRoles && allowedRoles.includes(user.role)) {
        return <Outlet />;
    }


    return <Navigate to="/login" replace />;
};

export default PrivateRoute; 