import React, { useState, useCallback, useEffect } from "react";
import "./Slider.css";
import Arrow from "../arrowkeys/Arrow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilm } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCast } from "./../../store/index";

export default function Slider({ data, contentType, title }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sliderPosition, setSliderPosition] = useState(0);
  const [showArrow, setshowArrow] = useState(false);
  const handleSelect = (id, type) => {
    if (type === "movie") {
      dispatch(fetchCast({ type: "movie", id: id }));
      navigate("/contentdescription");
    } else {
      dispatch(fetchCast({ type: "tv", id: id }));
      console.log("fetching series");
      navigate("/contentdescription");
    }
  };
  const handleArrowClick = useCallback(
    (e, direction) => {
      if (direction === "left" && sliderPosition < 0) {
        setSliderPosition((prevState) => prevState + 1);
      } else if (
        direction === "right" &&
        sliderPosition > [-(data.length - 3)]
      ) {
        setSliderPosition((prevState) => prevState - 1);
      }
    },
    [sliderPosition, data.length]
  );
  useEffect(() => {
    if (window.innerWidth <= 821) {
      setshowArrow(true);
    }
  }, []);

  return (
    <div className="slider">
      <CreateSlider
        data={data}
        handleArrowClick={handleArrowClick}
        sliderPosition={sliderPosition}
        showArrow={showArrow}
        setshowArrow={setshowArrow}
        handleSelect={handleSelect}
        contentType={contentType}
        title={title}
      />
    </div>
  );
}
function CreateSlider({
  data,
  handleArrowClick,
  sliderPosition,
  showArrow,
  setshowArrow,
  handleSelect,
  contentType,
  title,
}) {
  return (
    <div className="createSlider">
      <h3>{title}</h3>
      <div
        className="data-list-container"
        onMouseEnter={() => setshowArrow(true)}
        onMouseLeave={() => setshowArrow(false)}
      >
        {showArrow && <Arrow handleArrowClick={handleArrowClick} type="left" />}
        <div
          className="data-list"
          style={{
            transform: `translateX(${
              window.innerWidth <= 480
                ? sliderPosition * 360
                : sliderPosition * 420
            }px)`,
          }}
        >
          {data.map((show) => (
            <SliderCard
              key={show.id}
              show={show}
              handleSelect={handleSelect}
              contentType={contentType}
            />
          ))}
        </div>
        {showArrow && (
          <Arrow handleArrowClick={handleArrowClick} type="right" />
        )}
      </div>
    </div>
  );
}
function SliderCard({ show, handleSelect, contentType }) {
  return (
    <div className="card" onClick={() => handleSelect(show.id, contentType)}>
      <img
        src={`https://image.tmdb.org/t/p/w500${
          show.image || show.backdrop_path
        }`}
        alt={show.name || show.original_title || show.original_name}
      />
      <div className="show-desc">
        <div className="show-detail">
          <ul>
            <li>
              {show.releaseYear || show.release_date || show.first_air_date}
            </li>
            <li>
              {" "}
              <span className="movie-icon">
                <FontAwesomeIcon icon={faFilm} />
              </span>
              {show.type || show.media_type}
            </li>
            <li>{show.certification || show.vote_average.toFixed(1)}</li>
          </ul>
        </div>
        <h4>{show.name || show.original_title || show.original_name}</h4>
      </div>
    </div>
  );
}
