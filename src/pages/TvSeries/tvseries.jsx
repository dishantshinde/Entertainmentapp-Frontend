import React from "react";
import MsCont from "../../components/movie-series-container/ms-cont";
import SearchBar from "../../components/searchbar/Searchbar";
import { useSelector } from "react-redux";
export default function TvSeries() {
  const tvSeries = useSelector((state) => state.netflix.tvSeries);
  const bookmarkedContent = useSelector((state) => state.netflix.bookmarked);
  return (
    <div className="content-container">
      <SearchBar />
      <MsCont
        data={tvSeries}
        title="Tv Series list"
        contentType="tv"
        bookmarked={bookmarkedContent}
      />
    </div>
  );
}
