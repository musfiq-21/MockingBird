import React, { useEffect, useState } from "react";
import { getNewsById, getUsers, addComment } from "../api";
import { useParams, Link } from "react-router-dom";

export default function NewsDetail() {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [users, setUsers] = useState({});
    const [commentText, setCommentText] = useState("");
    const [posting, setPosting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAll();
    }, [id]);

    async function fetchAll() {
        try {
            const [newsRes, usersRes] = await Promise.all([getNewsById(id), getUsers()]);
            setNews(newsRes.data);
            const m = {};
            (usersRes.data || []).forEach(u => (m[u.id] = u));
            setUsers(m);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleAddComment = async () => {
        if (!commentText.trim()) return;
        setPosting(true);
        try {
            await addComment(id, { text: commentText.trim() });
            setCommentText("");
            const res = await getNewsById(id);
            setNews(res.data);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to post comment.");
        } finally {
            setPosting(false);
        }
    };

    if (loading) {
        return <div className="loading fade-in"><div className="spinner"></div></div>;
    }
    if (!news) {
        return <div className="card fade-in"><p>News article not found.</p></div>;
    }

    return (
        <div className="fade-in">
            <div className="card">
                <div className="detail-header">
                    <h2>{news.title}</h2>
                    <div className="detail-meta">
                        <span>✍️ {users[news.author_id]?.name || "Unknown"}</span>
                        {news.created_at && (
                            <span>📅 {new Date(news.created_at).toLocaleDateString()}</span>
                        )}
                    </div>
                </div>
                <div className="detail-body">
                    <p>{news.body}</p>
                </div>
                <Link to="/news" className="btn btn-ghost">← Back to News</Link>
            </div>

            <div className="comments-section">
                <h3>💬 Comments ({(news.comments || []).length})</h3>

                {(news.comments || []).length === 0 && (
                    <p className="subtle">No comments yet. Be the first!</p>
                )}

                {(news.comments || []).map(c => (
                    <div key={c.id} className="comment">
                        <div className="comment-author">{users[c.user_id]?.name || "User"}</div>
                        <div className="comment-text">{c.text}</div>
                        {c.created_at && (
                            <div className="comment-date">{new Date(c.created_at).toLocaleString()}</div>
                        )}
                    </div>
                ))}

                <div className="comment-box">
                    <textarea
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        rows={3}
                    />
                    <div className="comment-actions">
                        <button
                            onClick={handleAddComment}
                            className="btn"
                            disabled={posting || !commentText.trim()}
                        >
                            {posting ? "Posting..." : "Post Comment"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}