import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { firebaseAuth } from "../../utils/firebase-config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  faHome,
  faFilm,
  faTv,
  faClapperboard,
  faBookmark,
  faUser,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  console.log("Navbar rendered"); // Debug log
  const [userEmail, setuserEmail] = useState();
  const [displayUser, setdisplayUser] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) {
        setuserEmail(currentUser.email);
      } else {
        setuserEmail(null);
      }
    });

    return () => unsubscribe();
  }, []);
  const handledisplayUser = () => {
    setTimeout(() => {
      setdisplayUser(false);
    }, 3000);
  };
  const handleSignout = () => {
    signOut(firebaseAuth)
      .then(() => {
        navigate("/login"); // Redirect to login page
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };
  return (
    <div className="navbar">
      <div className="clapperboard-icon">
        <FontAwesomeIcon icon={faClapperboard} />
      </div>
      <div className="link-icon">
        {" "}
        <Link
          to="/"
          className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
        >
          <FontAwesomeIcon icon={faHome} />
        </Link>
        <Link
          to="/movies"
          className={`nav-link ${
            location.pathname === "/movies" ? "active" : ""
          }`}
        >
          <FontAwesomeIcon icon={faFilm} />
        </Link>
        <Link
          to="/tv-series"
          className={`nav-link ${
            location.pathname === "/tv-series" ? "active" : ""
          }`}
        >
          <FontAwesomeIcon icon={faTv} />
        </Link>
        <Link
          to="/bookmarks"
          className={`nav-link ${
            location.pathname === "/bookmarks" ? "active" : ""
          }`}
        >
          <FontAwesomeIcon icon={faBookmark} />
        </Link>
      </div>
      <div
        className="user-icon"
        onClick={() => setdisplayUser((prev) => !prev)}
      >
        <FontAwesomeIcon
          icon={faUser}
          onMouseEnter={() => setdisplayUser(true)}
          onMouseLeave={() => handledisplayUser()}
        />
        {displayUser && (
          <div className="signout">
            <span>User: {userEmail}</span>
            <button className="signout-btn" onClick={() => handleSignout()}>
              <FontAwesomeIcon icon={faSignOut} />
              sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
