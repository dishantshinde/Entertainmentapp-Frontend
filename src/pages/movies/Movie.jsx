import React from "react";
import MsCont from "../../components/movie-series-container/ms-cont";
import SearchBar from "../../components/searchbar/Searchbar";
import { useSelector } from "react-redux";
export default function Movie() {
  const movies = useSelector((state) => state.netflix.movies);
  const bookmarkedContent = useSelector((state) => state.netflix.bookmarked);
  return (
    <div className="content-container">
      <SearchBar />
      <MsCont data={movies} title="Movie list" bookmarked={bookmarkedContent} />
    </div>
  );
}
