import React, { useEffect, useState } from "react";
import { getNewsById, patchNews } from "../api";
import { useNavigate, useParams } from "react-router-dom";

export default function EditNews() {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [forbidden, setForbidden] = useState(false);
    const nav = useNavigate();
    const logged = JSON.parse(localStorage.getItem("loggedUser") || "null");

    useEffect(() => {
        getNewsById(id)
            .then(res => {
                if (logged?.id !== res.data.author_id) {
                    setForbidden(true);
                } else {
                    setTitle(res.data.title);
                    setBody(res.data.body);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <div className="loading fade-in"><div className="spinner"></div></div>;
    }
    if (forbidden) {
        return (
            <div className="card fade-in" style={{ maxWidth: 700, margin: "0 auto" }}>
                <h2>Forbidden</h2>
                <p className="subtle">You are not authorized to edit this article.</p>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!title.trim()) { setError("Title cannot be empty."); return; }
        if (body.trim().length < 20) { setError("Body must be at least 20 characters."); return; }

        setSaving(true);
        try {
            await patchNews(id, { title: title.trim(), body: body.trim() });
            nav("/news");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="card fade-in" style={{ maxWidth: 700, margin: "0 auto" }}>
            <h2>Edit Article</h2>
            <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Article title" />

                <label>Body</label>
                <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Article body" />

                {error && <div className="alert">{error}</div>}

                <button className="btn btn-block" type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}