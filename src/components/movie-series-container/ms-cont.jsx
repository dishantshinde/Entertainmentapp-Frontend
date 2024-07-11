import React, { useState, useEffect } from "react";
import "./ms-cont.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilm,
  faTv,
  faStar,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark as emptyBookmark } from "@fortawesome/free-regular-svg-icons";
import { useDispatch } from "react-redux";
import { fetchCast } from "../../store";
import { useNavigate } from "react-router-dom";
import { firebaseAuth } from "./../../utils/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";

export default function MsCont({
  data,
  title,
  contentType = "movie",
  bookmarked = null,
  setBookmarkchange,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState(undefined);
  const [bookmarkedItems, setBookmarkedItems] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentuser) => {
      if (currentuser) setEmail(currentuser.email);
      else navigate("/login");
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (bookmarked) {
      const initialBookmarked = bookmarked.reduce((acc, item) => {
        acc[item.id] = true;
        return acc;
      }, {});
      setBookmarkedItems(initialBookmarked);
    }
  }, [bookmarked]);

  const handleClick = (id, type) => {
    if (type === "movie") {
      console.log("fetching movie");
      dispatch(fetchCast({ type: "movie", id: id }));
      navigate("/contentdescription");
    } else {
      console.log("fetching series");
      dispatch(fetchCast({ type: "tv", id: id }));
      navigate("/contentdescription");
    }
  };

  const handleBookmarkToggle = (id, isBookmarked) => {
    setBookmarkedItems((prev) => ({
      ...prev,
      [id]: isBookmarked,
    }));
  };

  return (
    <div className="msCont">
      <h2>{title}</h2>
      <div className="msGrid">
        {data.map((item) => {
          return (
            <GridItem
              item={item}
              key={item.id}
              contentType={contentType}
              handleClick={handleClick}
              email={email}
              isBookmarked={!!bookmarkedItems[item.id]}
              handleBookmarkToggle={handleBookmarkToggle}
              setBookmarkchange={setBookmarkchange}
            />
          );
        })}
      </div>
    </div>
  );
}

function GridItem({
  item,
  contentType,
  handleClick,
  email,
  isBookmarked,
  handleBookmarkToggle,
  setBookmarkchange,
}) {
  const type = item.media_type ? item.media_type : null;

  const addToBookmarked = async (item) => {
    try {
      await axios.post(
        "https://entertainmentapp-backend-nt3b.onrender.com/api/user/add",
        {
          email,
          data: item,
        }
      );
      console.log("added to bookmarked list from client");
      handleBookmarkToggle(item.id, true);
    } catch (error) {
      console.log("error", error);
    }
  };

  const removeFromBookmarked = async (item) => {
    try {
      await axios.put(
        "https://entertainmentapp-backend-nt3b.onrender.com/api/user/remove",
        {
          email,
          movieId: item.id,
        }
      );
      console.log("removed from bookmarked list from client");
      handleBookmarkToggle(item.id, false);
      setBookmarkchange((prev) => !prev);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div
      className="grid-item"
      onClick={() => handleClick(item.id, type || contentType)}
    >
      <div className="item-img">
        <img
          src={`https://image.tmdb.org/t/p/w500${
            item.image || item.backdrop_path
          }`}
          alt={item.name}
        />
      </div>
      <div className="item-bookmark-icon">
        <span>
          {!isBookmarked ? (
            <FontAwesomeIcon
              icon={emptyBookmark}
              onClick={(e) => {
                e.stopPropagation();
                addToBookmarked(item);
              }}
            />
          ) : (
            <FontAwesomeIcon
              icon={faBookmark}
              onClick={(e) => {
                e.stopPropagation();
                removeFromBookmarked(item);
              }}
            />
          )}
        </span>
      </div>
      <div className="item-desc">
        <div className="item-details">
          <span>
            {item.releaseYear ||
              (item.first_air_date && item.first_air_date.split("-")[0]) ||
              (item.release_date && item.release_date.split("-")[0]) ||
              "unknown"}
          </span>
          <span>&#x2022;</span>
          <span>
            <span className="movie-icon">
              {contentType === "movie" ? (
                <FontAwesomeIcon icon={faFilm} />
              ) : (
                <FontAwesomeIcon icon={faTv} />
              )}
            </span>
            {item.media_type === "tv" ? "Tv-series" : "Movie"}
          </span>
          <span>&#x2022;</span>
          <span>
            {item.certification || (
              <span className="rating">
                {item.vote_average.toFixed(1)} <FontAwesomeIcon icon={faStar} />{" "}
              </span>
            )}
          </span>
        </div>
        <h4>{item.name || item.original_name || item.original_title}</h4>
      </div>
    </div>
  );
}
