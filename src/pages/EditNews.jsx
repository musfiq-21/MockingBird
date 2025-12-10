import React, { useEffect, useState } from "react";
import { getNewsById, patchNews } from "../api";
import { useNavigate, useParams } from "react-router-dom";


export default function EditNews() {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [newsItem, setNewsItem] = useState(null);
    const nav = useNavigate();
    const logged = JSON.parse(localStorage.getItem("loggedUser") || "null");


    useEffect(() => {
        getNewsById(id).then(res => {
            setNewsItem(res.data);
            setTitle(res.data.title);
            setBody(res.data.body);
        }).catch(console.error);
    }, [id]);


    if (!newsItem) return <div>Loading...</div>;
    if (logged.id !== newsItem.author_id) return <div>You are not authorized to edit this news.</div>;


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) { alert("Title cannot be empty."); return; }
        if (body.trim().length < 20) { alert("Body must be at least 20 characters."); return; }
        await patchNews(id, { title, body });
        nav("/news");
    };


    return (
        <div className="card">
            <h2>Edit News</h2>
            <form onSubmit={handleSubmit}>
                <input value={title} onChange={e => setTitle(e.target.value)} />
                <textarea value={body} onChange={e => setBody(e.target.value)} />
                <button className="btn" type="submit">Save</button>
            </form>
        </div>
    );
}