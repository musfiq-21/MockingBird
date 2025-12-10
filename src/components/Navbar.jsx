import React from "react";
import { Link, useNavigate } from "react-router-dom";


function getLoggedUser() {
    const u = localStorage.getItem("loggedUser");
    return u ? JSON.parse(u) : null;
}


export default function Navbar() {
    const user = getLoggedUser();
    const nav = useNavigate();


    const logout = () => {
        localStorage.removeItem("loggedUser");
        nav("/");
    };


    return (
        <nav className="navbar">
            <Link to={user ? "/news" : "/"} className="brand">
                NewsPortal
            </Link>


            <div className="nav-right">
                {user ? (
                    <>
                        <span className="logged">Logged in as: <strong>{user.name}</strong></span>
                        <Link to="/news/create" className="btn">Create News</Link>
                        <button className="btn btn-ghost" onClick={logout}>Logout</button>
                    </>
                ) : (
                    <Link to="/" className="btn">Login</Link>
                )}
            </div>
        </nav>
    );
}