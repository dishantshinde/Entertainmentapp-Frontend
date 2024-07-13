import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { firebaseAuth } from "../../utils/firebase-config";

const apiUrl = process.env.REACT_APP_API_URL; // Use the environment variable

export default function Login() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (currentUser) navigate("/");
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { email, password } = formValues;
      await signInWithEmailAndPassword(firebaseAuth, email, password);

      // Optionally, you can send a request to the backend if needed
      // For example, to log the login event
      await axios.post(`${apiUrl}/user/login`, { email });

      navigate("/"); // Redirect to home page or wherever needed
    } catch (err) {
      console.error(err);
      alert("Error logging in: " + err.message);
    }
  };

  return (
    <div className="container">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formValues.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formValues.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Log In to Your Account</button>
        <span className="signup-prompt">
          Don't have an account? <a href="/signup">Sign Up</a>
        </span>
      </form>
    </div>
  );
}
