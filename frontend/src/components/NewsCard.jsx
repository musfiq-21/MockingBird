import React from "react";
import { Link } from "react-router-dom";

export default function NewsCard({ item, authorName, onDelete, loggedUserId }) {
    return (
        <div className="card news-card">
            <div className="news-body">
                <h3 className="news-title">{item.title}</h3>
                <p className="news-desc">
                    {item.body?.slice(0, 140)}{item.body && item.body.length > 140 ? "..." : ""}
                </p>
                <p className="news-meta">✍️ {authorName || "Unknown"}</p>
            </div>

            <div className="news-actions">
                <Link to={`/news/${item.id}`} className="btn btn-sm">Read More</Link>
                {loggedUserId === item.author_id && (
                    <>
                        <Link to={`/news/${item.id}/edit`} className="btn btn-ghost btn-sm">Edit</Link>
                        <button className="btn btn-danger btn-sm" onClick={() => onDelete(item.id)}>Delete</button>
                    </>
                )}
                <span className="comment-count">💬 {(item.comments || []).length}</span>
            </div>
        </div>
    );
}