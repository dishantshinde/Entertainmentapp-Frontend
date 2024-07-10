import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/login/Login";
import Homepage from "./pages/Homepage/Homepage";
import Signup from "./pages/signup/Signup";
import Movie from "./pages/movies/Movie";
import TvSeries from "./pages/TvSeries/tvseries";
import Navbar from "./components/navbar/Navbar";
import ContentDesc from "./pages/contentDesc/ContentDesc";
import Searched from "./pages/SearchedContent/Searched";
import "./App.css";
import Bookmarks from "./pages/bookmarks/bookmarks";
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation(); // Now useLocation is within Router context
  const handlepath =
    location.pathname === "/login" || location.pathname === "/signup";
  return (
    <div className="AppContainer">
      {!handlepath && <Navbar />}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/movies" element={<Movie />} />
        <Route path="/tv-series" element={<TvSeries />} />
        <Route path="/contentdescription" element={<ContentDesc />} />
        <Route path="/searched" element={<Searched />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        {/* Add more routes as needed */}
      </Routes>
    </div>
  );
}
export default App;
