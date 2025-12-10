import React, { useEffect, useState } from "react";
import { getUsers } from "../api";
import { useNavigate } from "react-router-dom";


export default function Login() {
    const [users, setUsers] = useState([]);
    const [selected, setSelected] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const nav = useNavigate();

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError("");
        getUsers()
            .then(res => {
                if (cancelled) return;
                setUsers(res.data || []);
            })
            .catch(err => {
                console.error(err);
                if (cancelled) return;
                setError("Unable to load users. Make sure the API server is running.");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        const user = users.find(u => String(u.id) === String(selected));
        if (!user) {
            alert("Please select a user to login.");
            return;
        }

        const normalized = { ...user, id: Number(user.id) };
        localStorage.setItem("loggedUser", JSON.stringify(normalized));
        nav("/news");
    };

    return (
        <div className="card login-card">
            <h2>Welcome to NewsApp</h2>
            <p className="subtle">Choose a profile to continue.</p>
            {loading && <p>Loading users...</p>}
            {error && (
                <div className="alert">
                    {error}
                    <div className="hint">Tip: run json-server on port 3000 with /users and /news endpoints.</div>
                    <button className="btn btn-ghost" onClick={() => window.location.reload()}>Retry</button>
                </div>
            )}
            {!loading && !error && (
                <form onSubmit={handleLogin}>
                    <label htmlFor="userSelect">Login as</label>
                    <select id="userSelect" value={selected} onChange={(e) => setSelected(e.target.value)}>
                        <option value="">-- Select your name --</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                    <button className="btn" type="submit" disabled={!selected}>Login</button>
                </form>
            )}
        </div>
    );
}