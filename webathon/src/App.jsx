import { Routes, Route, BrowserRouter } from "react-router-dom";
import React from "react";
import Home from "./components/Home";
import SlideLogin from "./components/SlideLogin";
import Dashboard from "./components/Dashboard";
import { AuthContextProvider } from "./context/AuthContext";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Profile from "./components/Profile";
import TweetForm from "./components/TweetForm";
import TweetsList from "./components/TweetsList";
import StudentProfile from "./components/StudentProfile";

import AdminDashboard from "./components/AdminDashboard";


import BookmarkDashboard from "./components/BookmarkDashboard";



function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<SlideLogin />} />


            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoutes>
                  <Dashboard />
                </ProtectedRoutes>
              }
            />
      
            <Route
              path="/bookmarks"
              element={
                <ProtectedRoutes>
                  <BookmarkDashboard />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/admindashboard"
              element={
                <ProtectedRoutes>
                  <AdminDashboard />
                </ProtectedRoutes>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoutes>
                  <Profile />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/profile/:authorId"
              element={
                <ProtectedRoutes>
                  <StudentProfile />
                </ProtectedRoutes>
              }
            />
            <Route
              element={
                <ProtectedRoutes>
                  <TweetForm />
                </ProtectedRoutes>
              }
            />
            <Route
              element={
                <ProtectedRoutes>
                  <TweetsList />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoutes>
                  <Profile />
                </ProtectedRoutes>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;
