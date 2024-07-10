import React from "react";
import "./Arrow.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
export default function Arrow({ handleArrowClick, type }) {
  return (
    <div className="arrows">
      <button
        className={`arrow-${type}`}
        value={`${type}`}
        onClick={(e) => handleArrowClick(e, `${type}`)}
      >
        {type === "left" ? (
          <FontAwesomeIcon icon={faArrowLeft} />
        ) : (
          <FontAwesomeIcon icon={faArrowRight} />
        )}
      </button>
    </div>
  );
}
