import React, { useState } from "react";
import { createNews } from "../api";
import { useNavigate } from "react-router-dom";

export default function CreateNews() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!title.trim()) { setError("Title cannot be empty."); return; }
        if (body.trim().length < 50) { setError("Body must be at least 50 characters."); return; }

        setLoading(true);
        try {
            await createNews({ title: title.trim(), body: body.trim() });
            nav("/news");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create article.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card fade-in" style={{ maxWidth: 700, margin: "0 auto" }}>
            <h2>Create News Article</h2>
            <p className="subtle">Share something with the community.</p>
            <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Give your article a title" />

                <label>Body</label>
                <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Write your article (minimum 50 characters)" />
                <p className="hint">{body.trim().length}/50 characters minimum</p>

                {error && <div className="alert">{error}</div>}

                <button className="btn btn-block" type="submit" disabled={loading}>
                    {loading ? "Publishing..." : "Publish Article"}
                </button>
            </form>
        </div>
    );
}