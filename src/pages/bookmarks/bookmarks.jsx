import React, { useState, useEffect } from "react";
import SearchBar from "./../../components/searchbar/Searchbar";
import MsCont from "../../components/movie-series-container/ms-cont";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBookmarked } from "../../store";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../../utils/firebase-config";
import { useNavigate } from "react-router-dom";

export default function Bookmarks() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const bookmarkedContent = useSelector((state) => state.netflix.bookmarked);
  const [email, setEmail] = useState(undefined);
  const [bookmarkchange, setBookmarkchange] = useState(false);
  console.log("bookmarked content array", bookmarkedContent);

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
      dispatch(fetchUserBookmarked(email));
    }
  }, [email, dispatch, bookmarkchange]);

  return (
    <div className="content-container">
      <SearchBar />
      <MsCont
        data={bookmarkedContent}
        title={"Bookmarks"}
        bookmarked={bookmarkedContent}
        key={JSON.stringify(bookmarkedContent)}
        setBookmarkchange={setBookmarkchange}
      />
    </div>
  );
}
