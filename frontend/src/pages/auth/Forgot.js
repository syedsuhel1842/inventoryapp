import React, { useState } from "react";
import styles from "./auth.module.scss";
import { AiOutlineMail, AiOutlineArrowLeft } from "react-icons/ai";
import Card from "../../components/card/Card";
import { Link } from "react-router-dom";
import { forgotPassword, validateEmail } from "../../services/authService";
import { toast } from "react-toastify";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const forgot = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error("Please enter an email");
    }

    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }

    setIsLoading(true);
    try {
      const userData = { email };
      await forgotPassword(userData);
      toast.success("Password reset email sent. Please check your inbox.");
      setEmail("");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`container ${styles.auth}`}>
      <Card cardClass={styles.card}>
        <div className={styles.header}>
          <Link to="/login" className={styles.backButton}>
            <AiOutlineArrowLeft size={20} />
          </Link>
          <h2>Reset Password</h2>
        </div>
        
        <div className={styles.iconContainer}>
          <div className={styles.iconWrapper}>
            <AiOutlineMail size={40} color="#4f46e5" />
          </div>
          <p className={styles.subtitle}>Enter your email to receive a password reset link</p>
        </div>

        <form onSubmit={forgot} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              required
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className={`--btn --btn-primary --btn-block ${isLoading ? '--btn-disabled' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div className={styles.footer}>
            <p>
              Remember your password? <Link to="/login">Sign In</Link>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Forgot;
