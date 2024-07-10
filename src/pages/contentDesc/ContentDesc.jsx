import React from "react";
import { useEffect } from "react";
import MovieDesc from "../../components/movieDesc/movieDesc";
import SearchBar from "../../components/searchbar/Searchbar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function ContentDesc() {
  const navigate = useNavigate();
  const contentDescription = useSelector((state) => state.netflix.cast);
  console.log("content ... ", contentDescription);
  useEffect(() => {
    const handleKeyDown = (e) => {
      console.log("key pressed");
      if (e.key === "Escape") {
        navigate(-1);
      }
    };

    // Add event listener for keydown
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);
  return (
    <>
      {contentDescription && (
        <div className="content-container">
          <SearchBar />
          <MovieDesc cast={contentDescription} />
        </div>
      )}
      {!contentDescription && (
        <div
          style={{
            position: "fixed",
            color: "white",
            top: "50%",
            left: "50%",
            transform: "translateY(-50%) translateX(-50%)",
          }}
        >
          loading...
        </div>
      )}
    </>
  );
}
