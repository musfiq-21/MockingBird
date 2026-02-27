import React, { useEffect, useState } from "react";
import { getAllNews, getUsers, deleteNews } from "../api";
import NewsCard from "../components/NewsCard";

export default function NewsList() {
    const [news, setNews] = useState([]);
    const [usersMap, setUsersMap] = useState({});
    const [loading, setLoading] = useState(true);
    const logged = JSON.parse(localStorage.getItem("loggedUser") || "null");

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        try {
            const [newsRes, usersRes] = await Promise.all([getAllNews(), getUsers()]);
            setNews(newsRes.data || []);
            const m = {};
            (usersRes.data || []).forEach(u => (m[u.id] = u));
            setUsersMap(m);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this news?")) return;
        try {
            await deleteNews(id);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete.");
        }
    };

    if (loading) {
        return (
            <div className="loading fade-in">
                <div className="spinner"></div>
                <p style={{ marginTop: 12 }}>Loading news...</p>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="page-header">
                <h2>Latest News</h2>
            </div>
            {news.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📭</div>
                    <p>No news articles yet. Be the first to post!</p>
                </div>
            ) : (
                <div className="grid">
                    {news.map(item => (
                        <NewsCard
                            key={item.id}
                            item={item}
                            authorName={usersMap[item.author_id]?.name}
                            onDelete={handleDelete}
                            loggedUserId={logged?.id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}