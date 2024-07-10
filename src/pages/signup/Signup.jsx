import React from "react";
import "./Signup.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { firebaseAuth } from "../../utils/firebase-config";
export default function Signup() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [isPwSame, setisPwSame] = useState(false);
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const handleInputChangeforrepeatpw = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => {
      const updatedValues = {
        ...prevValues,
        [name]: value,
      };

      // Check if passwords match
      if (updatedValues.password === updatedValues.repeatPassword) {
        setisPwSame(false);
      } else {
        setisPwSame(true);
      }

      return updatedValues;
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formValues.password === formValues.repeatPassword) {
      try {
        const { email, password } = formValues;
        await createUserWithEmailAndPassword(firebaseAuth, email, password);
        alert("User created successfully!");
        navigate("/login"); // Redirect to login page or wherever needed
      } catch (err) {
        console.log(err);
        alert("Error creating user: " + err.message);
      }
    } else {
      alert("Passwords do not match.");
    }
  };
  return (
    <div className="form-container">
      <h2>Sign Up</h2>
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
        <input
          type="password"
          name="repeatPassword"
          placeholder="Repeat Password"
          value={formValues.repeatPassword}
          onChange={handleInputChangeforrepeatpw}
          required
        />
        {isPwSame && (
          <span className="check-password">check your password again !</span>
        )}
        <button type="submit">Create an Account</button>
      </form>
      <span className="login-prompt">
        Already have an account? <a href="/login">Login</a>
      </span>
    </div>
  );
}
