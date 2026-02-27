import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api";

export default function Register() {
    const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const { name, username, email, password } = form;
        if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
            setError("Please fill in all fields.");
            return;
        }
        if (password.trim().length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            const res = await registerUser({
                name: name.trim(),
                username: username.trim(),
                email: email.trim(),
                password: password.trim()
            });
            localStorage.setItem("jwtToken", res.data.token);
            localStorage.setItem("loggedUser", JSON.stringify(res.data.user));
            nav("/news");
        } catch (err) {
            const data = err.response?.data;
            const msg = data?.message || "Registration failed. Please try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card login-card fade-in">
            <h2>Create your account</h2>
            <p className="subtle">Join NewsPortal to post and comment on news.</p>

            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Full name</label>
                <input id="name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="Your full name" autoComplete="name" />

                <label htmlFor="username">Username</label>
                <input id="username" name="username" type="text" value={form.username} onChange={handleChange} placeholder="Choose a username" autoComplete="username" />

                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" />

                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="At least 6 characters" autoComplete="new-password" />

                {error && <div className="alert">{error}</div>}

                <button className="btn btn-block" type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Create Account"}
                </button>
            </form>

            <p className="subtle" style={{ textAlign: "center", marginTop: "20px" }}>
                Already have an account? <Link to="/">Sign in</Link>
            </p>
        </div>
    );
}
