import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { userState } from "../store/atoms/user";

function InitUser() {
  const setUser = useSetRecoilState(userState);

  useEffect(() => {
    const init = async () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          const user = JSON.parse(storedUser);

          // const response = await axios.get(`${REACT_APP_BASE_URL}/api/auth/me`, {
          //   headers: {
          //     Authorization: "Bearer " + localStorage.getItem("token"),
          //   },
          // });

          // Update the user state
          setUser({
            isLoading: false,
            userEmail: user.email,
            user: user,
          });
        } else {
          // No user data found in localStorage
          setUser({
            isLoading: false,
            userEmail: null,
            user: null,
          });
        }
      } catch (error) {
        console.error("Error initializing user:", error);
        setUser({
          isLoading: false,
          userEmail: null,
          user: null,
        });
      }
    };

    init();
    // Call every 10 seconds
    const intervalId = setInterval(init, 10000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [setUser]);

  return null; // This component doesn't render anything visible
}

export default InitUser;
