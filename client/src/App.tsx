import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/Forgot-password";
import ChangePassword from "./pages/Change-password";
import SinglePost from "./pages/post/Single-post";
import EditPost from "./pages/post/Edit-post";
import CreatePost from "./pages/post/Create-post";
import AboutMe from "./pages/About";
import CV from "./pages/CV";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password/:token" element={<ChangePassword />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/post/:postId" element={<SinglePost />} />
        <Route path="/edit-post/:postId" element={<EditPost />} />
        <Route path="/about" element={<AboutMe />} />
        <Route path="/cv" element={<CV url={"../public/CV.pdf"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
