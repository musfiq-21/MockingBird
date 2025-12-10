import React from "react";
import { Navigate } from "react-router-dom";


export default function ProtectedRoute({ children }) {
    let parsed = null;
    try {
        const user = localStorage.getItem("loggedUser");
        if (user) parsed = JSON.parse(user);
    } catch (e) {
        localStorage.removeItem("loggedUser");
    }
    if (!parsed) {
        return <Navigate to="/" replace />;
    }
    return children;
}