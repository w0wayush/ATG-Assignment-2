import { useState } from "react";
import SignupModal from "../components/SignupModal";
import SearchBar from "../components/SearchBar";
import Logo from "../assets/Logo.png";
import Logo2 from "../assets/Logo2.png";
import UserHeaderProfile from "../components/UserHeaderProfile";
import { useRecoilValue } from "recoil";
import { userDetails } from "../store/selectors/user";
import { useNavigate } from "react-router-dom";
import CreatePost from "../components/CreatePost"; // Import the CreatePost component

const Navbar = () => {
  const user = useRecoilValue(userDetails);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const navigate = useNavigate();
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  const openCreatePostModal = () => {
    setShowCreatePostModal(true);
  };

  const closeCreatePostModal = () => {
    setShowCreatePostModal(false);
  };

  const handleLogOut = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleSignupModalClose = () => {
    setShowSignupModal(false);
  };

  return (
    <div className="flex sm:flex-row gap-5 items-center justify-between drop-shadow-md bg-gradient-to-r from-myPink to-myPurple px-5 py-2 md:py-3 text-white w-full h-24 fixed top-0 z-50">
      <img
        className="lg:w-[280px] lg:h-[60px] md:w-[200px] md:h-[40px] drop-shadow-md cursor-pointer md:block hidden"
        src={Logo}
        alt="logo"
      />

      <img
        className="w-[70px] h-[60px] drop-shadow-md cursor-pointer md:hidden block"
        src={Logo2}
        alt="logo"
      />

      <SearchBar />

      {user ? (
        <div className="flex gap-4 items-center">
          <div className="hidden lg:block py-1">
            <button className="learn-more" onClick={openCreatePostModal}>
              Create Post
            </button>
          </div>

          <CreatePost
            show={showCreatePostModal}
            handleClose={closeCreatePostModal}
          />

          <div className="group relative flex gap-4 items-center">
            <UserHeaderProfile user={user} />
            <div className="absolute top-12 left-3 lg:top-13 lg:left-20 rotate-45 p-2 hidden group-hover:block w-5 h-5 min-w-max bg-white"></div>
            <div className="absolute top-8 -right-6  lg:top-8 lg:left-3 pt-6 hidden group-hover:block w-full min-w-max">
              <ul className="w-full bg-white overflow-hidden cursor-pointer rounded-md shadow-md text-gray-700 pt-1">
                <li className="hover:bg-gray-200 py-2 px-4 block cursor-pointer">
                  Profile
                </li>
                <li
                  onClick={handleLogOut}
                  className="hover:bg-gray-200 py-2 px-4 flex items-center gap-4 cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="flex gap-1 cursor-pointer"
          onClick={() => setShowSignupModal(true)}
        >
          Create Account.{" "}
          <span className="text-blue-300 hidden lg:block">It's Free</span>
        </div>
      )}

      <SignupModal
        show={showSignupModal}
        handleClose={handleSignupModalClose}
      />
    </div>
  );
};

export default Navbar;
