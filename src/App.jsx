import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import NewsList from "./pages/NewsList";
import CreateNews from "./pages/CreateNews";
import EditNews from "./pages/EditNews";
import NewsDetail from "./pages/NewsDetail";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <>
            <Navbar />
            <div className="container">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route
                        path="/news"
                        element={
                            <ProtectedRoute>
                                <NewsList />
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/news/create"
                        element={
                            <ProtectedRoute>
                                <CreateNews />
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/news/:id/edit"
                        element={
                            <ProtectedRoute>
                                <EditNews />
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/news/:id"
                        element={
                            <ProtectedRoute>
                                <NewsDetail />
                            </ProtectedRoute>
                        }
                    />


                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </>
    );
}


export default App;