import React from "react";
import { Link } from "react-router-dom";


export default function NewsCard({ item, authorName, onDelete, loggedUserId }) {
    return (
        <div className="card news-card">
            <div className="news-body">
                <h3 className="news-title">{item.title}</h3>
                <p className="news-desc">{item.body?.slice(0, 120)}{item.body && item.body.length > 120 ? '...' : ''}</p>
                <p className="news-meta">By: {authorName || 'Unknown'}</p>
            </div>


            <div className="news-actions">
                <Link to={`/news/${item.id}`} className="btn">View Details</Link>
                {loggedUserId === item.author_id && (
                    <>
                        <Link to={`/news/${item.id}/edit`} className="btn">Edit</Link>
                        <button className="btn btn-danger" onClick={() => onDelete(item.id)}>Delete</button>
                    </>
                )}
                <div className="comment-count">{(item.comments || []).length} comments</div>
            </div>
        </div>
    );
}