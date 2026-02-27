import React, { useState } from "react";
import { loginUser } from "../api";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const nav = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!username.trim() || !password.trim()) {
            setError("Please enter both username and password.");
            return;
        }

        setLoading(true);
        try {
            const res = await loginUser({
                username: username.trim(),
                password: password.trim()
            });
            localStorage.setItem("jwtToken", res.data.token);
            localStorage.setItem("loggedUser", JSON.stringify(res.data.user));
            nav("/news");
        } catch (err) {
            const msg = err.response?.data?.message || "Login failed. Please check your credentials.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card login-card fade-in">
            <h2>Welcome back</h2>
            <p className="subtle">Sign in to your NewsPortal account.</p>

            {location.state?.message && (
                <div className="alert alert-success">{location.state.message}</div>
            )}

            <form onSubmit={handleLogin}>
                <label htmlFor="username">Username or email</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username or email"
                    autoComplete="username"
                />

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                />

                {error && <div className="alert">{error}</div>}

                <button className="btn btn-block" type="submit" disabled={loading || !username || !password}>
                    {loading ? "Signing in..." : "Sign In"}
                </button>
            </form>

            <p className="subtle" style={{ textAlign: "center", marginTop: "20px" }}>
                Don't have an account? <Link to="/register">Create one</Link>
            </p>
        </div>
    );
}