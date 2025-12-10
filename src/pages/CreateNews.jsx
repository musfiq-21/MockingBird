import React, { useState } from "react";
import { createNews } from "../api";
import { useNavigate } from "react-router-dom";


export default function CreateNews() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const nav = useNavigate();
    const logged = JSON.parse(localStorage.getItem("loggedUser") || "null");


    const validate = () => {
        if (!title.trim()) { alert("Title cannot be empty."); return false; }
        if (body.trim().length < 50) { alert("Body must be at least 50 characters."); return false; }
        return true;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        const payload = { title, body, author_id: logged.id, comments: [] };
        await createNews(payload);
        nav("/news");
    };


    return (
        <div className="card">
            <h2>Create News</h2>
            <form onSubmit={handleSubmit}>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title of the news" />
                <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Body (minimum 50 characters)" />
                <button className="btn" type="submit">Create</button>
            </form>
        </div>
    );
}
