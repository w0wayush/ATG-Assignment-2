import { useState, useEffect, useRef } from "react";
import axios from "axios";
import PostComponent from "../components/PostComponent";
import spinner from "../assets/loader.gif";
import { REACT_APP_BASE_URL } from "../config";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { postState } from "../store/atoms/post";
import { postDetails } from "../store/selectors/post";
import { samplePosts } from "../sampleData/samplePostData";
// import { userId } from "../store/selectors/user";

const PostSection = () => {
  const setPosts = useSetRecoilState(postState);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const loader = useRef(null);
  const posts = useRecoilValue(postDetails);
  //@ts-ignore
  const [liked, setLiked] = useState(false);
  // const currentUserId = useRecoilValue(userId);
  // console.log("Posts - ", posts);

  /* useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const response = await axios.get(
          `${REACT_APP_BASE_URL}/api/posts/check-like/${posts._id}/${currentUserId}`
        );
        setLiked(response.data.liked);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    checkLikeStatus();
  }, [posts._id, currentUserId]); */

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${REACT_APP_BASE_URL}/api/posts/public `
        );
        const fetchedPosts = response.data.data;

        // console.log("Fetched posts - ", fetchedPosts);

        if (fetchedPosts.length === 0) {
          setHasMorePosts(false); // No more posts to load
          setLoading(false);
          return;
        }

        // Update Recoil state with fetched posts
        setPosts({
          isLoading: false,
          //@ts-ignore
          post: [...posts, ...fetchedPosts, ...samplePosts],
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
        // Handle error state or display error message
      }
    };

    // Fetch posts when page changes
    fetchPosts();
  }, [page, setPosts]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "40px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, []);

  //@ts-ignore
  const handleObserver = (entries: any) => {
    const target = entries[0];
    if (target.isIntersecting && !loading && hasMorePosts) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="container mx-auto">
      {/* Posts Section */}
      <div className="grid grid-cols-1 sm:grid-cols-12 md:grid-cols-8 lg:grid-cols-6 gap-4 justify-center">
        <div className="col-span-1 sm:col-start-2 sm:col-span-10 md:col-start-2 md:col-span-6 my-6 lg:col-start-3 lg:col-span-2">
          {posts.length > 0 ? (
            //@ts-ignore
            posts.map((post) => (
              <div key={post._id} className="mb-4 rounded-2xl overflow-hidden">
                <PostComponent post={post} liked={liked} />
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-80">
              <p className="text-gray-500 text-xl">
                {loading ? (
                  <img src={spinner} alt="loader" className="w-48" />
                ) : (
                  "No posts available."
                )}
              </p>
            </div>
          )}
          {loading && (
            <div className="flex justify-center items-center mt-4">
              <img src={spinner} alt="loader" className="w-48" />
            </div>
          )}
          {!loading && !hasMorePosts && (
            <div className="flex justify-center items-center mt-4">
              <p className="text-gray-500 text-xl">No more posts available.</p>
            </div>
          )}
          <div ref={loader}></div>
        </div>
      </div>
    </div>
  );
};

export default PostSection;
