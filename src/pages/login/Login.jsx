import React, { useState } from "react";
import "./Login.css";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { firebaseAuth } from "../../utils/firebase-config";
export default function Login() {
  const navigate = useNavigate();
  // Initialize state for form values
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  onAuthStateChanged(firebaseAuth, (currentuser) => {
    if (currentuser) navigate("/");
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { email, password } = formValues;
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      navigate("/"); // Redirect to the home page or dashboard after successful login
    } catch (err) {
      console.error(err);
      alert("Error logging", err.message);
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
