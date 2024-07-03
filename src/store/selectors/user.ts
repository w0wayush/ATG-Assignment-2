import { userState } from "../atoms/user";
import { selector } from "recoil";

export const isUserLoading = selector({
  key: "userLoadingState",
  get: ({ get }) => {
    const state = get(userState);

    return state.isLoading;
  },
});

export const userEmailState = selector({
  key: "userEmailState",
  get: ({ get }) => {
    const state = get(userState);

    return state.userEmail;
  },
});

export const userDetails = selector({
  key: "userDetailState",
  get: ({ get }) => {
    const state = get(userState);

    return state.user;
  },
});

export const userAvatarImage = selector({
  key: "userAvatarState",
  get: ({ get }) => {
    const state = get(userState);
    if (state.user) {
      //@ts-ignore
      return state.user.avatarImage;
    }
    return "";
  },
});

export const userId = selector({
  key: "userIdState",
  get: ({ get }) => {
    const state = get(userState);
    if (state.user) {
      //@ts-ignore
      return state.user._id;
    }
    return "";
  },
});

export const userName = selector({
  key: "userNameState",
  get: ({ get }) => {
    const state = get(userState);
    if (state.user) {
      //@ts-ignore
      return state.user.username;
    }
    return "";
  },
});
