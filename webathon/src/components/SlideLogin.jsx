import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { UserAuth } from "../context/AuthContext";
import { auth } from "../firebaseConfig";
import { sendEmailVerification } from "firebase/auth";
import { FaSpinner } from "react-icons/fa";
import "./login.css";

const SlideLogin = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("");
  const [emailPlaceholder, setEmailPlaceholder] = useState("@vishnu.edu.in");

  const [isLoading, setIsLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const navigate = useNavigate();
  const { signIn } = UserAuth();

  const { createUser } = UserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]*@vishnu\.edu\.in$/.test(email)) {
      toast.error(
        "Please enter a valid email address ending with @vishnu.edu.in"
      );
      return;
    }
    setIsLoading(true);
    try {
      await createUser(email, password);
      await sendEmailVerification(auth.currentUser); // Use the auth object
    } catch (e) {
      toast.success(
        "Registered Successfully. Please check your email for verification."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(loginEmail, loginPassword);

      const user = auth.currentUser;
      if (user && !user.emailVerified) {
        toast.warning("Please verify your email before logging in.");
      } else {
        navigate("/dashboard");
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsSignup(!isSignup);
  };
  // const handleForgotPassword = async () => {
  //   try {
  //     await sendPasswordResetEmail(loginEmail);
  //     toast.success("Password reset email sent. Check your inbox.");
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };

  return (
    <div className="body">
      <div className={`cont ${isSignup ? "right-panel-active" : ""}`}>
        <div className="form-cont sign-up-cont">
          <div className="font-thin text-sm pl-2 pt-1 ">
            <Link to="/">
              <FontAwesomeIcon icon={faHome} />
            </Link>
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <h1 className="h1 sm:text-3xl">Create Account</h1>
            <input
              className="input  "
              type="email"
              name="email"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              placeholder="@vishnu.edu.in"
            />
            <input
              className="input "
              type="password"
              name="password"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              placeholder="Password"
            />
            <button className="button" type="submit" disabled={isLoading}>
              {isLoading ? (<>
                <FaSpinner size={20} className="animate-spin ml-1" />
              </>) : (
                "Sign Up"
              )}
            </button>
          </form>
        </div>
        <div className="form-cont sign-in-cont">
          <div className="font-thin text-sm pl-2 pt-1 ">
            <Link to="/">
              <FontAwesomeIcon icon={faHome} />
            </Link>
          </div>
          <form onSubmit={handleLoginSubmit} className="form">
            <h1 className="h1 sm:text-3xl">Sign In</h1>
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <input type="radio" id="loginStudent" name="loginRole" value="student"
                onChange={(e) => {
                  setUserRole(e.target.value);
                  setEmailPlaceholder("@vishnu.edu.in");
                }}
              />
              <label htmlFor="loginStudent">Student</label>

              <input type="radio" id="loginCoordinator" name="loginRole" value="coordinator"
                onChange={(e) => {
                  setUserRole(e.target.value);
                  setEmailPlaceholder("@gmail.com");
                }}
              />
              <label htmlFor="loginCoordinator">Coordinator</label>

              <input type="radio" id="loginAdmin" name="loginRole" value="admin"
                onChange={(e) => {
                  setUserRole(e.target.value);
                  setEmailPlaceholder("@gmail.com");
                }}
              />
              <label htmlFor="loginAdmin">Admin</label>
            </div>
            <input
              className="input"
              type="email"
              name="email"
              placeholder={emailPlaceholder}
              onChange={(event) => {
                setLoginEmail(event.target.value);
              }}
            />

            <input
              className="input "
              type="password"
              name="password"
              onChange={(event) => {
                setLoginPassword(event.target.value);
              }}
              placeholder="Password"
            />
            {/* <button className="text-[12px]" onClick={handleForgotPassword}>
            Forgot Your Password?
          </button> */}
            <button className="button" type="submit" disabled={isLoading}>
              {isLoading ? (<>
                <FaSpinner size={20} className="animate-spin ml-1" />
              </>) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
        <div className="overlay-cont">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="h1 sm:text-3xl">Welcome Back!</h1>
              <p className="p">
                To keep connected with us please login with your personal info
              </p>
              <button className="button ghost" onClick={toggleForm}>
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right ">
              <h1 className="h1 sm:text-3xl">Hello, Friend!</h1>
              <p className="p">
                Enter your details and start the journey with us
              </p>
              <button className="button ghost" onClick={toggleForm}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideLogin;
