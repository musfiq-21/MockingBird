import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("jwtToken");
    let user = null;
    try {
        const raw = localStorage.getItem("loggedUser");
        if (raw) user = JSON.parse(raw);
    } catch {
        localStorage.removeItem("loggedUser");
        localStorage.removeItem("jwtToken");
    }

    if (!token || !user) {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("loggedUser");
        return <Navigate to="/" replace />;
    }

    return children;
}