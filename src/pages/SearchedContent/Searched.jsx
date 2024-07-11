import React from "react";
import { useSelector } from "react-redux";
import MsCont from "../../components/movie-series-container/ms-cont";
import SearchBar from "../../components/searchbar/Searchbar";
export default function Searched() {
  const searchresults = useSelector((state) => state.netflix.searched);
  console.log("searched data", searchresults);
  return (
    <div className="content-container">
      <SearchBar searchedHistory={searchresults.searchedtext} />
      <div className="searched-results">
        <h3>{`Found ${searchresults.data.length} results for '${searchresults.searchedtext}'`}</h3>
      </div>
      <MsCont data={searchresults.data} contentType="movie" />
    </div>
  );
}
