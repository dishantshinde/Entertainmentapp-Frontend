import React from "react";
import "./movieDesc.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as filledStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";

export default function MovieDesc({ cast }) {
  if (!cast) {
    return null; // Render nothing if cast is null
  }
  const displayNames = new Intl.DisplayNames(["en"], { type: "language" });
  const totalStars = 10;
  const contentType = cast.ContentType;
  const stars = Array.from({ length: totalStars }, (_, i) => (
    <Star filled={cast.rating >= i + 1} key={i} />
  ));

  return (
    <div className="condition-container">
      <div className="movie-desc">
        <div className="movie-poster">
          <img
            src={`https://image.tmdb.org/t/p/w500${cast.poster_path}`}
            alt={cast.name}
          />
        </div>
        <div className="movie-details">
          <h1>{cast.name}</h1>
          <div className="star-component">
            <span>{cast.rating.toFixed(1)}</span>
            <div className="star-container">{stars}</div>
          </div>
          <div className="movie-subdetails">
            <div>
              <span>
                {contentType === "movie" ? "Length" : "No. of Episodes"}
              </span>
              <span>
                {contentType === "movie"
                  ? `${cast.runtime} min.`
                  : `${cast.runtime} episodes.`}
              </span>
            </div>
            <div>
              <span>Language</span>
              <span>{displayNames.of(cast.language)}</span>
            </div>
            <div>
              <span>Year</span>
              <span>{cast.releaseYear}</span>
            </div>
            <div>
              <span>Status</span>
              <span>{cast.status}</span>
            </div>
          </div>
          <div className="genres">
            <h3>Genres</h3>
            <div>
              {cast.genres.map((genre) => {
                return <span>{genre.name}</span>;
              })}
            </div>
          </div>
          {window.innerWidth > 820 && (
            <div className="synopsis">
              <h3>Synopsis</h3>
              <p>{cast.overview}</p>
            </div>
          )}
          {window.innerWidth > 820 && (
            <div className="casts">
              <h3>Casts</h3>
              <div>
                {cast.cast.map((a) => {
                  return <span>{a}</span>;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      {window.innerWidth < 820 && (
        <div className="screen-conditional-details">
          <div className="synopsis">
            <h3>Synopsis</h3>
            <p>{cast.overview}</p>
          </div>
          <div className="casts">
            <h3>Casts</h3>
            <div>
              {cast.cast.map((a) => {
                return <span>{a}</span>;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Star = ({ filled }) => {
  return <FontAwesomeIcon icon={filled ? filledStar : emptyStar} />;
};
