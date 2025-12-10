import React, { useEffect, useState } from "react";
import { getNewsById, patchNews, getUsers } from "../api";
import { useParams, Link } from "react-router-dom";


export default function NewsDetail() {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [users, setUsers] = useState({});
    const [commentText, setCommentText] = useState("");
    const logged = JSON.parse(localStorage.getItem("loggedUser") || "null");


    useEffect(() => {
        fetchAll();
        getUsers().then(r => {
            const m = {};
            r.data.forEach(u => (m[u.id] = u));
            setUsers(m);
        }).catch(console.error);

    }, [id]);


    function fetchAll() {
        getNewsById(id).then(res => setNews(res.data)).catch(console.error);
    }


    const addComment = async () => {
        if (!commentText.trim()) return alert("Comment cannot be empty.");
        const newCommentId = (news.comments?.reduce((a, b) => Math.max(a, b.id), 0) || 0) + 1;
        const newComment = { id: newCommentId, user_id: logged.id, text: commentText.trim() };
        const updated = { comments: [...(news.comments || []), newComment] };
        await patchNews(id, updated);
        setCommentText("");
        fetchAll();
    };


    if (!news) return <div>Loading...</div>;


    return (
        <div>
            <h2>{news.title}</h2>
            <p>By: {users[news.author_id] ? users[news.author_id].name : "Unknown"}</p>
            <p>{news.body}</p>


            <hr />
            <h3>Comments ({news.comments ? news.comments.length : 0})</h3>
            <div>
                {(news.comments || []).map(c => (
                    <div key={c.id} className="comment">
                        <b>{users[c.user_id] ? users[c.user_id].name : "User"}</b>: {c.text}
                    </div>
                ))}
            </div>


            <div className="comment-box">
                <textarea value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Write a comment..." />
                <button onClick={addComment} className="btn">Add Comment</button>
            </div>


            <Link to="/news" className="btn btn-ghost">Back to list</Link>
        </div>
    );
}