import { useState } from "react";
import PostSection from "./PostSection";
import { useRecoilValue } from "recoil";
import { userEmailState } from "../store/selectors/user";
import CreatePost from "../components/CreatePost";
import { SlPencil } from "react-icons/sl";

const Home = () => {
  //@ts-ignore
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  //@ts-ignore
  const userEmail = useRecoilValue(userEmailState);
  //@ts-ignore
  const openCreatePostModal = () => {
    setShowCreatePostModal(true);
  };
  //@ts-ignore
  const closeCreatePostModal = () => {
    setShowCreatePostModal(false);
  };

  return (
    <div className="min-h-screen bg-pattern mt-20">
      <div className="container mx-auto px-2 py-2">
        <PostSection />
      </div>
      {/* Button for small screens */}
      {userEmail && (
        <button
          className="fixed bottom-4 right-4 bg-myPink hover:bg-myPurple text-white px-4 py-4 rounded-full shadow-md lg:hidden "
          onClick={openCreatePostModal}
        >
          <SlPencil size={28} />
        </button>
      )}
      <CreatePost
        show={showCreatePostModal}
        handleClose={closeCreatePostModal}
      />
    </div>
  );
};

export default Home;
