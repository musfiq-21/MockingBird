import React from "react";
import { Link, useNavigate } from "react-router-dom";

function getLoggedUser() {
    try {
        const u = localStorage.getItem("loggedUser");
        return u ? JSON.parse(u) : null;
    } catch { return null; }
}

export default function Navbar() {
    const user = getLoggedUser();
    const nav = useNavigate();

    const logout = () => {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("loggedUser");
        nav("/");
    };

    return (
        <nav className="navbar">
            <Link to={user ? "/news" : "/"} className="brand">
                <span className="brand-icon">📰</span>
                NewsPortal
            </Link>

            <div className="nav-right">
                {user ? (
                    <>
                        <span className="logged">Hi, <strong>{user.name}</strong></span>
                        <Link to="/news/create" className="btn btn-sm">+ New Post</Link>
                        <button className="btn btn-ghost btn-sm" onClick={logout}>Logout</button>
                    </>
                ) : (
                    <Link to="/" className="btn btn-sm">Sign In</Link>
                )}
            </div>
        </nav>
    );
}