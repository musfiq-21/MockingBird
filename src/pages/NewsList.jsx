import React, { useEffect, useState } from "react";
import { getAllNews, getUsers, deleteNews } from "../api";
import NewsCard from "../components/NewsCard";


export default function NewsList() {
    const [news, setNews] = useState([]);
    const [usersMap, setUsersMap] = useState({});
    const logged = JSON.parse(localStorage.getItem("loggedUser") || "null");


    useEffect(() => {
        fetchData();
        getUsers().then(r => {
            const m = {};
            r.data.forEach(u => (m[u.id] = u));
            setUsersMap(m);
        }).catch(console.error);
    }, []);


    function fetchData() {
        getAllNews("?_sort=id&_order=desc").then(res => setNews(res.data)).catch(console.error);
    }


    const handleDelete = (id) => {
        const item = news.find(n => n.id === id);
        if (!logged || logged.id !== item.author_id) return alert("You can only delete your own posts.");
        if (!window.confirm("Are you sure you want to delete this news?")) return;
        deleteNews(id).then(() => fetchData());
    };


    return (
        <div>
            <h2>All News</h2>
            {news.length === 0 && <p>No news found.</p>}
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
        </div>
    );
}