import React, { useState } from "react";
import "./Searchbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { fetchContentByName } from "../../store";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchvalue, setsearchValue] = useState(null);
  const handleChange = (value) => {
    setsearchValue(value);
  };
  const handlesubmit = (e) => {
    if (e.type === "click") {
      dispatch(fetchContentByName(searchvalue));
      navigate("/searched");
    }
    if (e.key === "Enter") {
      dispatch(fetchContentByName(searchvalue));
      navigate("/searched");
    }
  };
  return (
    <div className="search-bar">
      <FontAwesomeIcon
        icon={faSearch}
        className={`search-icon ${searchvalue ? "active" : ""}`}
        onClick={(e) => handlesubmit(e)}
      />
      <input
        type="text"
        value={searchvalue}
        placeholder="Search for movies or TV series"
        onKeyDown={(e) => handlesubmit(e)}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
}
