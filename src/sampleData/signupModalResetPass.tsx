import { useState } from "react";
import { Modal } from "react-bootstrap";
import { IoEyeOutline } from "react-icons/io5";
import fbLogo from "../assets/fbLogo.png";
import GoogleLogo from "../assets/GoogleLogo.png";
import SignupImg from "../assets/SignupImg.png";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import { REACT_APP_BASE_URL } from "../config";
import avatarGenerator from "../utils/avatarGenerator";
import { useSetRecoilState } from "recoil";
import { userState } from "../store/atoms/user";
import { useNavigate } from "react-router-dom";

const SignupModal = ({ show, handleClose }: any) => {
  const [isSignIn, setIsSignIn] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const setUserState = useSetRecoilState(userState);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const navigate = useNavigate();

  const handleShowSignin = () => {
    setIsSignIn(true);
    setIsForgotPassword(false);
  };

  const handleShowSignup = () => {
    setIsSignIn(false);
    setIsForgotPassword(false);
  };

  /* const handleForgotPassword = async () => {
    try {
      const response = await axios.post(
        `${REACT_APP_BASE_URL}/api/auth/reset-password-token`,
        { email }
      );
      console.log(response.data);
      alert(response.data.message);
    } catch (error) {
      console.error("Forgot Password Error:", error);
    }
  }; */

  const handleSignIn = async () => {
    try {
      const response = await axios.post(
        `${REACT_APP_BASE_URL}/api/auth/login`,
        { email, password }
      );
      const { data } = response;

      /* // Generate avatar image link
      const imgLink = avatarGenerator(data.user.email?.split("@")[0]);

      // Update user object with avatar image and isAvatarImageSet
      const user = {
        ...data.user,
        isAvatarImageSet: true,
        avatarImage: imgLink,
      }; */

      console.log("Inside signin - ", data);
      setUserState({
        isLoading: false,
        userEmail: data.email,
        user: data,
      });

      // Store user details in localStorage
      localStorage.setItem("user", JSON.stringify(data.userDetails));
      localStorage.setItem("token", data.token);

      // Close the modal upon successful login
      handleClose();
      window.location.reload();
    } catch (error) {
      console.error("Sign In Error:", error);
      // Handle error states or feedback to the user
    }
  };

  const handleSignUp = async () => {
    try {
      const response = await axios.post(
        `${REACT_APP_BASE_URL}/api/auth/signup`,
        { username, email, password, confirmPassword }
      );
      const { data } = response;

      // Generate avatar image link
      const imgLink = avatarGenerator(email?.split("@")[0]);

      // Update user object with avatar image and isAvatarImageSet
      const user = {
        ...data.user,
        isAvatarImageSet: true,
        avatarImage: imgLink,
      };

      // Store user details in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", data.token);

      // Close the modal upon successful signup
      handleClose();
      window.location.reload();
    } catch (error) {
      console.error("Sign Up Error:", error);
      // Handle error states or feedback to the user
    }
  };

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const token = location.pathname.split("/").at(-1);
      const response = await axios.post(
        `${REACT_APP_BASE_URL}/api/auth/reset-password/${token}`,
        { newPassword, confirmNewPassword }
      );
      // console.log(response.data);
      if (response.data.success) {
        alert("Password reset successful");
        navigate("/"); // Adjust based on your routing
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Reset Password Error:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <div
        className={`${
          isSignIn
            ? "lg:w-[750px] lg:h-[460px] sm:w-[490px]"
            : "lg:w-[750px] lg:h-[490px] sm:w-[490px]"
        } 
        ${isForgotPassword ? "lg:h-[500px]" : ""}
        lg:block bg-white border rounded-lg overflow-hidden relative `}
      >
        <div
          className={`w-full h-12 lg:bg-[#EFFFF4] rounded-t-lg flex items-center justify-center relative`}
        >
          <p className="text-[#008A45] font-semibold text-sm hidden lg:block">
            Let's learn, share & inspire each other with our passion for
            computer engineering. {isSignIn ? "Sign in" : "Sign up"} now 🤘🏼
          </p>
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            onClick={handleClose}
          >
            <AiOutlineClose size={20} />
          </button>
        </div>
        <div className="flex bg-white">
          <div className="lg:w-[50%] w-[100%] p-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-2xl font-bold">
                {isForgotPassword
                  ? "Reset Password"
                  : isSignIn
                  ? "Sign In"
                  : "Create Account"}
              </p>
            </div>
            {isForgotPassword ? (
              <div className="flex flex-col ">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-800 text-gray-800 w-full p-2 bg-[#F7F8FA]"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border border-gray-800 text-gray-800 w-full p-2 bg-[#F7F8FA]"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="border border-gray-800 text-gray-800 w-full p-2 bg-[#F7F8FA]"
                />
                <button
                  className="mt-4 py-2 bg-blue-600 text-white rounded-full font-semibold"
                  onClick={handleResetPassword}
                >
                  Reset Password
                </button>
                <p
                  className="mt-4 text-blue-700 cursor-pointer"
                  onClick={() => setIsForgotPassword(false)}
                >
                  Back to Sign In
                </p>
              </div>
            ) : (
              <div className="flex flex-col space-y-0">
                {!isSignIn && (
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="border border-gray-800 text-gray-800 w-full p-2 bg-[#F7F8FA]"
                    />
                  </div>
                )}
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-800 text-gray-800 w-full p-2 bg-[#F7F8FA]"
                />
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-800 text-gray-800 w-full p-2 bg-[#F7F8FA]"
                  />
                  <IoEyeOutline className="absolute top-3 right-2 text-gray-500" />
                </div>
                {!isSignIn && (
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border border-gray-800 text-gray-800 w-full p-2 bg-[#F7F8FA]"
                  />
                )}
              </div>
            )}
            {!isForgotPassword && (
              <div
                className="flex items-center justify-between"
                onClick={() => (isSignIn ? handleSignIn() : handleSignUp())}
              >
                <button className="lg:w-full w-[50%] mt-4 py-2 bg-blue-600 text-white rounded-full font-semibold">
                  {isSignIn ? "Sign In" : "Create Account"}
                </button>
                <p
                  className="mt-4 hover:underline lg:hidden"
                  onClick={isSignIn ? handleShowSignup : handleShowSignin}
                >
                  {isSignIn ? "or, Create Account" : "or, Sign In"}
                </p>
              </div>
            )}
            <div className="flex flex-col items-center space-y-2 mt-4">
              <div className="flex cursor-pointer items-center justify-center font-medium border border-gray-300 rounded w-full py-2">
                <img src={fbLogo} alt="FB Logo" className="w-5 h-5 mr-2" />
                <p className="text-sm">Sign up with Facebook</p>
              </div>
              <div className="flex cursor-pointer items-center justify-center font-medium border border-gray-300 rounded w-full py-2">
                <img
                  src={GoogleLogo}
                  alt="Google Logo"
                  className="w-5 h-5 mr-2"
                />
                <p className="text-sm">Sign up with Google</p>
              </div>
              {!isSignIn && !isForgotPassword && (
                <div className="text-[15px] leading-[16px] mt-3 text-center text-gray-500 lg:hidden mx-5 ">
                  By signing up, you agree to our Terms & conditions, Privacy
                  policy
                </div>
              )}
            </div>
            {isSignIn && !isForgotPassword && (
              <div
                className="text-sm flex justify-center font-medium p-2 mt-2 cursor-pointer hover:underline"
                onClick={() => setIsForgotPassword(true)}
              >
                {" "}
                Forgot Password?
              </div>
            )}
          </div>
          <div className="lg:w-[50%] sm:w-[0%] lg:flex-col items-center justify-center p-6 font-medium hidden lg:block">
            <p className="text-sm w-full flex justify-end gap-1">
              {isSignIn
                ? "Don't have an account yet?"
                : "Already have an account?"}{" "}
              <span
                className="text-blue-700 cursor-pointer"
                onClick={isSignIn ? handleShowSignup : handleShowSignin}
              >
                {" "}
                {isSignIn ? "Create new for free" : "Sign In"}
              </span>
            </p>
            <div className="">
              <img
                src={SignupImg}
                alt="Signup"
                className="h-full mt-4 w-full object-cover rounded-r-lg"
              />
            </div>
            {!isSignIn && (
              <div className="mt-2 text-[10px] leading-[16px] text-gray-500">
                By signing up, you agree to our Terms & conditions, Privacy
                policy
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SignupModal;
