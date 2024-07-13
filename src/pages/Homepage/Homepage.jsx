import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMovies,
  fetchTvSeries,
  fetchUserBookmarked,
  fetchUserRecommendations,
} from "../../store";
import Slider from "../../components/slider/Slider";
import SearchBar from "../../components/searchbar/Searchbar";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../../utils/firebase-config";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const movies = useSelector((state) => state.netflix.movies);
  const tvSeries = useSelector((state) => state.netflix.tvSeries);
  const bookmarkedContent = useSelector((state) => state.netflix.bookmarked);
  const Cast = useSelector((state) => state.netflix.cast);
  const [email, setEmail] = useState(undefined);
  const userRecommendations = useSelector(
    (state) => state.netflix.recommendations
  );
  const contenttype =
    userRecommendations.length > 0 ? userRecommendations[0].media_type : "";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentuser) => {
      if (currentuser) {
        setEmail(currentuser.email);
      } else {
        navigate("/login");
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (email) {
      console.log("Fetching movies, TV series, and bookmarked content...");
      dispatch(fetchMovies({ type: "movie" }));
      dispatch(fetchTvSeries());
      dispatch(fetchUserBookmarked(email));
    }
  }, [dispatch, email]);
  useEffect(() => {
    console.log("Checking useEffect for recommendations...");
    console.log("bookmarkedContent:", bookmarkedContent);

    if (bookmarkedContent && bookmarkedContent.length > 0) {
      console.log("Accessing recommendations...");
      const firstItem = bookmarkedContent[0];
      const contentId = firstItem.id;
      const contentType = firstItem.contentType || firstItem.type;
      console.log("contenttype -", contentType);

      dispatch(fetchUserRecommendations({ contentId, contentType }));
    }
  }, [dispatch, bookmarkedContent]);

  console.log("series fetched", tvSeries);
  console.log("movies fetched", movies);
  console.log("cast fetched", Cast);
  console.log("bookmarked list", bookmarkedContent);
  console.log("user recommendations", userRecommendations);

  return (
    <div>
      <div className="content-container">
        <div className="slider-container">
          <SearchBar />
          <div className="slider-component">
            <h2>Movies</h2>
            <Slider data={movies} contentType="movie" title="Trending" />
          </div>
          {userRecommendations ? (
            <div className="slider-component">
              <Slider
                data={userRecommendations}
                contentType={contenttype}
                title="Recommendations"
              />
            </div>
          ) : (
            <h2>Add bookmarks to see Recommendations</h2>
          )}

          <div className="slider-component" style={{ marginTop: "1rem" }}>
            <h2>TV-Series</h2>
            <Slider data={tvSeries} contentType="tv-series" title="Trending" />
          </div>
        </div>
      </div>
    </div>
  );
}
